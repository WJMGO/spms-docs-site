/**
 * 绩效规则管理 API 路由
 * 提供绩效规则的增删改查功能，仅允许 admin 和 hr 角色操作
 */

import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  getActivePerformanceRules,
  getPerformanceRuleById,
  createPerformanceRule,
  updatePerformanceRule,
  deletePerformanceRule,
  addRuleCriteria,
  updateRuleCriteria,
  deleteRuleCriteria,
  getActiveBonusRules,
  createBonusRule,
  updateBonusRule,
  deleteBonusRule,
  getActivePenaltyRules,
  createPenaltyRule,
  updatePenaltyRule,
  deletePenaltyRule,
  getGradeRules,
  createGradeRule,
  updateGradeRule,
  deleteGradeRule,
  recordRuleVersion,
  getRuleVersionHistory,
} from '../db-performance-rules';

// 权限检查中间件：仅允许 admin 和 hr 角色
const adminOrHrProcedure = protectedProcedure.use(async ({ ctx, next }: any) => {
  if (ctx.user.role !== 'admin' && ctx.user.role !== 'hr') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: '您没有权限执行此操作，仅 admin 和 hr 角色可以管理绩效规则',
    });
  }
  return next({ ctx });
});

export const performanceRulesRouter = router({
  // ==================== 绩效维度规则 ====================

  /**
   * 获取所有活跃的绩效维度规则
   */
  getRules: publicProcedure.query(async () => {
    return await getActivePerformanceRules();
  }),

  /**
   * 获取单个规则详情及其评分标准
   */
  getRuleById: publicProcedure
    .input(z.object({ ruleId: z.string() }))
    .query(async ({ input }: any) => {
      const rule = await getPerformanceRuleById(input.ruleId);
      if (!rule) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '规则不存在',
        });
      }
      return rule;
    }),

  /**
   * 创建新的绩效维度规则
   */
  createRule: adminOrHrProcedure
    .input(
      z.object({
        title: z.string().min(1, '规则名称不能为空'),
        weight: z.number().min(0).max(100, '权重必须在 0-100 之间'),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const ruleId = await createPerformanceRule({
        title: input.title,
        weight: input.weight,
        description: input.description,
        createdBy: ctx.user.id,
      });

      // 记录版本
      await recordRuleVersion({
        ruleType: 'dimension',
        versionNumber: 1,
        content: { id: ruleId, ...input },
        changeDescription: `创建新规则: ${input.title}`,
        createdBy: ctx.user.id,
      });

      return { id: ruleId };
    }),

  /**
   * 更新绩效维度规则
   */
  updateRule: adminOrHrProcedure
    .input(
      z.object({
        ruleId: z.string(),
        title: z.string().optional(),
        weight: z.number().min(0).max(100).optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const { ruleId, ...updateData } = input;
      await updatePerformanceRule(ruleId, {
        ...updateData,
        updatedBy: ctx.user.id,
      });

      // 记录版本
      await recordRuleVersion({
        ruleType: 'dimension',
        versionNumber: 2,
        content: { id: ruleId, ...updateData },
        changeDescription: `更新规则: ${input.title || ''}`,
        createdBy: ctx.user.id,
      });

      return { success: true };
    }),

  /**
   * 删除绩效维度规则
   */
  deleteRule: adminOrHrProcedure
    .input(z.object({ ruleId: z.string() }))
    .mutation(async ({ input, ctx }: any) => {
      await deletePerformanceRule(input.ruleId);

      // 记录版本
      await recordRuleVersion({
        ruleType: 'dimension',
        versionNumber: 3,
        content: { id: input.ruleId },
        changeDescription: `删除规则`,
        createdBy: ctx.user.id,
      });

      return { success: true };
    }),

  /**
   * 为规则添加评分等级标准
   */
  addCriteria: adminOrHrProcedure
    .input(
      z.object({
        ruleId: z.string(),
        level: z.string().min(1, '等级名称不能为空'),
        scoreRange: z.string().min(1, '分数范围不能为空'),
        description: z.string().min(1, '描述不能为空'),
        examples: z.array(z.string()).optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const criteriaId = await addRuleCriteria({
        ruleId: input.ruleId,
        level: input.level,
        scoreRange: input.scoreRange,
        description: input.description,
        examples: input.examples,
        sortOrder: input.sortOrder,
      });
      return { id: criteriaId };
    }),

  /**
   * 更新评分等级标准
   */
  updateCriteria: adminOrHrProcedure
    .input(
      z.object({
        criteriaId: z.string(),
        level: z.string().optional(),
        scoreRange: z.string().optional(),
        description: z.string().optional(),
        examples: z.array(z.string()).optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const { criteriaId, ...updateData } = input;
      await updateRuleCriteria(criteriaId, updateData);
      return { success: true };
    }),

  /**
   * 删除评分等级标准
   */
  deleteCriteria: adminOrHrProcedure
    .input(z.object({ criteriaId: z.string() }))
    .mutation(async ({ input }: any) => {
      await deleteRuleCriteria(input.criteriaId);
      return { success: true };
    }),

  // ==================== 加分规则 ====================

  /**
   * 获取所有活跃的加分规则
   */
  getBonusRules: publicProcedure.query(async () => {
    return await getActiveBonusRules();
  }),

  /**
   * 创建加分规则
   */
  createBonusRule: adminOrHrProcedure
    .input(
      z.object({
        criteria: z.string().min(1, '加分条件不能为空'),
        minPoints: z.number().min(0, '最小加分不能为负数'),
        maxPoints: z.number().min(0, '最大加分不能为负数'),
        description: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (input.maxPoints < input.minPoints) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '最大加分不能小于最小加分',
        });
      }

      const ruleId = await createBonusRule({
        criteria: input.criteria,
        minPoints: input.minPoints,
        maxPoints: input.maxPoints,
        description: input.description,
        sortOrder: input.sortOrder,
        createdBy: ctx.user.id,
      });

      // 记录版本
      await recordRuleVersion({
        ruleType: 'bonus',
        versionNumber: 1,
        content: { id: ruleId, ...input },
        changeDescription: `创建加分规则: ${input.criteria}`,
        createdBy: ctx.user.id,
      });

      return { id: ruleId };
    }),

  /**
   * 更新加分规则
   */
  updateBonusRule: adminOrHrProcedure
    .input(
      z.object({
        ruleId: z.string(),
        criteria: z.string().optional(),
        minPoints: z.number().optional(),
        maxPoints: z.number().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const { ruleId, ...updateData } = input;

      if (updateData.maxPoints && updateData.minPoints && updateData.maxPoints < updateData.minPoints) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '最大加分不能小于最小加分',
        });
      }

      await updateBonusRule(ruleId, {
        ...updateData,
        updatedBy: ctx.user.id,
      });

      // 记录版本
      await recordRuleVersion({
        ruleType: 'bonus',
        versionNumber: 2,
        content: { id: ruleId, ...updateData },
        changeDescription: `更新加分规则`,
        createdBy: ctx.user.id,
      });

      return { success: true };
    }),

  /**
   * 删除加分规则
   */
  deleteBonusRule: adminOrHrProcedure
    .input(z.object({ ruleId: z.string() }))
    .mutation(async ({ input, ctx }: any) => {
      await deleteBonusRule(input.ruleId);

      // 记录版本
      await recordRuleVersion({
        ruleType: 'bonus',
        versionNumber: 3,
        content: { id: input.ruleId },
        changeDescription: `删除加分规则`,
        createdBy: ctx.user.id,
      });

      return { success: true };
    }),

  // ==================== 减分规则 ====================

  /**
   * 获取所有活跃的减分规则
   */
  getPenaltyRules: publicProcedure.query(async () => {
    return await getActivePenaltyRules();
  }),

  /**
   * 创建减分规则
   */
  createPenaltyRule: adminOrHrProcedure
    .input(
      z.object({
        criteria: z.string().min(1, '减分条件不能为空'),
        minPoints: z.number().max(0, '最小减分必须为负数或零'),
        maxPoints: z.number().max(0, '最大减分必须为负数或零'),
        description: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (input.maxPoints < input.minPoints) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '最大减分不能小于最小减分',
        });
      }

      const ruleId = await createPenaltyRule({
        criteria: input.criteria,
        minPoints: input.minPoints,
        maxPoints: input.maxPoints,
        description: input.description,
        sortOrder: input.sortOrder,
        createdBy: ctx.user.id,
      });

      // 记录版本
      await recordRuleVersion({
        ruleType: 'penalty',
        versionNumber: 1,
        content: { id: ruleId, ...input },
        changeDescription: `创建减分规则: ${input.criteria}`,
        createdBy: ctx.user.id,
      });

      return { id: ruleId };
    }),

  /**
   * 更新减分规则
   */
  updatePenaltyRule: adminOrHrProcedure
    .input(
      z.object({
        ruleId: z.string(),
        criteria: z.string().optional(),
        minPoints: z.number().optional(),
        maxPoints: z.number().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const { ruleId, ...updateData } = input;

      if (updateData.maxPoints && updateData.minPoints && updateData.maxPoints < updateData.minPoints) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '最大减分不能小于最小减分',
        });
      }

      await updatePenaltyRule(ruleId, {
        ...updateData,
        updatedBy: ctx.user.id,
      });

      // 记录版本
      await recordRuleVersion({
        ruleType: 'penalty',
        versionNumber: 2,
        content: { id: ruleId, ...updateData },
        changeDescription: `更新减分规则`,
        createdBy: ctx.user.id,
      });

      return { success: true };
    }),

  /**
   * 删除减分规则
   */
  deletePenaltyRule: adminOrHrProcedure
    .input(z.object({ ruleId: z.string() }))
    .mutation(async ({ input, ctx }: any) => {
      await deletePenaltyRule(input.ruleId);

      // 记录版本
      await recordRuleVersion({
        ruleType: 'penalty',
        versionNumber: 3,
        content: { id: input.ruleId },
        changeDescription: `删除减分规则`,
        createdBy: ctx.user.id,
      });

      return { success: true };
    }),

  // ==================== 等级划分规则 ====================

  /**
   * 获取所有等级划分规则
   */
  getGradeRules: publicProcedure.query(async () => {
    return await getGradeRules();
  }),

  /**
   * 创建等级划分规则
   */
  createGradeRule: adminOrHrProcedure
    .input(
      z.object({
        grade: z.string().min(1, '等级名称不能为空'),
        minScore: z.number().min(0, '最低分数不能为负数'),
        maxScore: z.number().min(0, '最高分数不能为负数'),
        percentage: z.number().optional(),
        benefits: z.string().optional(),
        description: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      if (input.maxScore < input.minScore) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '最高分数不能小于最低分数',
        });
      }

      const ruleId = await createGradeRule({
        grade: input.grade,
        minScore: input.minScore,
        maxScore: input.maxScore,
        percentage: input.percentage,
        benefits: input.benefits,
        description: input.description,
        sortOrder: input.sortOrder,
        createdBy: ctx.user.id,
      });

      // 记录版本
      await recordRuleVersion({
        ruleType: 'grade',
        versionNumber: 1,
        content: { id: ruleId, ...input },
        changeDescription: `创建等级规则: ${input.grade}`,
        createdBy: ctx.user.id,
      });

      return { id: ruleId };
    }),

  /**
   * 更新等级划分规则
   */
  updateGradeRule: adminOrHrProcedure
    .input(
      z.object({
        ruleId: z.string(),
        grade: z.string().optional(),
        minScore: z.number().optional(),
        maxScore: z.number().optional(),
        percentage: z.number().optional(),
        benefits: z.string().optional(),
        description: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const { ruleId, ...updateData } = input;

      if (updateData.maxScore && updateData.minScore && updateData.maxScore < updateData.minScore) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '最高分数不能小于最低分数',
        });
      }

      await updateGradeRule(ruleId, {
        ...updateData,
        updatedBy: ctx.user.id,
      });

      // 记录版本
      await recordRuleVersion({
        ruleType: 'grade',
        versionNumber: 2,
        content: { id: ruleId, ...updateData },
        changeDescription: `更新等级规则`,
        createdBy: ctx.user.id,
      });

      return { success: true };
    }),

  /**
   * 删除等级划分规则
   */
  deleteGradeRule: adminOrHrProcedure
    .input(z.object({ ruleId: z.string() }))
    .mutation(async ({ input, ctx }: any) => {
      await deleteGradeRule(input.ruleId);

      // 记录版本
      await recordRuleVersion({
        ruleType: 'grade',
        versionNumber: 3,
        content: { id: input.ruleId },
        changeDescription: `删除等级规则`,
        createdBy: ctx.user.id,
      });

      return { success: true };
    }),

  // ==================== 规则版本管理 ====================

  /**
   * 获取规则版本历史
   */
  getRuleVersionHistory: protectedProcedure
    .input(z.object({ ruleType: z.string() }))
    .query(async ({ input }: any) => {
      return await getRuleVersionHistory(input.ruleType);
    }),
});
