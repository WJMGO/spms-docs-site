import { router, protectedProcedure, adminProcedure } from '../trpc';
import { z } from 'zod';
import { getDb, assessmentTemplates, assessmentItems, assessmentPeriods, performanceAssessments, assessmentScores } from '../db';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

/**
 * 评分模板路由
 */
const templatesRouter = router({
  /**
   * 获取评分模板列表
   */
  list: protectedProcedure
    .input(
      z.object({
        skip: z.number().default(0),
        take: z.number().default(10),
        type: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      const templates = await db.query.assessmentTemplates.findMany({
        limit: input.take,
        offset: input.skip,
        with: {
          items: (items: any) => ({}),
        },
      });
      return templates;
    }),

  /**
   * 获取评分模板详情
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const template = await db.query.assessmentTemplates.findFirst({
        where: eq(assessmentTemplates.id, input.id),
        with: {
          items: (items: any) => ({}),
        },
      });
      return template;
    }),

  /**
   * 创建评分模板
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        type: z.string(),
        totalScore: z.number().default(100),
        items: z.array(
          z.object({
            name: z.string(),
            description: z.string().optional(),
            weight: z.number(),
            minScore: z.number().default(0),
            maxScore: z.number().default(100),
            order: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      const templateId = uuidv4();

      // 创建模板
      await db.insert(assessmentTemplates).values({
        id: templateId,
        name: input.name,
        description: input.description,
        type: input.type,
        totalScore: input.totalScore.toString(),
        status: 'active',
      });

      // 创建评分项
      if (input.items && input.items.length > 0) {
        await db.insert(assessmentItems).values(
          input.items.map((item) => ({
            id: uuidv4(),
            templateId,
            name: item.name,
            description: item.description,
            weight: item.weight.toString(),
            minScore: item.minScore.toString(),
            maxScore: item.maxScore.toString(),
            order: item.order,
          }))
        );
      }

      return { id: templateId, success: true };
    }),

  /**
   * 更新评分模板
   */
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db
        .update(assessmentTemplates)
        .set({
          name: input.name,
          description: input.description,
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(assessmentTemplates.id, input.id));

      return { success: true };
    }),

  /**
   * 删除评分模板
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      // 删除评分项
      await db.delete(assessmentItems).where(eq(assessmentItems.templateId, input.id));
      
      // 删除模板
      await db.delete(assessmentTemplates).where(eq(assessmentTemplates.id, input.id));

      return { success: true };
    }),
});

/**
 * 评分周期路由
 */
const periodsRouter = router({
  /**
   * 获取评分周期列表
   */
  list: protectedProcedure
    .input(
      z.object({
        skip: z.number().default(0),
        take: z.number().default(10),
        status: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      const periods = await db.query.assessmentPeriods.findMany({
        limit: input.take,
        offset: input.skip,
        orderBy: (periods: any) => [desc(periods.startDate)],
      });
      return periods;
    }),

  /**
   * 获取评分周期详情
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const period = await db.query.assessmentPeriods.findFirst({
        where: eq(assessmentPeriods.id, input.id),
        with: {
          assessments: true,
        },
      });
      return period;
    }),

  /**
   * 创建评分周期
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      const id = uuidv4();

      await db.insert(assessmentPeriods).values({
        id,
        name: input.name,
        description: input.description,
        startDate: input.startDate,
        endDate: input.endDate,
        status: 'draft',
      });

      return { id, success: true };
    }),

  /**
   * 更新评分周期状态
   */
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(['draft', 'active', 'closed', 'completed']),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db
        .update(assessmentPeriods)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(assessmentPeriods.id, input.id));

      return { success: true };
    }),

  /**
   * 获取当前活跃的评分周期
   */
  getActive: protectedProcedure.query(async () => {
    const db = await getDb();
    const now = new Date();
    const activePeriod = await db.query.assessmentPeriods.findFirst({
      where: and(
        eq(assessmentPeriods.status, 'active'),
        lte(assessmentPeriods.startDate, now),
        gte(assessmentPeriods.endDate, now)
      ),
    });
    return activePeriod;
  }),
});

/**
 * 绩效评分路由
 */
const assessmentsRouter = router({
  /**
   * 获取评分列表
   */
  list: protectedProcedure
    .input(
      z.object({
        skip: z.number().default(0),
        take: z.number().default(10),
        periodId: z.string().optional(),
        employeeId: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      
      // 普通员工只能看自己的评分
      let where: any = {};
      if (ctx.user.role === 'employee') {
        where.employeeId = input.employeeId;
      } else {
        if (input.employeeId) where.employeeId = input.employeeId;
        if (input.periodId) where.periodId = input.periodId;
        if (input.status) where.status = input.status;
      }

      const assessments = await db.query.performanceAssessments.findMany({
        limit: input.take,
        offset: input.skip,
        with: {
          employee: {
            with: {
              user: true,
            },
          },
          template: true,
          evaluator: true,
          scores: {
            with: {
              item: true,
            },
          },
        },
      });

      return assessments;
    }),

  /**
   * 获取评分详情
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      const assessment = await db.query.performanceAssessments.findFirst({
        where: eq(performanceAssessments.id, input.id),
        with: {
          employee: {
            with: {
              user: true,
              department: true,
              position: true,
            },
          },
          period: true,
          template: {
            with: {
              items: {
                orderBy: (items: any) => [items.order],
              },
            },
          },
          evaluator: true,
          approver: true,
          scores: {
            with: {
              item: true,
            },
          },
        },
      });

      // 权限检查
      if (
        ctx.user.role === 'employee' &&
        assessment?.employee?.userId !== ctx.user.id &&
        assessment?.evaluatorId !== ctx.user.id
      ) {
        throw new Error('Unauthorized');
      }

      return assessment;
    }),

  /**
   * 创建评分
   */
  create: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        periodId: z.string(),
        templateId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();

      // 权限检查：只有管理员、HR 和经理可以创建评分
      if (!['admin', 'hr', 'manager'].includes(ctx.user.role)) {
        throw new Error('Unauthorized');
      }

      const id = uuidv4();

      await db.insert(performanceAssessments).values({
        id,
        employeeId: input.employeeId,
        periodId: input.periodId,
        templateId: input.templateId,
        evaluatorId: ctx.user.id,
        status: 'draft',
      });

      return { id, success: true };
    }),

  /**
   * 提交评分
   */
  submit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        scores: z.array(
          z.object({
            itemId: z.string(),
            score: z.number(),
            remark: z.string().optional(),
          })
        ),
        comments: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();

      // 获取评分记录
      const assessment = await db.query.performanceAssessments.findFirst({
        where: eq(performanceAssessments.id, input.id),
      });

      if (!assessment) {
        throw new Error('Assessment not found');
      }

      // 权限检查
      if (assessment.evaluatorId !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      // 计算总分
      let totalScore = 0;
      const template = await db.query.assessmentTemplates.findFirst({
        where: eq(assessmentTemplates.id, assessment.templateId),
        with: {
          items: (items: any) => ({}),
        },
      });

      if (template) {
        for (const score of input.scores) {
          const item = template.items.find((i: any) => i.id === score.itemId);
          if (item) {
            totalScore += score.score * (parseFloat(item.weight) / 100);
          }
        }
      }

      // 更新评分记录
      await db
        .update(performanceAssessments)
        .set({
          status: 'submitted',
          totalScore: totalScore.toString(),
          comments: input.comments,
          submittedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(performanceAssessments.id, input.id));

      // 删除旧的评分分数
      await db.delete(assessmentScores).where(eq(assessmentScores.assessmentId, input.id));

      // 创建新的评分分数
      if (input.scores.length > 0) {
        await db.insert(assessmentScores).values(
          input.scores.map((score) => ({
            id: uuidv4(),
            assessmentId: input.id,
            itemId: score.itemId,
            score: score.score.toString(),
            remark: score.remark,
          }))
        );
      }

      return { success: true };
    }),

  /**
   * 批准评分
   */
  approve: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();

      await db
        .update(performanceAssessments)
        .set({
          status: 'approved',
          approvedAt: new Date(),
          approvedBy: ctx.user.id,
          updatedAt: new Date(),
        })
        .where(eq(performanceAssessments.id, input.id));

      return { success: true };
    }),

  /**
   * 拒绝评分
   */
  reject: adminProcedure
    .input(
      z.object({
        id: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();

      await db
        .update(performanceAssessments)
        .set({
          status: 'rejected',
          comments: input.reason,
          updatedAt: new Date(),
        })
        .where(eq(performanceAssessments.id, input.id));

      return { success: true };
    }),

  /**
   * 获取员工的评分统计
   */
  getEmployeeStats: protectedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();

      const assessments = await db.query.performanceAssessments.findMany({
        where: eq(performanceAssessments.employeeId, input.employeeId),
      });

      const stats = {
        total: assessments.length,
        draft: assessments.filter((a: any) => a.status === 'draft').length,
        submitted: assessments.filter((a: any) => a.status === 'submitted').length,
        approved: assessments.filter((a: any) => a.status === 'approved').length,
        rejected: assessments.filter((a: any) => a.status === 'rejected').length,
        averageScore:
          assessments.filter((a: any) => a.totalScore).length > 0
            ? (
                assessments.reduce((sum: number, a: any) => sum + (a.totalScore ? parseFloat(a.totalScore) : 0), 0) /
                assessments.filter((a: any) => a.totalScore).length
              ).toFixed(2)
            : 0,
      };

      return stats;
    }),
});

/**
 * 导出评分路由
 */
export const assessmentRouter = router({
  templates: templatesRouter,
  periods: periodsRouter,
  assessments: assessmentsRouter,
});
