import { router, protectedProcedure, adminProcedure } from '../trpc';
import { z } from 'zod';
import { getDb, performanceAssessments, employees, departments, assessmentScores, assessmentItems, assessmentTemplates, workQualityDetails, personalGoalDetails, departmentReviewDetails, bonusDetails, penaltyDetails } from '../db';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

/**
 * 报表生成和数据分析路由
 */

/**
 * 评分统计路由
 */
const statsRouter = router({
  /**
   * 获取公司整体绩效统计
   */
  getCompanyStats: protectedProcedure
    .input(
      z.object({
        periodId: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      let where: any = {};
      if (input.periodId) {
        where.periodId = input.periodId;
      }

      const assessments = await db.query.performanceAssessments.findMany({});

      // 计算统计数据
      const approvedAssessments = assessments.filter((a: any) => a.status === 'approved');
      const totalScore = approvedAssessments.reduce((sum: number, a: any) => sum + (a.totalScore ? parseFloat(a.totalScore) : 0), 0);
      const averageScore = approvedAssessments.length > 0 ? (totalScore / approvedAssessments.length).toFixed(2) : '0';

      // 分数分布
      const scoreDistribution = {
        excellent: approvedAssessments.filter((a: any) => a.totalScore && parseFloat(a.totalScore) >= 90).length,
        good: approvedAssessments.filter((a: any) => a.totalScore && parseFloat(a.totalScore) >= 80 && parseFloat(a.totalScore) < 90).length,
        fair: approvedAssessments.filter((a: any) => a.totalScore && parseFloat(a.totalScore) >= 70 && parseFloat(a.totalScore) < 80).length,
        poor: approvedAssessments.filter((a: any) => a.totalScore && parseFloat(a.totalScore) < 70).length,
      };

      // 状态分布
      const statusDistribution = {
        draft: assessments.filter((a: any) => a.status === 'draft').length,
        submitted: assessments.filter((a: any) => a.status === 'submitted').length,
        approved: assessments.filter((a: any) => a.status === 'approved').length,
        rejected: assessments.filter((a: any) => a.status === 'rejected').length,
      };

      return {
        totalAssessments: assessments.length,
        approvedAssessments: approvedAssessments.length,
        averageScore,
        maxScore: Math.max(...approvedAssessments.map((a: any) => a.totalScore ? parseFloat(a.totalScore) : 0)),
        minScore: Math.min(...approvedAssessments.map((a: any) => a.totalScore ? parseFloat(a.totalScore) : 0)),
        scoreDistribution,
        statusDistribution,
      };
    }),

  /**
   * 获取部门绩效统计
   */
  getDepartmentStats: protectedProcedure
    .input(
      z.object({
        periodId: z.string().optional(),
        departmentId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      // 获取所有部门
      const allDepartments = await db.query.departments.findMany();

      const departmentStats = await Promise.all(
        allDepartments.map(async (dept: any) => {
          // 获取该部门的所有员工
          const deptEmployees = await db.query.employees.findMany({
            where: eq(employees.departmentId, dept.id),
          });

          const employeeIds = deptEmployees.map((e: any) => e.id);

          // 获取该部门的所有评分
          const assessments = await db.query.performanceAssessments.findMany({});

          const approvedAssessments = assessments.filter((a: any) => a.status === 'approved');
          const totalScore = approvedAssessments.reduce((sum: number, a: any) => sum + (a.totalScore ? parseFloat(a.totalScore) : 0), 0);
          const averageScore = approvedAssessments.length > 0 ? (totalScore / approvedAssessments.length).toFixed(2) : '0';

          return {
            departmentId: dept.id,
            departmentName: dept.name,
            totalEmployees: deptEmployees.length,
            totalAssessments: assessments.length,
            approvedAssessments: approvedAssessments.length,
            averageScore,
            completionRate: deptEmployees.length > 0 ? ((approvedAssessments.length / deptEmployees.length) * 100).toFixed(2) : 0,
          };
        })
      );

      return departmentStats;
    }),

  /**
   * 获取员工排名
   */
  getEmployeeRanking: protectedProcedure
    .input(
      z.object({
        periodId: z.string().optional(),
        limit: z.number().default(10),
        departmentId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      const assessments = await db.query.performanceAssessments.findMany({
        with: {
          employee: {
            with: {
              user: true,
              department: true,
              position: true,
            },
          },
        },
      });

      // 按总分排序
      const ranking = assessments
        .filter((a: any) => {
          if (input.departmentId) {
            return a.employee?.departmentId === input.departmentId;
          }
          return true;
        })
        .sort((a: any, b: any) => {
          const scoreA = a.totalScore ? parseFloat(a.totalScore) : 0;
          const scoreB = b.totalScore ? parseFloat(b.totalScore) : 0;
          return scoreB - scoreA;
        })
        .slice(0, input.limit)
        .map((a: any, index: number) => ({
          rank: index + 1,
          employeeId: a.employee?.id,
          employeeName: a.employee?.user?.name,
          departmentName: a.employee?.department?.name,
          positionName: a.employee?.position?.name,
          score: a.totalScore ? parseFloat(a.totalScore) : 0,
        }));

      return ranking;
    }),

  /**
   * 获取评分项统计
   */
  getItemStats: protectedProcedure
    .input(
      z.object({
        templateId: z.string(),
        periodId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      // 获取模板的所有评分项
      const template = await db.query.assessmentTemplates.findFirst({
        where: eq(assessmentTemplates.id, input.templateId),
        with: {
          items: true,
        },
      });

      if (!template) {
        throw new Error('Template not found');
      }

      const itemStats = await Promise.all(
        (template.items || []).map(async (item: any) => {
          // 获取该项的所有评分
          const scores = await db.query.assessmentScores.findMany({
            where: eq(assessmentScores.itemId, item.id),
          });

          const averageScore = scores.length > 0 ? (scores.reduce((sum: number, s: any) => sum + parseFloat(s.score), 0) / scores.length).toFixed(2) : 0;

          return {
            itemId: item.id,
            itemName: item.name,
            weight: item.weight,
            averageScore,
            totalScores: scores.length,
            maxScore: Math.max(...scores.map((s: any) => parseFloat(s.score))),
            minScore: Math.min(...scores.map((s: any) => parseFloat(s.score))),
          };
        })
      );

      return itemStats;
    }),
});

/**
 * 报表生成路由
 */
const generationRouter = router({
  /**
   * 生成公司绩效报告
   */
  generateCompanyReport: adminProcedure
    .input(
      z.object({
        periodId: z.string(),
        title: z.string().optional(),
        includeDetails: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const reportId = uuidv4();

      // 获取统计数据
      const stats = await db.query.performanceAssessments.findMany({
        where: eq(performanceAssessments.periodId, input.periodId),
      });

      const approvedStats = stats.filter((s: any) => s.status === 'approved');
      const totalScore = approvedStats.reduce((sum: number, s: any) => sum + (s.totalScore ? parseFloat(s.totalScore) : 0), 0);
      const averageScore = approvedStats.length > 0 ? (totalScore / approvedStats.length).toFixed(2) : 0;

      // 生成报告内容
      const reportContent = {
        title: input.title || '公司绩效报告',
        generatedAt: new Date(),
        generatedBy: ctx.user.id,
        periodId: input.periodId,
        summary: {
          totalAssessments: stats.length,
          approvedAssessments: approvedStats.length,
          averageScore,
          completionRate: stats.length > 0 ? ((approvedStats.length / stats.length) * 100).toFixed(2) : 0,
        },
        details: input.includeDetails ? approvedStats : undefined,
      };

      // 保存报告
      // 这里可以保存到数据库或文件系统
      // await db.insert(reports).values({
      //   id: reportId,
      //   title: input.title,
      //   content: JSON.stringify(reportContent),
      //   type: 'company',
      //   periodId: input.periodId,
      //   createdBy: ctx.user.id,
      // });

      return {
        reportId,
        ...reportContent,
      };
    }),

  /**
   * 生成部门绩效报告
   */
  generateDepartmentReport: adminProcedure
    .input(
      z.object({
        departmentId: z.string(),
        periodId: z.string(),
        title: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      const reportId = uuidv4();

      // 获取部门信息
      const department = await db.query.departments.findFirst({
        where: eq(departments.id, input.departmentId),
      });

      if (!department) {
        throw new Error('Department not found');
      }

      // 获取部门员工
      const deptEmployees = await db.query.employees.findMany({
        where: eq(employees.departmentId, input.departmentId),
      });

      const employeeIds = deptEmployees.map((e: any) => e.id);

      // 获取评分
      const assessments = await db.query.performanceAssessments.findMany({
        where: eq(performanceAssessments.periodId, input.periodId),
      });

      const deptAssessments = assessments.filter((a: any) => employeeIds.includes(a.employeeId));
      const approvedAssessments = deptAssessments.filter((a: any) => a.status === 'approved');

      const totalScore = approvedAssessments.reduce((sum: number, a: any) => sum + (a.totalScore ? parseFloat(a.totalScore) : 0), 0);
      const averageScore = approvedAssessments.length > 0 ? (totalScore / approvedAssessments.length).toFixed(2) : '0';

      const reportContent = {
        title: input.title || `${department.name}绩效报告`,
        generatedAt: new Date(),
        generatedBy: ctx.user.id,
        departmentId: input.departmentId,
        departmentName: department.name,
        periodId: input.periodId,
        summary: {
          totalEmployees: deptEmployees.length,
          totalAssessments: deptAssessments.length,
          approvedAssessments: approvedAssessments.length,
          averageScore,
          completionRate: deptEmployees.length > 0 ? ((approvedAssessments.length / deptEmployees.length) * 100).toFixed(2) : 0,
        },
      };

      return {
        reportId,
        ...reportContent,
      };
    }),

  /**
   * 导出报告为 CSV
   */
  exportReportAsCSV: protectedProcedure
    .input(
      z.object({
        periodId: z.string(),
        type: z.enum(['company', 'department', 'employee']),
        departmentId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      let assessments: any[] = [];

      if (input.type === 'company') {
        assessments = await db.query.performanceAssessments.findMany({
          where: eq(performanceAssessments.periodId, input.periodId),
          with: {
            employee: {
              with: {
                user: true,
                department: true,
              },
            },
          },
        });
      } else if (input.type === 'department' && input.departmentId) {
        const deptEmployees = await db.query.employees.findMany({
          where: eq(employees.departmentId, input.departmentId),
        });

        const employeeIds = deptEmployees.map((e: any) => e.id);

        assessments = await db.query.performanceAssessments.findMany({
          where: eq(performanceAssessments.periodId, input.periodId),
          with: {
            employee: {
              with: {
                user: true,
                department: true,
              },
            },
          },
        });

        assessments = assessments.filter((a: any) => employeeIds.includes(a.employeeId));
      }

      // 生成 CSV 内容
      const csvHeader = ['员工名称', '部门', '评分', '状态', '提交时间'].join(',');
      const csvRows = assessments.map((a: any) => {
        return [
          a.employee?.user?.name || '',
          a.employee?.department?.name || '',
          a.totalScore || '',
          a.status || '',
          a.submittedAt ? new Date(a.submittedAt).toLocaleString() : '',
        ].join(',');
      });

      const csvContent = [csvHeader, ...csvRows].join('\n');

      return {
        filename: `report-${input.type}-${new Date().getTime()}.csv`,
        content: csvContent,
        mimeType: 'text/csv',
      };
    }),

  /**
   * 获取趋势数据
   */
  getTrendData: protectedProcedure
    .input(
      z.object({
        departmentId: z.string().optional(),
        limit: z.number().default(12),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      // 获取所有评分周期
      const periods = await db.query.assessmentPeriods.findMany({
        orderBy: (periods: any) => [desc(periods.startDate)],
        limit: input.limit,
      });

      const trendData = await Promise.all(
        periods.map(async (period: any) => {
          let assessments = await db.query.performanceAssessments.findMany({
            where: eq(performanceAssessments.periodId, period.id),
          });

          if (input.departmentId) {
            const deptEmployees = await db.query.employees.findMany({
              where: eq(employees.departmentId, input.departmentId),
            });

            const employeeIds = deptEmployees.map((e: any) => e.id);
            assessments = assessments.filter((a: any) => employeeIds.includes(a.employeeId));
          }

          const approvedAssessments = assessments.filter((a: any) => a.status === 'approved');
          const totalScore = approvedAssessments.reduce((sum: number, a: any) => sum + (a.totalScore ? parseFloat(a.totalScore) : 0), 0);
          const averageScore = approvedAssessments.length > 0 ? (totalScore / approvedAssessments.length).toFixed(2) : '0';

          return {
            periodName: period.name,
            periodId: period.id,
            averageScore: parseFloat(averageScore as string),
            totalAssessments: assessments.length,
            approvedAssessments: approvedAssessments.length,
          };
        })
      );

      return trendData.reverse();
    }),
});

/**
 * 六维度分析路由
 */
const dimensionAnalysisRouter = router({
  /**
   * 获取六维度分布统计
   */
  getDimensionDistribution: protectedProcedure
    .input(
      z.object({
        periodId: z.string().optional(),
        departmentId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      let where: any = {};
      if (input.periodId) {
        where.periodId = input.periodId;
      }

      const assessments = await db.query.performanceAssessments.findMany({
        where: eq(performanceAssessments.status, 'approved'),
      });

      // 按部门筛选
      if (input.departmentId) {
        const deptEmployees = await db.query.employees.findMany({
          where: eq(employees.departmentId, input.departmentId),
        });
        const employeeIds = deptEmployees.map((e: any) => e.id);
        const filteredAssessments = assessments.filter((a: any) => employeeIds.includes(a.employeeId));

        // 计算各维度分布
        const distribution = calculateDimensionDistribution(filteredAssessments);
        return distribution;
      }

      // 计算各维度分布
      const distribution = calculateDimensionDistribution(assessments);
      return distribution;
    }),

  /**
   * 获取部门对标分析
   */
  getDepartmentComparison: protectedProcedure
    .input(
      z.object({
        periodId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      // 获取所有部门
      const allDepartments = await db.query.departments.findMany();
      const comparisonData = await Promise.all(
        allDepartments.map(async (dept: any) => {
          // 获取部门员工
          const deptEmployees = await db.query.employees.findMany({
            where: eq(employees.departmentId, dept.id),
          });

          const employeeIds = deptEmployees.map((e: any) => e.id);

          // 获取部门评分
          const assessments = await db.query.performanceAssessments.findMany({
            where: and(
              eq(performanceAssessments.status, 'approved'),
              ...(input.periodId ? [eq(performanceAssessments.periodId, input.periodId)] : [])
            ),
          });

          const deptAssessments = assessments.filter((a: any) => employeeIds.includes(a.employeeId));

          // 计算部门平均分
          const totalScore = deptAssessments.reduce((sum: number, a: any) => sum + (a.totalScore ? parseFloat(a.totalScore) : 0), 0);
          const averageScore = deptAssessments.length > 0 ? (totalScore / deptAssessments.length).toFixed(2) : '0';

          // 计算各维度平均分
          const dimensions = {
            dailyWork: 0,
            workQuality: 0,
            personalGoal: 0,
            departmentReview: 0,
            bonus: 0,
            penalty: 0,
          };

          if (deptAssessments.length > 0) {
            dimensions.dailyWork = deptAssessments.reduce((sum: number, a: any) => sum + (a.dailyWorkScore ? parseFloat(a.dailyWorkScore) : 0), 0) / deptAssessments.length;
            dimensions.workQuality = deptAssessments.reduce((sum: number, a: any) => sum + (a.workQualityScore ? parseFloat(a.workQualityScore) : 0), 0) / deptAssessments.length;
            dimensions.personalGoal = deptAssessments.reduce((sum: number, a: any) => sum + (a.personalGoalScore ? parseFloat(a.personalGoalScore) : 0), 0) / deptAssessments.length;
            dimensions.departmentReview = deptAssessments.reduce((sum: number, a: any) => sum + (a.departmentReviewScore ? parseFloat(a.departmentReviewScore) : 0), 0) / deptAssessments.length;
            dimensions.bonus = deptAssessments.reduce((sum: number, a: any) => sum + (a.bonusScore ? parseFloat(a.bonusScore) : 0), 0) / deptAssessments.length;
            dimensions.penalty = deptAssessments.reduce((sum: number, a: any) => sum + (a.penaltyScore ? parseFloat(a.penaltyScore) : 0), 0) / deptAssessments.length;
          }

          return {
            departmentId: dept.id,
            departmentName: dept.name,
            totalEmployees: deptEmployees.length,
            totalAssessments: deptAssessments.length,
            averageScore: parseFloat(averageScore as string),
            dimensions,
          };
        })
      );

      return comparisonData;
    }),

  /**
   * 获取员工详细维度得分
   */
  getEmployeeDimensionScores: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        periodId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      let where: any = [
        eq(employees.id, input.employeeId),
        eq(performanceAssessments.status, 'approved'),
      ];

      if (input.periodId) {
        where.push(eq(performanceAssessments.periodId, input.periodId));
      }

      const assessment = await db.query.performanceAssessments.findFirst({
        where: and(...where),
        with: {
          employee: {
            with: {
              user: true,
              department: true,
              position: true,
            },
          },
        },
      });

      if (!assessment) {
        throw new Error('Assessment not found');
      }

      return {
        employeeName: assessment.employee?.user?.name,
        departmentName: assessment.employee?.department?.name,
        positionName: assessment.employee?.position?.name,
        totalScore: assessment.totalScore ? parseFloat(assessment.totalScore) : 0,
        dimensions: {
          dailyWork: assessment.dailyWorkScore ? parseFloat(assessment.dailyWorkScore) : 0,
          workQuality: assessment.workQualityScore ? parseFloat(assessment.workQualityScore) : 0,
          personalGoal: assessment.personalGoalScore ? parseFloat(assessment.personalGoalScore) : 0,
          departmentReview: assessment.departmentReviewScore ? parseFloat(assessment.departmentReviewScore) : 0,
          bonus: assessment.bonusScore ? parseFloat(assessment.bonusScore) : 0,
          penalty: assessment.penaltyScore ? parseFloat(assessment.penaltyScore) : 0,
        },
      };
    }),

  /**
   * 导出数据为 Excel
   */
  exportAsExcel: protectedProcedure
    .input(
      z.object({
        periodId: z.string(),
        type: z.enum(['all', 'department', 'employee']),
        departmentId: z.string().optional(),
        format: z.enum(['xlsx', 'csv']).default('xlsx'),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      let assessments: any[] = [];

      if (input.type === 'all') {
        assessments = await db.query.performanceAssessments.findMany({
          where: eq(performanceAssessments.periodId, input.periodId),
          with: {
            employee: {
              with: {
                user: true,
                department: true,
                position: true,
              },
            },
          },
        });
      } else if (input.type === 'department' && input.departmentId) {
        const deptEmployees = await db.query.employees.findMany({
          where: eq(employees.departmentId, input.departmentId),
        });

        const employeeIds = deptEmployees.map((e: any) => e.id);

        assessments = await db.query.performanceAssessments.findMany({
          where: and(
            eq(performanceAssessments.periodId, input.periodId),
            eq(performanceAssessments.status, 'approved')
          ),
          with: {
            employee: {
              with: {
                user: true,
                department: true,
                position: true,
              },
            },
          },
        });

        assessments = assessments.filter((a: any) => employeeIds.includes(a.employeeId));
      }

      // 生成数据
      const exportData = assessments.map((a: any) => ({
        '员工姓名': a.employee?.user?.name || '',
        '部门': a.employee?.department?.name || '',
        '职位': a.employee?.position?.name || '',
        '总分': a.totalScore || '',
        '日常工作': a.dailyWorkScore || '',
        '工作质量': a.workQualityScore || '',
        '个人目标': a.personalGoalScore || '',
        '部门互评': a.departmentReviewScore || '',
        '绩效加分': a.bonusScore || '',
        '绩效减分': a.penaltyScore || '',
        '状态': a.status || '',
        '提交时间': a.submittedAt ? new Date(a.submittedAt).toLocaleString() : '',
      }));

      return {
        filename: `performance-report-${input.periodId}-${new Date().getTime()}.${input.format}`,
        data: exportData,
        format: input.format,
      };
    }),
});

// 辅助函数：计算维度分布
function calculateDimensionDistribution(assessments: any[]) {
  const dimensionRanges = {
    dailyWork: { excellent: 0, good: 0, fair: 0, pass: 0, fail: 0 },
    workQuality: { excellent: 0, good: 0, fair: 0, pass: 0, fail: 0 },
    personalGoal: { excellent: 0, good: 0, fair: 0, pass: 0, fail: 0 },
    departmentReview: { excellent: 0, good: 0, fair: 0, pass: 0, fail: 0 },
    bonus: { excellent: 0, good: 0, fair: 0, pass: 0, fail: 0 },
    penalty: { excellent: 0, good: 0, fair: 0, pass: 0, fail: 0 },
  };

  assessments.forEach((assessment) => {
    // 日常工作（0-100分）
    const dailyWorkScore = assessment.dailyWorkScore ? parseFloat(assessment.dailyWorkScore) : 0;
    updateDimensionRange(dimensionRanges.dailyWork, dailyWorkScore, 100);

    // 工作质量（0-15分）
    const workQualityScore = assessment.workQualityScore ? parseFloat(assessment.workQualityScore) : 0;
    updateDimensionRange(dimensionRanges.workQuality, workQualityScore, 15);

    // 个人目标（0-15分）
    const personalGoalScore = assessment.personalGoalScore ? parseFloat(assessment.personalGoalScore) : 0;
    updateDimensionRange(dimensionRanges.personalGoal, personalGoalScore, 15);

    // 部门互评（0-5分）
    const departmentReviewScore = assessment.departmentReviewScore ? parseFloat(assessment.departmentReviewScore) : 0;
    updateDimensionRange(dimensionRanges.departmentReview, departmentReviewScore, 5);

    // 绩效加分（0-15分）
    const bonusScore = assessment.bonusScore ? parseFloat(assessment.bonusScore) : 0;
    updateDimensionRange(dimensionRanges.bonus, bonusScore, 15);

    // 绩效减分（0分或负分）
    const penaltyScore = assessment.penaltyScore ? parseFloat(assessment.penaltyScore) : 0;
    if (penaltyScore >= 0) {
      dimensionRanges.penalty.excellent++;
    } else {
      dimensionRanges.penalty.fail++;
    }
  });

  return dimensionRanges;
}

// 辅助函数：更新维度范围
function updateDimensionRange(range: any, score: number, maxScore: number) {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 90) {
    range.excellent++;
  } else if (percentage >= 80) {
    range.good++;
  } else if (percentage >= 70) {
    range.fair++;
  } else if (percentage >= 60) {
    range.pass++;
  } else {
    range.fail++;
  }
}

/**
 * 导出报表路由
 */
export const reportsRouter = router({
  stats: statsRouter,
  generation: generationRouter,
  dimensions: dimensionAnalysisRouter,
});
