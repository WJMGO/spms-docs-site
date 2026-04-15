import { z } from 'zod';
import { publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

// 个人月度目标 Schema
const PersonalGoalSchema = z.object({
  id: z.string(),
  type: z.enum(['KPI', 'Task']),
  description: z.string(),
  krs: z.string().optional(),
  targetDate: z.string().optional(),
  status: z.enum(['completed', 'in_progress', 'pending']),
  score: z.number().min(0).max(100),
});

// 工作质量数据 Schema
const WorkQualityMetricSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  description: z.string(),
});

// 绩效加分项 Schema
const BonusItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  description: z.string(),
  score: z.number().min(0),
});

// 绩效扣分项 Schema
const PenaltyItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  description: z.string(),
  score: z.number().max(0),
});

// 绩效登记数据 Schema
const PerformanceRegistrationSchema = z.object({
  employeeId: z.string(),
  periodId: z.string(),
  forecastScore: z.number().min(0).max(100),
  scoreChange: z.number(),
  personalGoals: z.array(PersonalGoalSchema),
  workQualityMetrics: z.array(WorkQualityMetricSchema),
  bonusItems: z.array(BonusItemSchema),
  penaltyItems: z.array(PenaltyItemSchema),
  notes: z.string().optional(),
});

export const registrationRouter: any = {
  // 获取绩效登记数据
  getRegistration: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        periodId: z.string(),
      })
    )
    .query(async ({ input, ctx }: any) => {
      try {
        // 这里应该从数据库查询实际数据
        // 目前返回示例数据
        return {
          success: true,
          data: {
            employeeId: input.employeeId,
            periodId: input.periodId,
            forecastScore: 95.8,
            scoreChange: 2.4,
            personalGoals: [
              {
                id: '1',
                type: 'KPI' as const,
                description: '云原生架构迁移',
                krs: '完成80%核心服务度发布',
                targetDate: '12-20',
                status: 'in_progress' as const,
                score: 45.0,
              },
              {
                id: '2',
                type: 'Task' as const,
                description: '安全审计优化',
                krs: '修复Top 10高危漏洞',
                targetDate: '12-15',
                status: 'in_progress' as const,
                score: 30.0,
              },
            ],
            workQualityMetrics: [
              {
                id: '1',
                name: '代码走查',
                value: 24,
                description: '代码走查次数',
              },
              {
                id: '2',
                name: '审计',
                value: 12,
                description: '代码审核通过',
              },
              {
                id: '3',
                name: 'Bug打回率',
                value: 3,
                description: 'Bug打回打回',
              },
              {
                id: '4',
                name: '设计',
                value: 8,
                description: '设计审查参与',
              },
            ],
            bonusItems: [
              {
                id: '1',
                type: '培养新人',
                description: '担任新人指导师，指导新人入职，并在月度使用期间进行指导',
                score: 5.0,
              },
              {
                id: '2',
                type: '技术分享',
                description: '主持《大数据安全架构》部门内技术分享，参与人数50+，评评率98%',
                score: 8.0,
              },
            ],
            penaltyItems: [
              {
                id: '1',
                type: '技术失误',
                description: '无',
                score: -0.0,
              },
              {
                id: '2',
                type: '管理失误',
                description: '参与绩效登记（1次）',
                score: -0.5,
              },
              {
                id: '3',
                type: '质量异常',
                description: '无',
                score: -0.0,
              },
            ],
            notes: '',
          },
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取绩效登记数据失败',
        });
      }
    }),

  // 保存绩效登记数据
  saveRegistration: protectedProcedure
    .input(PerformanceRegistrationSchema)
    .mutation(async ({ input, ctx }: any) => {
      try {
        // 验证权限
        if (ctx.user.id !== input.employeeId && ctx.user.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: '无权保存他人的绩效登记数据',
          });
        }

        // 计算总分
        const personalGoalsScore = input.personalGoals.reduce((sum: number, goal: any) => sum + goal.score, 0);
        const bonusScore = input.bonusItems.reduce((sum: number, item: any) => sum + item.score, 0);
        const penaltyScore = input.penaltyItems.reduce((sum: number, item: any) => sum + item.score, 0);
        const totalScore = personalGoalsScore + bonusScore + penaltyScore;

        // 这里应该保存到数据库
        // 目前只返回成功响应
        return {
          success: true,
          message: '数据保存成功',
          data: {
            ...input,
            totalScore,
            savedAt: new Date(),
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '保存绩效登记数据失败',
        });
      }
    }),

  // 提交绩效登记数据
  submitRegistration: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        periodId: z.string(),
        data: PerformanceRegistrationSchema,
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      try {
        // 验证权限
        if (ctx.user.id !== input.employeeId && ctx.user.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: '无权提交他人的绩效登记数据',
          });
        }

        // 计算总分
        const personalGoalsScore = input.data.personalGoals.reduce((sum: number, goal: any) => sum + goal.score, 0);
        const bonusScore = input.data.bonusItems.reduce((sum: number, item: any) => sum + item.score, 0);
        const penaltyScore = input.data.penaltyItems.reduce((sum: number, item: any) => sum + item.score, 0);
        const totalScore = personalGoalsScore + bonusScore + penaltyScore;

        // 这里应该保存到数据库并更新状态为 'submitted'
        // 目前只返回成功响应
        return {
          success: true,
          message: '数据提交成功',
          data: {
            ...input.data,
            totalScore,
            status: 'submitted',
            submittedAt: new Date(),
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '提交绩效登记数据失败',
        });
      }
    }),

  // 添加绩效加分项
  addBonusItem: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        periodId: z.string(),
        type: z.string(),
        description: z.string(),
        score: z.number().min(0),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      try {
        // 验证权限
        if (ctx.user.id !== input.employeeId && ctx.user.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: '无权添加他人的绩效加分项',
          });
        }

        return {
          success: true,
          message: '加分项添加成功',
          data: {
            id: `bonus_${Date.now()}`,
            ...input,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '添加绩效加分项失败',
        });
      }
    }),

  // 添加绩效扣分项
  addPenaltyItem: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        periodId: z.string(),
        type: z.string(),
        description: z.string(),
        score: z.number().max(0),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      try {
        // 验证权限
        if (ctx.user.id !== input.employeeId && ctx.user.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: '无权添加他人的绩效扣分项',
          });
        }

        return {
          success: true,
          message: '扣分项添加成功',
          data: {
            id: `penalty_${Date.now()}`,
            ...input,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '添加绩效扣分项失败',
        });
      }
    }),
};
