/**
 * 数据分析和报表路由
 * 支持基于六个评分维度的统计、分析和导出功能
 */

import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { getDb, performanceAssessments, employees, departments } from '../db';
import { eq, and } from 'drizzle-orm';

/**
 * 六维度统计数据
 */
const dimensionStatsRouter = router({
  /**
   * 获取所有维度的统计数据
   */
  getAll: protectedProcedure
    .input(
      z.object({
        periodId: z.string().optional(),
        departmentId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      // 构建查询条件
      let whereConditions: any[] = [eq(performanceAssessments.status, 'approved')];
      if (input.periodId) {
        whereConditions.push(eq(performanceAssessments.periodId, input.periodId));
      }

      // 获取所有已批准的评分
      const assessments = (await db.query.performanceAssessments.findMany({
        where: and(...whereConditions),
        with: {
          employee: {
            with: {
              department: true,
            },
          },
        },
      })) as any[];

      // 按部门筛选
      let filteredAssessments = assessments;
      if (input.departmentId) {
        filteredAssessments = assessments.filter((a: any) => a.employee?.departmentId === input.departmentId);
      }

      // 计算各维度的统计数据
      const stats: any = {
        totalCount: filteredAssessments.length,
        averageScores: {
          dailyWork: 0,
          workQuality: 0,
          personalGoal: 0,
          departmentReview: 0,
          bonus: 0,
          penalty: 0,
          total: 0,
        },
        distribution: {},
        gradeDistribution: {
          excellent: 0,
          good: 0,
          fair: 0,
          pass: 0,
          fail: 0,
        },
        topEmployees: [] as any[],
        bottomEmployees: [] as any[],
      };

      if (filteredAssessments.length === 0) {
        return stats;
      }

      // 计算各维度的平均分
      const dailyWorkScores = filteredAssessments.map((a: any) => parseFloat(a.dailyWorkScore?.toString() || '0'));
      const workQualityScores = filteredAssessments.map((a: any) => parseFloat(a.workQualityScore?.toString() || '0'));
      const personalGoalScores = filteredAssessments.map((a: any) => parseFloat(a.personalGoalScore?.toString() || '0'));
      const departmentReviewScores = filteredAssessments.map((a: any) => parseFloat(a.departmentReviewScore?.toString() || '0'));
      const bonusScores = filteredAssessments.map((a: any) => parseFloat(a.bonusScore?.toString() || '0'));
      const penaltyScores = filteredAssessments.map((a: any) => parseFloat(a.penaltyScore?.toString() || '0'));
      const totalScores = filteredAssessments.map((a: any) => parseFloat(a.totalScore?.toString() || '0'));

      // 计算平均值
      const avg = (arr: number[]): number => arr.reduce((a: number, b: number) => a + b, 0) / arr.length;
      const stdDev = (arr: number[]): number => {
        const mean = avg(arr);
        const variance = arr.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) / arr.length;
        return Math.sqrt(variance);
      };

      stats.averageScores = {
        dailyWork: parseFloat(avg(dailyWorkScores).toFixed(2)),
        workQuality: parseFloat(avg(workQualityScores).toFixed(2)),
        personalGoal: parseFloat(avg(personalGoalScores).toFixed(2)),
        departmentReview: parseFloat(avg(departmentReviewScores).toFixed(2)),
        bonus: parseFloat(avg(bonusScores).toFixed(2)),
        penalty: parseFloat(avg(penaltyScores).toFixed(2)),
        total: parseFloat(avg(totalScores).toFixed(2)),
      };

      // 计算等级分布
      stats.gradeDistribution = {
        excellent: filteredAssessments.filter((a: any) => parseFloat(a.totalScore?.toString() || '0') >= 90).length,
        good: filteredAssessments.filter((a: any) => {
          const score = parseFloat(a.totalScore?.toString() || '0');
          return score >= 80 && score < 90;
        }).length,
        fair: filteredAssessments.filter((a: any) => {
          const score = parseFloat(a.totalScore?.toString() || '0');
          return score >= 70 && score < 80;
        }).length,
        pass: filteredAssessments.filter((a: any) => {
          const score = parseFloat(a.totalScore?.toString() || '0');
          return score >= 60 && score < 70;
        }).length,
        fail: filteredAssessments.filter((a: any) => parseFloat(a.totalScore?.toString() || '0') < 60).length,
      };

      // 获取排名前 10 和后 10
      const sorted = [...filteredAssessments].sort((a: any, b: any) => {
        const scoreA = parseFloat(a.totalScore?.toString() || '0');
        const scoreB = parseFloat(b.totalScore?.toString() || '0');
        return scoreB - scoreA;
      });

      stats.topEmployees = sorted.slice(0, 10).map((a: any) => ({
        employeeId: a.employeeId,
        employeeName: a.employee?.name,
        totalScore: parseFloat(a.totalScore?.toString() || '0'),
        rank: sorted.indexOf(a) + 1,
      }));

      stats.bottomEmployees = sorted.slice(-10).reverse().map((a: any) => ({
        employeeId: a.employeeId,
        employeeName: a.employee?.name,
        totalScore: parseFloat(a.totalScore?.toString() || '0'),
        rank: sorted.indexOf(a) + 1,
      }));

      return stats;
    }),
});

/**
 * 部门对标路由
 */
const departmentBenchmarkRouter = router({
  /**
   * 获取部门对标数据
   */
  getComparison: protectedProcedure
    .input(
      z.object({
        periodId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      let whereConditions: any[] = [eq(performanceAssessments.status, 'approved')];
      if (input.periodId) {
        whereConditions.push(eq(performanceAssessments.periodId, input.periodId));
      }

      const assessments = (await db.query.performanceAssessments.findMany({
        where: and(...whereConditions),
        with: {
          employee: {
            with: {
              department: true,
            },
          },
        },
      })) as any[];

      // 按部门分组
      const departmentGroups = new Map<string, any[]>();
      assessments.forEach((a: any) => {
        const deptId = a.employee?.departmentId;
        if (deptId) {
          if (!departmentGroups.has(deptId)) {
            departmentGroups.set(deptId, []);
          }
          departmentGroups.get(deptId)!.push(a);
        }
      });

      // 计算每个部门的统计数据
      const departmentStats = Array.from(departmentGroups.entries()).map(([deptId, deptAssessments]: [string, any[]]) => {
        const scores = deptAssessments.map((a: any) => parseFloat(a.totalScore?.toString() || '0'));
        const avg = (arr: number[]): number => arr.reduce((a: number, b: number) => a + b, 0) / arr.length;

        const deptName = deptAssessments[0]?.employee?.department?.name || 'Unknown';

        return {
          departmentId: deptId,
          departmentName: deptName,
          employeeCount: deptAssessments.length,
          averageScore: parseFloat(avg(scores).toFixed(2)),
          minScore: Math.min(...scores),
          maxScore: Math.max(...scores),
          excellentCount: deptAssessments.filter((a: any) => parseFloat(a.totalScore?.toString() || '0') >= 90).length,
          goodCount: deptAssessments.filter((a: any) => {
            const score = parseFloat(a.totalScore?.toString() || '0');
            return score >= 80 && score < 90;
          }).length,
          fairCount: deptAssessments.filter((a: any) => {
            const score = parseFloat(a.totalScore?.toString() || '0');
            return score >= 70 && score < 80;
          }).length,
          passCount: deptAssessments.filter((a: any) => {
            const score = parseFloat(a.totalScore?.toString() || '0');
            return score >= 60 && score < 70;
          }).length,
          failCount: deptAssessments.filter((a: any) => parseFloat(a.totalScore?.toString() || '0') < 60).length,
        };
      });

      // 按平均分排序
      departmentStats.sort((a: any, b: any) => b.averageScore - a.averageScore);

      return {
        totalDepartments: departmentStats.length,
        departments: departmentStats,
        overallAverage: parseFloat(
          (departmentStats.reduce((sum: number, d: any) => sum + d.averageScore, 0) / departmentStats.length).toFixed(2)
        ),
      };
    }),
});

/**
 * 数据导出路由
 */
const exportRouter = router({
  /**
   * 导出为 CSV 格式
   */
  toCSV: protectedProcedure
    .input(
      z.object({
        periodId: z.string().optional(),
        departmentId: z.string().optional(),
        type: z.enum(['summary', 'detailed', 'department']).default('detailed'),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      let whereConditions: any[] = [eq(performanceAssessments.status, 'approved')];
      if (input.periodId) {
        whereConditions.push(eq(performanceAssessments.periodId, input.periodId));
      }

      const assessments = (await db.query.performanceAssessments.findMany({
        where: and(...whereConditions),
        with: {
          employee: {
            with: {
              department: true,
            },
          },
        },
      })) as any[];

      let filteredAssessments = assessments;
      if (input.departmentId) {
        filteredAssessments = assessments.filter((a: any) => a.employee?.departmentId === input.departmentId);
      }

      // 构建 CSV 内容
      let csv = '';

      if (input.type === 'summary') {
        csv = '员工名称,部门,日常工作,工作质量,个人目标,部门互评,绩效加分,绩效减分,总分,等级\n';
        filteredAssessments.forEach((a: any) => {
          const totalScore = parseFloat(a.totalScore?.toString() || '0');
          let grade = '不及格';
          if (totalScore >= 90) grade = '优秀';
          else if (totalScore >= 80) grade = '良好';
          else if (totalScore >= 70) grade = '一般';
          else if (totalScore >= 60) grade = '及格';

          csv += `"${a.employee?.name}","${a.employee?.department?.name}",${a.dailyWorkScore || 0},${a.workQualityScore || 0},${a.personalGoalScore || 0},${a.departmentReviewScore || 0},${a.bonusScore || 0},${a.penaltyScore || 0},${totalScore},${grade}\n`;
        });
      } else if (input.type === 'detailed') {
        csv = '员工名称,部门,日常工作,工作质量,个人目标,部门互评,绩效加分,绩效减分,总分,等级,创建时间,更新时间\n';
        filteredAssessments.forEach((a: any) => {
          const totalScore = parseFloat(a.totalScore?.toString() || '0');
          let grade = '不及格';
          if (totalScore >= 90) grade = '优秀';
          else if (totalScore >= 80) grade = '良好';
          else if (totalScore >= 70) grade = '一般';
          else if (totalScore >= 60) grade = '及格';

          csv += `"${a.employee?.name}","${a.employee?.department?.name}",${a.dailyWorkScore || 0},${a.workQualityScore || 0},${a.personalGoalScore || 0},${a.departmentReviewScore || 0},${a.bonusScore || 0},${a.penaltyScore || 0},${totalScore},${grade},"${a.createdAt}","${a.updatedAt}"\n`;
        });
      } else if (input.type === 'department') {
        csv = '部门,员工数,平均分,最低分,最高分,优秀数,良好数,一般数,及格数,不及格数\n';

        const departmentGroups = new Map<string, any[]>();
        filteredAssessments.forEach((a: any) => {
          const deptId = a.employee?.departmentId;
          if (deptId) {
            if (!departmentGroups.has(deptId)) {
              departmentGroups.set(deptId, []);
            }
            departmentGroups.get(deptId)!.push(a);
          }
        });

        departmentGroups.forEach((deptAssessments: any[], deptId: string) => {
          const scores = deptAssessments.map((a: any) => parseFloat(a.totalScore?.toString() || '0'));
          const avg = (arr: number[]): number => arr.reduce((a: number, b: number) => a + b, 0) / arr.length;
          const deptName = deptAssessments[0]?.employee?.department?.name || 'Unknown';

          const excellentCount = deptAssessments.filter((a: any) => parseFloat(a.totalScore?.toString() || '0') >= 90).length;
          const goodCount = deptAssessments.filter((a: any) => {
            const score = parseFloat(a.totalScore?.toString() || '0');
            return score >= 80 && score < 90;
          }).length;
          const fairCount = deptAssessments.filter((a: any) => {
            const score = parseFloat(a.totalScore?.toString() || '0');
            return score >= 70 && score < 80;
          }).length;
          const passCount = deptAssessments.filter((a: any) => {
            const score = parseFloat(a.totalScore?.toString() || '0');
            return score >= 60 && score < 70;
          }).length;
          const failCount = deptAssessments.filter((a: any) => parseFloat(a.totalScore?.toString() || '0') < 60).length;

          csv += `"${deptName}",${deptAssessments.length},${parseFloat(avg(scores).toFixed(2))},${Math.min(...scores)},${Math.max(...scores)},${excellentCount},${goodCount},${fairCount},${passCount},${failCount}\n`;
        });
      }

      return {
        success: true,
        data: csv,
        filename: `performance-report-${new Date().toISOString().split('T')[0]}.csv`,
      };
    }),

  /**
   * 导出为 JSON 格式
   */
  toJSON: protectedProcedure
    .input(
      z.object({
        periodId: z.string().optional(),
        departmentId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();

      let whereConditions: any[] = [eq(performanceAssessments.status, 'approved')];
      if (input.periodId) {
        whereConditions.push(eq(performanceAssessments.periodId, input.periodId));
      }

      const assessments = (await db.query.performanceAssessments.findMany({
        where: and(...whereConditions),
        with: {
          employee: {
            with: {
              department: true,
            },
          },
        },
      })) as any[];

      let filteredAssessments = assessments;
      if (input.departmentId) {
        filteredAssessments = assessments.filter((a: any) => a.employee?.departmentId === input.departmentId);
      }

      return {
        success: true,
        data: filteredAssessments,
        filename: `performance-report-${new Date().toISOString().split('T')[0]}.json`,
      };
    }),
});

export const analyticsRouter = router({
  dimensionStats: dimensionStatsRouter,
  departmentBenchmark: departmentBenchmarkRouter,
  export: exportRouter,
});
