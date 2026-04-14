/**
 * 绩效评分路由
 * 支持真实的 6 个维度评分
 */

import { router, protectedProcedure, adminProcedure } from '../trpc';
import { z } from 'zod';
import { getDb, performanceAssessments, workQualityDetails, personalGoalDetails, departmentReviewDetails, bonusDetails, penaltyDetails, employees } from '../db';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { logAudit } from '../audit-logger';
import {
  calculateWorkQualityScore,
  calculatePersonalGoalScore,
  calculateDepartmentReviewScore,
  calculateBonusScore,
  calculatePenaltyScore,
  calculateTotalScore,
  getPerformanceGrade,
  calculateRankPercentile,
} from '../performance-calculator';

// 定义输入类型
const workQualityInput = z.object({
  assessmentId: z.string(),
  codeReviewCount: z.number().default(0),
  codeAuditCount: z.number().default(0),
  codeAuditErrorCount: z.number().default(0),
  bugReturnRate: z.number().default(0),
  personalBugCount: z.number().default(0),
  overdueProblemsAchieved: z.boolean().default(false),
  designReviewCount: z.number().default(0),
});

const personalGoalInput = z.object({
  assessmentId: z.string(),
  sprintCompletionRate: z.number().default(0),
  milestonAchievementRate: z.number().default(0),
  keyMatterScore: z.number().default(0),
  keyMatterDescription: z.string().optional(),
  completionRate: z.number().default(0),
});

const departmentReviewInput = z.object({
  assessmentId: z.string(),
  teamDeliveryScore: z.number().default(0),
  teamCollaborationScore: z.number().default(0),
  attitudeScore: z.number().default(0),
});

const bonusInput = z.object({
  assessmentId: z.string(),
  newPersonTrainingScore: z.number().default(0),
  sharingScore: z.number().default(0),
  patentScore: z.number().default(0),
  documentScore: z.number().default(0),
  innovationScore: z.number().default(0),
  teamAtmosphereScore: z.number().default(0),
  recruitmentScore: z.number().default(0),
  praiseScore: z.number().default(0),
  plScore: z.number().default(0),
});

const penaltyInput = z.object({
  assessmentId: z.string(),
  technicalErrorAmount: z.number().default(0),
  lowErrorAmount: z.number().default(0),
  softwareTestingAnomalyCount: z.number().default(0),
  jenkinsCompileErrorCount: z.number().default(0),
  codeReviewAnomalyCount: z.number().default(0),
});

/**
 * 工作质量评分路由
 */
const workQualityRouter = router({
  /**
   * 保存工作质量评分详情
   */
  save: protectedProcedure
    .input(workQualityInput)
    .mutation(async ({ input, ctx }: any) => {
      const db = await getDb();

      // 计算分数
      const score = calculateWorkQualityScore({
        codeReviewCount: input.codeReviewCount,
        codeAuditCount: input.codeAuditCount,
        codeAuditErrorCount: input.codeAuditErrorCount,
        bugReturnRate: input.bugReturnRate,
        personalBugCount: input.personalBugCount,
        overdueProblemsAchieved: input.overdueProblemsAchieved,
        designReviewCount: input.designReviewCount,
      });

      // 查找或创建工作质量详情记录
      const existing = await db.query.workQualityDetails.findFirst({
        where: eq(workQualityDetails.assessmentId, input.assessmentId),
      });

      if (existing) {
        await db
          .update(workQualityDetails)
          .set({
            codeReviewCount: input.codeReviewCount,
            codeAuditCount: input.codeAuditCount,
            codeAuditScore: (input.codeAuditCount * 0.5 + (input.codeAuditCount >= 50 ? 2 : input.codeAuditCount >= 30 ? 1 : 0)).toString(),
            bugReturnRate: input.bugReturnRate.toString(),
            bugReturnRateScore: (input.bugReturnRate <= 3 ? 2 : input.bugReturnRate <= 5 ? 1 : 0).toString(),
            personalBugCount: input.personalBugCount,
            personalBugScore: (-input.personalBugCount).toString(),
            overdueProblemsAchieved: input.overdueProblemsAchieved,
            overdueProblemsScore: input.overdueProblemsAchieved ? '3' : '0',
            designReviewCount: input.designReviewCount,
            designReviewScore: (Math.min(input.designReviewCount * 0.5, 4)).toString(),
            totalScore: score.toString(),
            updatedAt: new Date(),
          })
          .where(eq(workQualityDetails.assessmentId, input.assessmentId));
      } else {
        await db.insert(workQualityDetails).values({
          id: uuidv4(),
          assessmentId: input.assessmentId,
          codeReviewCount: input.codeReviewCount,
          codeReviewScore: (Math.min(input.codeReviewCount * 0.5, 4)).toString(),
          codeAuditCount: input.codeAuditCount,
          codeAuditScore: (input.codeAuditCount * 0.5 + (input.codeAuditCount >= 50 ? 2 : input.codeAuditCount >= 30 ? 1 : 0)).toString(),
          bugReturnRate: input.bugReturnRate.toString(),
          bugReturnRateScore: (input.bugReturnRate <= 3 ? 2 : input.bugReturnRate <= 5 ? 1 : 0).toString(),
          personalBugCount: input.personalBugCount,
          personalBugScore: (-input.personalBugCount).toString(),
          overdueProblemsAchieved: input.overdueProblemsAchieved,
          overdueProblemsScore: input.overdueProblemsAchieved ? '3' : '0',
          designReviewCount: input.designReviewCount,
          designReviewScore: (Math.min(input.designReviewCount * 0.5, 4)).toString(),
          totalScore: score.toString(),
        });
      }

      // 更新主表中的工作质量分数
      await db
        .update(performanceAssessments)
        .set({
          workQualityScore: score.toString(),
          updatedAt: new Date(),
        })
        .where(eq(performanceAssessments.id, input.assessmentId));

      // 记录审计日志
      await logAudit({
        userId: ctx.user?.id || 'unknown',
        userName: ctx.user?.name || 'Unknown',
        action: 'save_work_quality_score',
        resource: 'assessment',
        resourceId: input.assessmentId,
        resourceName: `Assessment ${input.assessmentId}`,
        changes: {
          workQualityScore: score,
        },
        newValue: input,
        status: 'success',
      });

      return { success: true, score };
    }),

  /**
   * 获取工作质量评分详情
   */
  get: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const details = await db.query.workQualityDetails.findFirst({
        where: eq(workQualityDetails.assessmentId, input.assessmentId),
      });
      return details;
    }),
});

/**
 * 个人目标评分路由
 */
const personalGoalRouter = router({
  /**
   * 保存个人目标评分详情
   */
  save: protectedProcedure
    .input(personalGoalInput)
    .mutation(async ({ input, ctx }: any) => {
      const db = await getDb();

      // 计算分数
      const score = calculatePersonalGoalScore({
        sprintCompletionRate: input.sprintCompletionRate,
        milestonAchievementRate: input.milestonAchievementRate,
        keyMatterScore: input.keyMatterScore,
        completionRate: input.completionRate,
      });

      // 查找或创建个人目标详情记录
      const existing = await db.query.personalGoalDetails.findFirst({
        where: eq(personalGoalDetails.assessmentId, input.assessmentId),
      });

      if (existing) {
        await db
          .update(personalGoalDetails)
          .set({
            sprintCompletionRate: input.sprintCompletionRate.toString(),
            milestonAchievementRate: input.milestonAchievementRate.toString(),
            keyMatterScore: input.keyMatterScore.toString(),
            keyMatterDescription: input.keyMatterDescription,
            keyMatterCompletionRate: input.completionRate.toString(),
            totalScore: score.toString(),
            updatedAt: new Date(),
          })
          .where(eq(personalGoalDetails.assessmentId, input.assessmentId));
      } else {
        await db.insert(personalGoalDetails).values({
          id: uuidv4(),
          assessmentId: input.assessmentId,
          sprintCompletionRate: input.sprintCompletionRate.toString(),
          milestonAchievementRate: input.milestonAchievementRate.toString(),
          keyMatterScore: input.keyMatterScore.toString(),
          keyMatterDescription: input.keyMatterDescription,
          keyMatterCompletionRate: input.completionRate.toString(),
          totalScore: score.toString(),
        });
      }

      // 更新主表中的个人目标分数
      await db
        .update(performanceAssessments)
        .set({
          personalGoalScore: score.toString(),
          updatedAt: new Date(),
        })
        .where(eq(performanceAssessments.id, input.assessmentId));

      return { success: true, score };
    }),

  /**
   * 获取个人目标评分详情
   */
  get: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const details = await db.query.personalGoalDetails.findFirst({
        where: eq(personalGoalDetails.assessmentId, input.assessmentId),
      });
      return details;
    }),
});

/**
 * 部门互评路由
 */
const departmentReviewRouter = router({
  /**
   * 保存部门互评评分详情
   */
  save: protectedProcedure
    .input(departmentReviewInput)
    .mutation(async ({ input, ctx }: any) => {
      const db = await getDb();

      // 计算平均分作为排名百分比的参考
      const avgScore = (input.teamDeliveryScore + input.teamCollaborationScore + input.attitudeScore) / 3;
      const score = calculateDepartmentReviewScore({
        rankPercentile: avgScore * 20, // 转换为百分比
      });

      // 查找或创建部门互评详情记录
      const existing = await db.query.departmentReviewDetails.findFirst({
        where: eq(departmentReviewDetails.assessmentId, input.assessmentId),
      });

      if (existing) {
        await db
          .update(departmentReviewDetails)
          .set({
            teamDeliveryScore: input.teamDeliveryScore.toString(),
            teamCollaborationScore: input.teamCollaborationScore.toString(),
            attitudeScore: input.attitudeScore.toString(),
            rankPercentile: (avgScore * 20).toString(),
            totalScore: score.toString(),
            updatedAt: new Date(),
          })
          .where(eq(departmentReviewDetails.assessmentId, input.assessmentId));
      } else {
        await db.insert(departmentReviewDetails).values({
          id: uuidv4(),
          assessmentId: input.assessmentId,
          teamDeliveryScore: input.teamDeliveryScore.toString(),
          teamCollaborationScore: input.teamCollaborationScore.toString(),
          attitudeScore: input.attitudeScore.toString(),
          rankPercentile: (avgScore * 20).toString(),
          totalScore: score.toString(),
        });
      }

      // 更新主表中的部门互评分数
      await db
        .update(performanceAssessments)
        .set({
          departmentReviewScore: score.toString(),
          updatedAt: new Date(),
        })
        .where(eq(performanceAssessments.id, input.assessmentId));

      return { success: true, score };
    }),

  /**
   * 获取部门互评评分详情
   */
  get: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const details = await db.query.departmentReviewDetails.findFirst({
        where: eq(departmentReviewDetails.assessmentId, input.assessmentId),
      });
      return details;
    }),
});

/**
 * 绩效加分路由
 */
const bonusRouter = router({
  /**
   * 保存绩效加分详情
   */
  save: protectedProcedure
    .input(bonusInput)
    .mutation(async ({ input, ctx }: any) => {
      const db = await getDb();

      // 计算分数
      const score = calculateBonusScore({
        newPersonTrainingScore: input.newPersonTrainingScore,
        sharingScore: input.sharingScore,
        patentScore: input.patentScore,
        documentScore: input.documentScore,
        innovationScore: input.innovationScore,
        teamAtmosphereScore: input.teamAtmosphereScore,
        recruitmentScore: input.recruitmentScore,
        praiseScore: input.praiseScore,
        plScore: input.plScore,
      });

      // 查找或创建绩效加分详情记录
      const existing = await db.query.bonusDetails.findFirst({
        where: eq(bonusDetails.assessmentId, input.assessmentId),
      });

      if (existing) {
        await db
          .update(bonusDetails)
          .set({
            newPersonTrainingScore: input.newPersonTrainingScore.toString(),
            sharingScore: input.sharingScore.toString(),
            patentScore: input.patentScore.toString(),
            documentScore: input.documentScore.toString(),
            innovationScore: input.innovationScore.toString(),
            teamAtmosphereScore: input.teamAtmosphereScore.toString(),
            recruitmentScore: input.recruitmentScore.toString(),
            praiseScore: input.praiseScore.toString(),
            plScore: input.plScore.toString(),
            totalScore: score.toString(),
            updatedAt: new Date(),
          })
          .where(eq(bonusDetails.assessmentId, input.assessmentId));
      } else {
        await db.insert(bonusDetails).values({
          id: uuidv4(),
          assessmentId: input.assessmentId,
          newPersonTrainingScore: input.newPersonTrainingScore.toString(),
          sharingScore: input.sharingScore.toString(),
          patentScore: input.patentScore.toString(),
          documentScore: input.documentScore.toString(),
          innovationScore: input.innovationScore.toString(),
          teamAtmosphereScore: input.teamAtmosphereScore.toString(),
          recruitmentScore: input.recruitmentScore.toString(),
          praiseScore: input.praiseScore.toString(),
          plScore: input.plScore.toString(),
          totalScore: score.toString(),
        });
      }

      // 更新主表中的绩效加分
      await db
        .update(performanceAssessments)
        .set({
          bonusScore: score.toString(),
          updatedAt: new Date(),
        })
        .where(eq(performanceAssessments.id, input.assessmentId));

      return { success: true, score };
    }),

  /**
   * 获取绩效加分详情
   */
  get: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const details = await db.query.bonusDetails.findFirst({
        where: eq(bonusDetails.assessmentId, input.assessmentId),
      });
      return details;
    }),
});

/**
 * 绩效减分路由
 */
const penaltyRouter = router({
  /**
   * 保存绩效减分详情
   */
  save: protectedProcedure
    .input(penaltyInput)
    .mutation(async ({ input, ctx }: any) => {
      const db = await getDb();

      // 计算分数
      const score = calculatePenaltyScore({
        technicalErrorAmount: input.technicalErrorAmount,
        lowErrorAmount: input.lowErrorAmount,
        softwareTestingAnomalyCount: input.softwareTestingAnomalyCount,
        jenkinsCompileErrorCount: input.jenkinsCompileErrorCount,
        codeReviewAnomalyCount: input.codeReviewAnomalyCount,
      });

      // 检查是否需要清零
      const isCleared = input.technicalErrorAmount >= 1000000 || input.lowErrorAmount >= 30000;

      // 查找或创建绩效减分详情记录
      const existing = await db.query.penaltyDetails.findFirst({
        where: eq(penaltyDetails.assessmentId, input.assessmentId),
      });

      if (existing) {
        await db
          .update(penaltyDetails)
          .set({
            technicalErrorAmount: input.technicalErrorAmount.toString(),
            lowErrorAmount: input.lowErrorAmount.toString(),
            softwareTestingAnomalyCount: input.softwareTestingAnomalyCount,
            softwareTestingAnomalyScore: (input.softwareTestingAnomalyCount * 4).toString(),
            jenkinsCompileErrorCount: input.jenkinsCompileErrorCount,
            jenkinsCompileErrorScore: (input.jenkinsCompileErrorCount * 1).toString(),
            codeReviewAnomalyCount: input.codeReviewAnomalyCount,
            totalScore: score.toString(),
            isCleared,
            updatedAt: new Date(),
          })
          .where(eq(penaltyDetails.assessmentId, input.assessmentId));
      } else {
        await db.insert(penaltyDetails).values({
          id: uuidv4(),
          assessmentId: input.assessmentId,
          technicalErrorAmount: input.technicalErrorAmount.toString(),
          lowErrorAmount: input.lowErrorAmount.toString(),
          softwareTestingAnomalyCount: input.softwareTestingAnomalyCount,
          softwareTestingAnomalyScore: (input.softwareTestingAnomalyCount * 4).toString(),
          jenkinsCompileErrorCount: input.jenkinsCompileErrorCount,
          jenkinsCompileErrorScore: (input.jenkinsCompileErrorCount * 1).toString(),
          codeReviewAnomalyCount: input.codeReviewAnomalyCount,
          totalScore: score.toString(),
          isCleared,
        });
      }

      // 更新主表中的绩效减分
      await db
        .update(performanceAssessments)
        .set({
          penaltyScore: isCleared ? '0' : score.toString(),
          updatedAt: new Date(),
        })
        .where(eq(performanceAssessments.id, input.assessmentId));

      return { success: true, score: isCleared ? 0 : score };
    }),

  /**
   * 获取绩效减分详情
   */
  get: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const details = await db.query.penaltyDetails.findFirst({
        where: eq(penaltyDetails.assessmentId, input.assessmentId),
      });
      return details;
    }),
});

/**
 * 总分计算路由
 */
const totalScoreRouter = router({
  /**
   * 计算并保存总分
   */
  calculate: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();

      // 获取评分记录
      const assessment = await db.query.performanceAssessments.findFirst({
        where: eq(performanceAssessments.id, input.assessmentId),
      });

      if (!assessment) {
        throw new Error('Assessment not found');
      }

      // 计算总分
      const totalScore = calculateTotalScore({
        dailyWorkScore: parseFloat(assessment.dailyWorkScore?.toString() || '0'),
        workQualityScore: parseFloat(assessment.workQualityScore?.toString() || '0'),
        personalGoalScore: parseFloat(assessment.personalGoalScore?.toString() || '0'),
        departmentReviewScore: parseFloat(assessment.departmentReviewScore?.toString() || '0'),
        bonusScore: parseFloat(assessment.bonusScore?.toString() || '0'),
        penaltyScore: parseFloat(assessment.penaltyScore?.toString() || '0'),
      });

      // 获取绩效等级
      const grade = getPerformanceGrade(totalScore);

      // 更新总分
      await db
        .update(performanceAssessments)
        .set({
          totalScore: totalScore.toString(),
          updatedAt: new Date(),
        })
        .where(eq(performanceAssessments.id, input.assessmentId));

      return { success: true, totalScore, grade };
    }),

  /**
   * 获取评分详情（包含所有维度）
   */
  getDetail: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();

      const assessment = await db.query.performanceAssessments.findFirst({
        where: eq(performanceAssessments.id, input.assessmentId),
        with: {
          employee: {
            with: {
              department: true,
            },
          },
          workQualityDetails: true,
          personalGoalDetails: true,
          departmentReviewDetails: true,
          bonusDetails: true,
          penaltyDetails: true,
        },
      });

      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const totalScore = parseFloat(assessment.totalScore?.toString() || '0');
      const grade = getPerformanceGrade(totalScore);

      return {
        assessment,
        totalScore,
        grade,
        dimensions: {
          dailyWork: parseFloat(assessment.dailyWorkScore?.toString() || '0'),
          workQuality: parseFloat(assessment.workQualityScore?.toString() || '0'),
          personalGoal: parseFloat(assessment.personalGoalScore?.toString() || '0'),
          departmentReview: parseFloat(assessment.departmentReviewScore?.toString() || '0'),
          bonus: parseFloat(assessment.bonusScore?.toString() || '0'),
          penalty: parseFloat(assessment.penaltyScore?.toString() || '0'),
        },
      };
    }),
});

export const performanceRouter = router({
  workQuality: workQualityRouter,
  personalGoal: personalGoalRouter,
  departmentReview: departmentReviewRouter,
  bonus: bonusRouter,
  penalty: penaltyRouter,
  totalScore: totalScoreRouter,
});
