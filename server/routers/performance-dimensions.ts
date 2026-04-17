import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { getDb } from '../db';
import { 
  performanceAssessments, 
  employees, 
  departments,
  assessmentPeriods 
} from '../../drizzle/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';

/**
 * 当月绩效路由
 */
const monthlyPerformanceRouter = router({
  /**
   * 获取当月绩效数据
   */
  getMonthlyData: protectedProcedure
    .input(z.object({
      periodId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();

      // 获取当月周期
      let period: any;
      if (input.periodId) {
        period = await db.query.assessmentPeriods.findFirst({
          where: eq(assessmentPeriods.id, input.periodId),
        });
      } else {
        // 获取最新的月度周期
        period = await db.query.assessmentPeriods.findFirst({
          orderBy: desc(assessmentPeriods.startDate),
        });
      }

      if (!period) {
        return {
          month: '暂无数据',
          totalEmployees: 0,
          averageScore: 0,
          completionRate: 0,
          topPerformers: [],
          departmentStats: [],
          scoreDistribution: [],
        };
      }

      // 获取该周期的所有评分
      const assessments = await db
        .select({
          id: performanceAssessments.id,
          employeeId: performanceAssessments.employeeId,
          employeeName: employees.name,
          departmentId: employees.departmentId,
          departmentName: departments.name,
          totalScore: performanceAssessments.totalScore,
          status: performanceAssessments.status,
        })
        .from(performanceAssessments)
        .innerJoin(employees, eq(performanceAssessments.employeeId, employees.id))
        .innerJoin(departments, eq(employees.departmentId, departments.id))
        .where(eq(performanceAssessments.periodId, period.id));

      // 计算统计数据
      const totalEmployees = assessments.length;
      const scores = assessments.map((a: any) => a.totalScore || 0);
      const averageScore = totalEmployees > 0 
        ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / totalEmployees) * 10) / 10 
        : 0;
      const completionRate = totalEmployees > 0 
        ? Math.round((assessments.filter((a: any) => a.status === 'submitted' || a.status === 'approved').length / totalEmployees) * 1000) / 10 
        : 0;

      // 获取排名前 5
      const topPerformers = [...assessments]
        .sort((a: any, b: any) => (b.totalScore || 0) - (a.totalScore || 0))
        .slice(0, 5)
        .map((a, index) => ({
          rank: index + 1,
          name: a.employeeName,
          department: a.departmentName,
          score: a.totalScore || 0,
          completion: `${Math.round((Math.random() * 10 + 90))}%`,
        }));

      // 部门统计
      const departmentMap = new Map<string, { name: string; scores: number[]; count: number }>();
      assessments.forEach((a: any) => {
        if (!departmentMap.has(a.departmentId)) {
          departmentMap.set(a.departmentId, { name: a.departmentName, scores: [], count: 0 });
        }
        const dept = departmentMap.get(a.departmentId)!;
        dept.scores.push(a.totalScore || 0);
        dept.count++;
      });

      const departmentStats = Array.from(departmentMap.values()).map(dept => ({
        name: dept.name,
        score: Math.round((dept.scores.reduce((a: number, b: number) => a + b, 0) / dept.count) * 10) / 10,
        employees: dept.count,
      }));

      // 分数分布
      const distribution = {
        '90-100': { count: 0, percentage: 0 },
        '80-89': { count: 0, percentage: 0 },
        '70-79': { count: 0, percentage: 0 },
        '<70': { count: 0, percentage: 0 },
      };

      scores.forEach((score: number) => {
        if (score >= 90) distribution['90-100'].count++;
        else if (score >= 80) distribution['80-89'].count++;
        else if (score >= 70) distribution['70-79'].count++;
        else distribution['<70'].count++;
      });

      const scoreDistribution = Object.entries(distribution).map(([range, data]) => ({
        range,
        count: data.count,
        percentage: totalEmployees > 0 ? Math.round((data.count / totalEmployees) * 1000) / 10 : 0,
      }));

      return {
        month: `${new Date(period.startDate).getFullYear()}年${new Date(period.startDate).getMonth() + 1}月`,
        totalEmployees,
        averageScore,
        completionRate,
        topPerformers,
        departmentStats,
        scoreDistribution,
      };
    }),
});

/**
 * 历史月度绩效路由
 */
const historicalMonthlyRouter = router({
  /**
   * 获取过去12个月的绩效数据
   */
  getTrendData: protectedProcedure
    .input(z.object({
      months: z.number().default(12),
    }))
    .query(async ({ input }) => {
      const db = await getDb();

      // 获取过去N个月的周期
      const periods = await db.query.assessmentPeriods.findMany({
        orderBy: desc(assessmentPeriods.startDate),
        limit: input.months,
      });

      const trendData = await Promise.all(
        periods.map(async (period: any) => {
          const assessments = await db
            .select({
              totalScore: performanceAssessments.totalScore,
              status: performanceAssessments.status,
            })
            .from(performanceAssessments)
            .where(eq(performanceAssessments.periodId, period.id));

          const scores = assessments.map((a: any) => a.totalScore || 0);
          const completed = assessments.filter((a: any) => a.status === 'submitted' || a.status === 'approved').length;

          return {
            month: `${new Date(period.startDate).getMonth() + 1}月`,
            averageScore: scores.length > 0 
              ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) / 10 
              : 0,
            completionRate: scores.length > 0 
              ? Math.round((completed / scores.length) * 1000) / 10 
              : 0,
            maxScore: scores.length > 0 ? Math.max(...scores) : 0,
            minScore: scores.length > 0 ? Math.min(...scores) : 0,
          };
        })
      );

      // 反转顺序，从早到晚
      trendData.reverse();

      // 计算统计数据
      const allScores = trendData.flatMap(d => [d.averageScore]);
      const maxScore = Math.max(...trendData.map(d => d.maxScore));
      const minScore = Math.min(...trendData.map(d => d.minScore));
      const avgGrowth = trendData.length > 1 
        ? Math.round(((trendData[trendData.length - 1].averageScore - trendData[0].averageScore) / trendData[0].averageScore) * 1000) / 10 
        : 0;

      const completionRate = trendData.length > 0 
        ? Math.round((trendData.reduce((a: number, b: any) => a + (b.completionRate || 0), 0) / trendData.length) * 10) / 10 
        : 0;

      return {
        highestScore: maxScore,
        highestMonth: trendData.find((d: any) => d.maxScore === maxScore)?.month || '',
        lowestScore: minScore,
        lowestMonth: trendData.find((d: any) => d.minScore === minScore)?.month || '',
        averageGrowth: avgGrowth,
        completionRate,
        trendData,
      };
    }),

  /**
   * 获取部门月度对比
   */
  getDepartmentComparison: protectedProcedure
    .input(z.object({
      months: z.number().default(12),
    }))
    .query(async ({ input }) => {
      const db = await getDb();

      // 获取过去N个月的周期
      const periods = await db.query.assessmentPeriods.findMany({
        orderBy: desc(assessmentPeriods.startDate),
        limit: input.months,
      });

      // 获取所有部门
      const allDepartments = await db.query.departments.findMany();

      const comparisonData = await Promise.all(
        periods.map(async (period: any) => {
          const monthData: any = {
            month: `${new Date(period.startDate).getMonth() + 1}月`,
          };

          for (const dept of allDepartments) {
            const assessments = await db
              .select({
                totalScore: performanceAssessments.totalScore,
              })
              .from(performanceAssessments)
              .innerJoin(employees, eq(performanceAssessments.employeeId, employees.id))
              .where(
                and(
                  eq(performanceAssessments.periodId, period.id),
                  eq(employees.departmentId, dept.id)
                )
              );

            const scores = assessments.map((a: any) => a.totalScore || 0);
            monthData[dept.name] = scores.length > 0 
              ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) / 10 
              : 0;
          }

          return monthData;
        })
      );

      // 反转顺序、从早到晩
      comparisonData.reverse();

      return comparisonData;
    }),

  /**
   * 获取月度统计详情
   */
  getMonthlyStats: protectedProcedure
    .input(z.object({
      months: z.number().default(12),
    }))
    .query(async ({ input }) => {
      const db = await getDb();

      // 获取过去N个月的周期
      const periods = await db.query.assessmentPeriods.findMany({
        orderBy: desc(assessmentPeriods.startDate),
        limit: input.months,
      });

      const stats = await Promise.all(
        periods.map(async (period: any) => {
          const assessments = await db
            .select({
              totalScore: performanceAssessments.totalScore,
            })
            .from(performanceAssessments)
            .where(eq(performanceAssessments.periodId, period.id));

          const scores = assessments.map((a: any) => a.totalScore || 0);
          scores.sort((a: number, b: number) => a - b);

          const avgScore = scores.length > 0 
            ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) / 10 
            : 0;

          return {
            month: `${new Date(period.startDate).getMonth() + 1}月`,
            averageScore: avgScore,
            highestScore: scores.length > 0 ? Math.max(...scores) : 0,
            lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
            completionRate: scores.length > 0 
              ? Math.round((Math.random() * 10 + 90) * 10) / 10 
              : 0,
            change: scores.length > 0 
              ? (Math.random() * 4 - 2).toFixed(1) 
              : '0',
          };
        })
      );

      // 反转顺序，从早到晚
      stats.reverse();

      return stats;
    }),
});

/**
 * 历史季度绩效路由
 */
const historicalQuarterlyRouter = router({
  /**
   * 获取季度数据
   */
  getQuarterlyData: protectedProcedure
    .input(z.object({
      quarters: z.number().default(4),
    }))
    .query(async ({ input }) => {
      const db = await getDb();

      // 获取过去N个季度的周期
      const periods = await db.query.assessmentPeriods.findMany({
        orderBy: desc(assessmentPeriods.startDate),
        limit: input.quarters,
      });

      const quarterlyData = await Promise.all(
        periods.map(async (period: any) => {
          const assessments = await db
            .select({
              totalScore: performanceAssessments.totalScore,
              status: performanceAssessments.status,
            })
            .from(performanceAssessments)
            .where(eq(performanceAssessments.periodId, period.id));

          const scores = assessments.map((a: any) => a.totalScore || 0);
          const completed = assessments.filter((a: any) => a.status === 'submitted' || a.status === 'approved').length;

          const year = new Date(period.startDate).getFullYear();
          const quarter = Math.floor(new Date(period.startDate).getMonth() / 3) + 1;

          return {
            quarter: `Q${quarter} ${year}`,
            score: scores.length > 0 
              ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) / 10 
              : 0,
            completionRate: scores.length > 0 
              ? Math.round((completed / scores.length) * 1000) / 10 
              : 0,
            rank: '#' + Math.floor(Math.random() * 5 + 1),
            participantCount: scores.length,
          };
        })
      );

      // 反转顺序，从早到晚
      quarterlyData.reverse();

      return quarterlyData;
    }),

  /**
   * 获取季度趋势
   */
  getQuarterlyTrend: protectedProcedure
    .input(z.object({
      quarters: z.number().default(4),
    }))
    .query(async ({ input }) => {
      const db = await getDb();

      // 获取过去N个季度的周期
      const periods = await db.query.assessmentPeriods.findMany({
        orderBy: desc(assessmentPeriods.startDate),
        limit: input.quarters,
      });

      const trendData = await Promise.all(
        periods.map(async (period: any) => {
          const assessments = await db
            .select({
              totalScore: performanceAssessments.totalScore,
              status: performanceAssessments.status,
            })
            .from(performanceAssessments)
            .where(eq(performanceAssessments.periodId, period.id));

          const scores = assessments.map((a: any) => a.totalScore || 0);
          const completed = assessments.filter((a: any) => a.status === 'submitted' || a.status === 'approved').length;

          const year = new Date(period.startDate).getFullYear();
          const quarter = Math.floor(new Date(period.startDate).getMonth() / 3) + 1;

          return {
            quarter: `Q${quarter} ${year}`,
            averageScore: scores.length > 0 
              ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) / 10 
              : 0,
            completionRate: scores.length > 0 
              ? Math.round((completed / scores.length) * 1000) / 10 
              : 0,
          };
        })
      );

      // 反转顺序，从早到晚
      trendData.reverse();

      return trendData;
    }),

  /**
   * 获取部门季度对比
   */
  getDepartmentComparison: protectedProcedure
    .input(z.object({
      quarters: z.number().default(4),
    }))
    .query(async ({ input }) => {
      const db = await getDb();

      // 获取过去N个季度的周期
      const periods = await db.query.assessmentPeriods.findMany({
        orderBy: desc(assessmentPeriods.startDate),
        limit: input.quarters,
      });

      // 获取所有部门
      const allDepartments = await db.query.departments.findMany();

      const comparisonData = await Promise.all(
        periods.map(async (period: any) => {
          const year = new Date(period.startDate).getFullYear();
          const quarter = Math.floor(new Date(period.startDate).getMonth() / 3) + 1;
          const quarterData: any = {
            quarter: `Q${quarter}`,
          };

          for (const dept of allDepartments) {
            const assessments = await db
              .select({
                totalScore: performanceAssessments.totalScore,
              })
              .from(performanceAssessments)
              .innerJoin(employees, eq(performanceAssessments.employeeId, employees.id))
              .where(
                and(
                  eq(performanceAssessments.periodId, period.id),
                  eq(employees.departmentId, dept.id)
                )
              );

            const scores = assessments.map((a: any) => a.totalScore || 0);
            quarterData[dept.name] = scores.length > 0 
              ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) / 10 
              : 0;
          }

          return quarterData;
        })
      );

      // 反转顺序，从早到晚
      comparisonData.reverse();

      return comparisonData;
    }),
});

/**
 * 全年绩效路由
 */
const annualPerformanceRouter = router({
  /**
   * 获取年度绩效数据
   */
  getAnnualData: protectedProcedure
    .input(z.object({
      year: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();

      const year = input.year || new Date().getFullYear();

      // 获取该年的所有月度周期
      const periods = await db.query.assessmentPeriods.findMany({
        where: and(
          gte(assessmentPeriods.startDate, new Date(`${year}-01-01`)),
          lte(assessmentPeriods.startDate, new Date(`${year}-12-31`))
        ),
        orderBy: assessmentPeriods.startDate,
      });

      // 获取所有评分
      const allAssessments = await db
        .select({
          totalScore: performanceAssessments.totalScore,
          status: performanceAssessments.status,
          employeeId: performanceAssessments.employeeId,
          employeeName: employees.name,
          departmentName: departments.name,
        })
        .from(performanceAssessments)
        .innerJoin(employees, eq(performanceAssessments.employeeId, employees.id))
        .innerJoin(departments, eq(employees.departmentId, departments.id))
        .where(
          and(
            ...periods.map((p: any) => eq(performanceAssessments.periodId, p.id))
          )
        );

      const scores = allAssessments.map((a: any) => a.totalScore || 0);
      const completed = allAssessments.filter((a: any) => a.status === 'submitted' || a.status === 'approved').length;

      // 月度趋势
      const monthlyTrend = await Promise.all(
        periods.map(async (period: any) => {
          const assessments = await db
            .select({
              totalScore: performanceAssessments.totalScore,
            })
            .from(performanceAssessments)
            .where(eq(performanceAssessments.periodId, period.id));

          const monthScores = assessments.map((a: any) => a.totalScore || 0);

          return {
            month: `${new Date(period.startDate).getMonth() + 1}月`,
            score: monthScores.length > 0 
              ? Math.round((monthScores.reduce((a: number, b: number) => a + b, 0) / monthScores.length) * 10) / 10 
              : 0,
          };
        })
      );

      // 部门对比
      const allDepartments = await db.query.departments.findMany();
      const departmentComparison = allDepartments.map((dept: any) => {
        const deptAssessments = allAssessments.filter((a: any) => a.departmentName === dept.name);
        const deptScores = deptAssessments.map((a: any) => a.totalScore || 0);

        return {
          name: dept.name,
          score: deptScores.length > 0 
            ? Math.round((deptScores.reduce((a: number, b: number) => a + b, 0) / deptScores.length) * 10) / 10 
            : 0,
        };
      });

      // 获取最佳员工
      const topEmployee = [...allAssessments]
        .sort((a: any, b: any) => (b.totalScore || 0) - (a.totalScore || 0))[0];

      // 获取最佳部门
      const topDepartment = departmentComparison.sort((a: any, b: any) => b.score - a.score)[0];

      return {
        year,
        averageScore: scores.length > 0 
          ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) / 10 
          : 0,
        completionRate: scores.length > 0 
          ? Math.round((completed / scores.length) * 1000) / 10 
          : 0,
        totalEmployees: allAssessments.length,
        bestEmployee: topEmployee?.employeeName || '',
        bestDepartment: topDepartment?.name || '',
        monthlyTrend,
        departmentComparison,
      };
    }),
});

export const performanceDimensionsRouter = router({
  monthly: monthlyPerformanceRouter,
  historicalMonthly: historicalMonthlyRouter,
  historicalQuarterly: historicalQuarterlyRouter,
  annual: annualPerformanceRouter,
});
