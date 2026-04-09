/**
 * 管理层仪表板 API 路由
 * 支持员工排序、分数编辑、批量调整、定版等功能
 */

import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { getDb, performanceAssessments } from '../db';
import { eq, and } from 'drizzle-orm';

/**
 * 获取员工排序列表
 */
const getRankingList = protectedProcedure
  .input(
    z.object({
      periodId: z.string().optional(),
      departmentId: z.string().optional(),
      sortBy: z.enum(['score_desc', 'score_asc', 'name', 'rank']).default('score_desc'),
      searchQuery: z.string().optional(),
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
            position: true,
          },
        },
      },
    })) as any[];

    // 按部门筛选
    let filtered = assessments;
    if (input.departmentId) {
      filtered = assessments.filter((a: any) => a.employee?.departmentId === input.departmentId);
    }

    // 按搜索词筛选
    if (input.searchQuery) {
      filtered = filtered.filter((a: any) =>
        a.employee?.name.toLowerCase().includes(input.searchQuery?.toLowerCase())
      );
    }

    // 排序
    let sorted = [...filtered];
    switch (input.sortBy) {
      case 'score_desc':
        sorted.sort((a: any, b: any) => parseFloat(b.totalScore || 0) - parseFloat(a.totalScore || 0));
        break;
      case 'score_asc':
        sorted.sort((a: any, b: any) => parseFloat(a.totalScore || 0) - parseFloat(b.totalScore || 0));
        break;
      case 'name':
        sorted.sort((a: any, b: any) => a.employee?.name.localeCompare(b.employee?.name));
        break;
      case 'rank':
        sorted.sort((a: any, b: any) => (a.rank || 999) - (b.rank || 999));
        break;
    }

    // 添加排名
    const withRank = sorted.map((item: any, index: number) => ({
      ...item,
      rank: index + 1,
      level: getGradeLevel(parseFloat(item.totalScore || 0)),
    }));

    return withRank;
  });

/**
 * 更新单个员工的分数
 */
const updateScore = protectedProcedure
  .input(
    z.object({
      assessmentId: z.string(),
      totalScore: z.number().min(0).max(150),
      dailyWorkScore: z.number().optional(),
      workQualityScore: z.number().optional(),
      personalGoalScore: z.number().optional(),
      departmentReviewScore: z.number().optional(),
      bonusScore: z.number().optional(),
      penaltyScore: z.number().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const db = await getDb();

    // 更新评分
    await db
      .update(performanceAssessments)
      .set({
        totalScore: input.totalScore,
        dailyWorkScore: input.dailyWorkScore,
        workQualityScore: input.workQualityScore,
        personalGoalScore: input.personalGoalScore,
        departmentReviewScore: input.departmentReviewScore,
        bonusScore: input.bonusScore,
        penaltyScore: input.penaltyScore,
        updatedAt: new Date(),
      })
      .where(eq(performanceAssessments.id, input.assessmentId));

    return { success: true, message: '分数已更新' };
  });

/**
 * 批量更新排名
 */
const updateRanking = protectedProcedure
  .input(
    z.object({
      updates: z.array(
        z.object({
          assessmentId: z.string(),
          rank: z.number(),
        })
      ),
    })
  )
  .mutation(async ({ input }) => {
    const db = await getDb();

    // 批量更新排名
    for (const update of input.updates) {
      await db
        .update(performanceAssessments)
        .set({
          rank: update.rank,
          updatedAt: new Date(),
        })
        .where(eq(performanceAssessments.id, update.assessmentId));
    }

    return { success: true, message: '排名已更新' };
  });

/**
 * 获取周期统计信息
 */
const getPeriodStats = protectedProcedure
  .input(
    z.object({
      periodId: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    const db = await getDb();

    let whereConditions: any[] = [];
    if (input.periodId) {
      whereConditions.push(eq(performanceAssessments.periodId, input.periodId));
    }

    const assessments = (await db.query.performanceAssessments.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    })) as any[];

    const total = assessments.length;
    const completed = assessments.filter((a: any) => a.status === 'approved' || a.status === 'submitted').length;
    const pending = assessments.filter((a: any) => a.status === 'draft').length;
    const draft = assessments.filter((a: any) => a.status === 'draft').length;
    const submitted = assessments.filter((a: any) => a.status === 'submitted').length;
    const approved = assessments.filter((a: any) => a.status === 'approved').length;
    const rejected = assessments.filter((a: any) => a.status === 'rejected').length;

    const scores = assessments
      .filter((a: any) => a.totalScore)
      .map((a: any) => parseFloat(a.totalScore));
    const averageScore = scores.length > 0 ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1) : 0;

    return {
      stats: {
        total,
        completed,
        pending,
        averageScore: parseFloat(averageScore as string),
        draft,
        submitted,
        approved,
        rejected,
      },
    };
  });

/**
 * 获取绩效分布统计
 */
const getDistributionStats = protectedProcedure
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
    })) as any[];

    const total = assessments.length;
    const excellent = assessments.filter((a: any) => parseFloat(a.totalScore || 0) >= 90).length;
    const good = assessments.filter((a: any) => {
      const score = parseFloat(a.totalScore || 0);
      return score >= 80 && score < 90;
    }).length;
    const fair = assessments.filter((a: any) => {
      const score = parseFloat(a.totalScore || 0);
      return score >= 70 && score < 80;
    }).length;
    const pass = assessments.filter((a: any) => {
      const score = parseFloat(a.totalScore || 0);
      return score >= 60 && score < 70;
    }).length;
    const fail = assessments.filter((a: any) => parseFloat(a.totalScore || 0) < 60).length;

    return {
      distribution: {
        excellent: {
          count: excellent,
          percentage: total > 0 ? Math.round((excellent / total) * 100) : 0,
        },
        good: {
          count: good,
          percentage: total > 0 ? Math.round((good / total) * 100) : 0,
        },
        fair: {
          count: fair,
          percentage: total > 0 ? Math.round((fair / total) * 100) : 0,
        },
        pass: {
          count: pass,
          percentage: total > 0 ? Math.round((pass / total) * 100) : 0,
        },
        fail: {
          count: fail,
          percentage: total > 0 ? Math.round((fail / total) * 100) : 0,
        },
      },
    };
  });

/**
 * 获取部门对比数据
 */
const getDepartmentComparison = protectedProcedure
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
    const departmentMap = new Map<string, any[]>();
    assessments.forEach((a: any) => {
      const deptId = a.employee?.departmentId;
      if (deptId) {
        if (!departmentMap.has(deptId)) {
          departmentMap.set(deptId, []);
        }
        departmentMap.get(deptId)!.push(a);
      }
    });

    // 计算每个部门的统计
    const comparison = Array.from(departmentMap.entries()).map(([deptId, deptAssessments]: [string, any[]]) => {
      const total = deptAssessments.length;
      const scores = deptAssessments.map((a: any) => parseFloat(a.totalScore || 0));
      const averageScore = scores.length > 0 ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1) : 0;

      const excellent = deptAssessments.filter((a: any) => parseFloat(a.totalScore || 0) >= 90).length;
      const good = deptAssessments.filter((a: any) => {
        const score = parseFloat(a.totalScore || 0);
        return score >= 80 && score < 90;
      }).length;
      const fair = deptAssessments.filter((a: any) => {
        const score = parseFloat(a.totalScore || 0);
        return score >= 70 && score < 80;
      }).length;
      const pass = deptAssessments.filter((a: any) => {
        const score = parseFloat(a.totalScore || 0);
        return score >= 60 && score < 70;
      }).length;
      const fail = deptAssessments.filter((a: any) => parseFloat(a.totalScore || 0) < 60).length;

      return {
        departmentId: deptId,
        departmentName: deptAssessments[0]?.employee?.department?.name || 'Unknown',
        total,
        averageScore: parseFloat(averageScore as string),
        distribution: {
          excellent,
          good,
          fair,
          pass,
          fail,
        },
      };
    });

    return comparison;
  });

/**
 * 定版发布（锁定所有评分）
 */
const publishFinal = protectedProcedure
  .input(
    z.object({
      periodId: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const db = await getDb();

    // 更新所有该周期的评分为已定版
    await db
      .update(performanceAssessments)
      .set({
        status: 'finalized',
        updatedAt: new Date(),
      })
      .where(eq(performanceAssessments.periodId, input.periodId));

    return { success: true, message: '已定版发布' };
  });

/**
 * 获取等级标签
 */
function getGradeLevel(score: number): string {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 70) return '一般';
  if (score >= 60) return '及格';
  return '不及格';
}

export const managementRouter = router({
  getRankingList,
  updateScore,
  updateRanking,
  getPeriodStats,
  getDistributionStats,
  getDepartmentComparison,
  publishFinal,
});
