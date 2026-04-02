import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { getDb } from '../db';
import { 
  performanceAssessments, 
  employees, 
  departments,
  assessmentPeriods 
} from '../../drizzle/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export const dashboardRouter = router({
  // 获取员工排序（支持部门筛选）
  getEmployeeRanking: protectedProcedure
    .input(z.object({
      periodId: z.string(),
      departmentId: z.string().optional(),
      sortBy: z.enum(['score_desc', 'score_asc', 'name', 'rank']).default('score_desc'),
      limit: z.number().default(100),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const { periodId, departmentId, sortBy, limit, offset } = input;
      const db = await getDb();

      // 获取该周期的所有评分
      let query = db
        .select({
          id: performanceAssessments.id,
          employeeId: performanceAssessments.employeeId,
          employeeName: employees.name,
          employeePosition: employees.positionId,
          departmentId: employees.departmentId,
          departmentName: departments.name,
          totalScore: performanceAssessments.totalScore,
          status: performanceAssessments.status,
          createdAt: performanceAssessments.createdAt,
        })
        .from(performanceAssessments)
        .innerJoin(employees, eq(performanceAssessments.employeeId, employees.id))
        .innerJoin(departments, eq(employees.departmentId, departments.id))
        .where(eq(performanceAssessments.periodId, periodId));

      // 如果指定了部门，进行过滤
      if (departmentId) {
        query = query.where(eq(employees.departmentId, departmentId));
      }

      // 排序
      if (sortBy === 'score_desc') {
        query = query.orderBy(desc(performanceAssessments.totalScore));
      } else if (sortBy === 'score_asc') {
        query = query.orderBy(asc(performanceAssessments.totalScore));
      } else if (sortBy === 'name') {
        query = query.orderBy(asc(employees.name));
      }

      // 分页
      const results = await query.limit(limit).offset(offset);

      // 计算排名
      const ranked = results.map((item: typeof results[0], index: number) => ({
        ...item,
        rank: offset + index + 1,
        level: getPerformanceLevel(item.totalScore || 0),
      }));

      return ranked;
    }),

  // 获取排序分布统计
  getDistributionStats: protectedProcedure
    .input(z.object({
      periodId: z.string(),
      departmentId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { periodId, departmentId } = input;
      const db = await getDb();

      // 获取该周期的所有评分
      let query = db
        .select({
          totalScore: performanceAssessments.totalScore,
        })
        .from(performanceAssessments)
        .innerJoin(employees, eq(performanceAssessments.employeeId, employees.id))
        .where(eq(performanceAssessments.periodId, periodId));

      if (departmentId) {
        query = query.where(eq(employees.departmentId, departmentId));
      }

      const scores = await query;

      // 计算分布
      const distribution = {
        excellent: { min: 90, max: 100, count: 0, percentage: 0 },
        good: { min: 80, max: 89, count: 0, percentage: 0 },
        fair: { min: 70, max: 79, count: 0, percentage: 0 },
        pass: { min: 60, max: 69, count: 0, percentage: 0 },
        fail: { min: 0, max: 59, count: 0, percentage: 0 },
      };

      scores.forEach((item: typeof scores[0]) => {
        const score = item.totalScore || 0;
        if (score >= 90) distribution.excellent.count++;
        else if (score >= 80) distribution.good.count++;
        else if (score >= 70) distribution.fair.count++;
        else if (score >= 60) distribution.pass.count++;
        else distribution.fail.count++;
      });

      const total = scores.length;
      if (total > 0) {
        Object.keys(distribution).forEach((key: string) => {
          const level = distribution[key as keyof typeof distribution];
          level.percentage = Math.round((level.count / total) * 100);
        });
      }

      return {
        total,
        distribution,
        averageScore: total > 0 ? Math.round((scores.reduce((sum: number, item: typeof scores[0]) => sum + (item.totalScore || 0), 0) / total) * 10) / 10 : 0,
      };
    }),

  // 获取部门对比
  getDepartmentComparison: protectedProcedure
    .input(z.object({
      periodId: z.string(),
    }))
    .query(async ({ input }) => {
      const { periodId } = input;
      const db = await getDb();

      // 获取所有部门的统计数据
      const departments_list = await db
        .select({
          id: departments.id,
          name: departments.name,
        })
        .from(departments);

      const comparison = await Promise.all(
        departments_list.map(async (dept: typeof departments_list[0]) => {
          const scores = await db
            .select({
              totalScore: performanceAssessments.totalScore,
            })
            .from(performanceAssessments)
            .innerJoin(employees, eq(performanceAssessments.employeeId, employees.id))
            .where(
              and(
                eq(performanceAssessments.periodId, periodId),
                eq(employees.departmentId, dept.id)
              )
            );

          const distribution = {
            excellent: 0,
            good: 0,
            fair: 0,
            pass: 0,
            fail: 0,
          };

          scores.forEach((item: typeof scores[0]) => {
            const score = item.totalScore || 0;
            if (score >= 90) distribution.excellent++;
            else if (score >= 80) distribution.good++;
            else if (score >= 70) distribution.fair++;
            else if (score >= 60) distribution.pass++;
            else distribution.fail++;
          });

          const total = scores.length;
          const avgScore = total > 0 ? Math.round((scores.reduce((sum: number, item: typeof scores[0]) => sum + (item.totalScore || 0), 0) / total) * 10) / 10 : 0;

          return {
            departmentId: dept.id,
            departmentName: dept.name,
            total,
            averageScore: avgScore,
            distribution,
          };
        })
      );

      return comparison;
    }),

  // 获取周期统计信息
  getPeriodStats: protectedProcedure
    .input(z.object({
      periodId: z.string(),
    }))
    .query(async ({ input }) => {
      const { periodId } = input;
      const db = await getDb();

      // 获取周期信息
      const period = await db
        .select()
        .from(assessmentPeriods)
        .where(eq(assessmentPeriods.id, periodId))
        .then((result: any[]) => result[0]);

      if (!period) {
        throw new Error('Period not found');
      }
      
      const periodData = period as any;

      // 获取所有评分
      const assessments = await db
        .select({
          id: performanceAssessments.id,
          status: performanceAssessments.status,
          totalScore: performanceAssessments.totalScore,
        })
        .from(performanceAssessments)
        .where(eq(performanceAssessments.periodId, periodId));

      // 统计各状态的数量
      const stats = {
        total: assessments.length,
        draft: assessments.filter((a: typeof assessments[0]) => a.status === 'draft').length,
        submitted: assessments.filter((a: typeof assessments[0]) => a.status === 'submitted').length,
        approved: assessments.filter((a: typeof assessments[0]) => a.status === 'approved').length,
        rejected: assessments.filter((a: typeof assessments[0]) => a.status === 'rejected').length,
        completed: assessments.filter((a: typeof assessments[0]) => a.status === 'submitted' || a.status === 'approved').length,
        pending: assessments.filter((a: typeof assessments[0]) => a.status === 'draft' || a.status === 'rejected').length,
        averageScore: assessments.length > 0 
          ? Math.round((assessments.reduce((sum: number, a: typeof assessments[0]) => sum + (a.totalScore || 0), 0) / assessments.length) * 10) / 10 
          : 0,
      };

      return {
        period: periodData,
        stats,
      };
    }),
});

// 辅助函数：根据分数获取绩效等级
function getPerformanceLevel(score: number): string {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 70) return '一般';
  if (score >= 60) return '及格';
  return '不及格';
}
