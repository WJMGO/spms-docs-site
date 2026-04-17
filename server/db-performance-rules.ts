/**
 * 绩效规则数据库查询辅助函数
 * 提供绩效规则相关的数据库操作
 */

import { db } from './db';
import {
  performanceRules,
  performanceRuleCriteria,
  performanceBonusRules,
  performancePenaltyRules,
  performanceGradeRules,
  performanceRuleVersions,
} from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';

// ==================== 绩效维度规则 ====================

/**
 * 获取所有活跃的绩效维度规则
 */
export async function getActivePerformanceRules() {
  return db
    .select()
    .from(performanceRules)
    .where(eq(performanceRules.isActive, true))
    .orderBy(performanceRules.weight);
}

/**
 * 获取单个绩效维度规则及其评分标准
 */
export async function getPerformanceRuleById(ruleId: string) {
  const rule = await db
    .select()
    .from(performanceRules)
    .where(eq(performanceRules.id, ruleId));

  if (!rule.length) return null;

  const criteria = await db
    .select()
    .from(performanceRuleCriteria)
    .where(eq(performanceRuleCriteria.ruleId, ruleId))
    .orderBy(performanceRuleCriteria.sortOrder);

  return {
    ...rule[0],
    criteria,
  };
}

/**
 * 创建新的绩效维度规则
 */
export async function createPerformanceRule(data: {
  title: string;
  weight: number;
  description?: string;
  createdBy: string;
}) {
  const id = crypto.randomUUID();
  await db.insert(performanceRules).values({
    id,
    title: data.title,
    weight: data.weight,
    description: data.description,
    createdBy: data.createdBy,
  });
  return id;
}

/**
 * 更新绩效维度规则
 */
export async function updatePerformanceRule(
  ruleId: string,
  data: {
    title?: string;
    weight?: number;
    description?: string;
    isActive?: boolean;
    updatedBy: string;
  }
) {
  await db
    .update(performanceRules)
    .set({
      title: data.title,
      weight: data.weight,
      description: data.description,
      isActive: data.isActive,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    })
    .where(eq(performanceRules.id, ruleId));
}

/**
 * 删除绩效维度规则
 */
export async function deletePerformanceRule(ruleId: string) {
  await db.delete(performanceRules).where(eq(performanceRules.id, ruleId));
}

// ==================== 评分等级标准 ====================

/**
 * 为规则添加评分等级标准
 */
export async function addRuleCriteria(data: {
  ruleId: string;
  level: string;
  scoreRange: string;
  description: string;
  examples?: string[];
  sortOrder?: number;
}) {
  const id = crypto.randomUUID();
  await db.insert(performanceRuleCriteria).values({
    id,
    ruleId: data.ruleId,
    level: data.level,
    scoreRange: data.scoreRange,
    description: data.description,
    examples: data.examples,
    sortOrder: data.sortOrder || 0,
  });
  return id;
}

/**
 * 更新评分等级标准
 */
export async function updateRuleCriteria(
  criteriaId: string,
  data: {
    level?: string;
    scoreRange?: string;
    description?: string;
    examples?: string[];
    sortOrder?: number;
  }
) {
  await db
    .update(performanceRuleCriteria)
    .set({
      level: data.level,
      scoreRange: data.scoreRange,
      description: data.description,
      examples: data.examples,
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(performanceRuleCriteria.id, criteriaId));
}

/**
 * 删除评分等级标准
 */
export async function deleteRuleCriteria(criteriaId: string) {
  await db
    .delete(performanceRuleCriteria)
    .where(eq(performanceRuleCriteria.id, criteriaId));
}

// ==================== 加分规则 ====================

/**
 * 获取所有活跃的加分规则
 */
export async function getActiveBonusRules() {
  return db
    .select()
    .from(performanceBonusRules)
    .where(eq(performanceBonusRules.isActive, true))
    .orderBy(performanceBonusRules.sortOrder);
}

/**
 * 创建加分规则
 */
export async function createBonusRule(data: {
  criteria: string;
  minPoints: number;
  maxPoints: number;
  description?: string;
  sortOrder?: number;
  createdBy: string;
}) {
  const id = crypto.randomUUID();
  await db.insert(performanceBonusRules).values({
    id,
    criteria: data.criteria,
    minPoints: data.minPoints,
    maxPoints: data.maxPoints,
    description: data.description,
    sortOrder: data.sortOrder || 0,
    createdBy: data.createdBy,
  });
  return id;
}

/**
 * 更新加分规则
 */
export async function updateBonusRule(
  ruleId: string,
  data: {
    criteria?: string;
    minPoints?: number;
    maxPoints?: number;
    description?: string;
    isActive?: boolean;
    sortOrder?: number;
    updatedBy: string;
  }
) {
  await db
    .update(performanceBonusRules)
    .set({
      criteria: data.criteria,
      minPoints: data.minPoints,
      maxPoints: data.maxPoints,
      description: data.description,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    })
    .where(eq(performanceBonusRules.id, ruleId));
}

/**
 * 删除加分规则
 */
export async function deleteBonusRule(ruleId: string) {
  await db.delete(performanceBonusRules).where(eq(performanceBonusRules.id, ruleId));
}

// ==================== 减分规则 ====================

/**
 * 获取所有活跃的减分规则
 */
export async function getActivePenaltyRules() {
  return db
    .select()
    .from(performancePenaltyRules)
    .where(eq(performancePenaltyRules.isActive, true))
    .orderBy(performancePenaltyRules.sortOrder);
}

/**
 * 创建减分规则
 */
export async function createPenaltyRule(data: {
  criteria: string;
  minPoints: number;
  maxPoints: number;
  description?: string;
  sortOrder?: number;
  createdBy: string;
}) {
  const id = crypto.randomUUID();
  await db.insert(performancePenaltyRules).values({
    id,
    criteria: data.criteria,
    minPoints: data.minPoints,
    maxPoints: data.maxPoints,
    description: data.description,
    sortOrder: data.sortOrder || 0,
    createdBy: data.createdBy,
  });
  return id;
}

/**
 * 更新减分规则
 */
export async function updatePenaltyRule(
  ruleId: string,
  data: {
    criteria?: string;
    minPoints?: number;
    maxPoints?: number;
    description?: string;
    isActive?: boolean;
    sortOrder?: number;
    updatedBy: string;
  }
) {
  await db
    .update(performancePenaltyRules)
    .set({
      criteria: data.criteria,
      minPoints: data.minPoints,
      maxPoints: data.maxPoints,
      description: data.description,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    })
    .where(eq(performancePenaltyRules.id, ruleId));
}

/**
 * 删除减分规则
 */
export async function deletePenaltyRule(ruleId: string) {
  await db.delete(performancePenaltyRules).where(eq(performancePenaltyRules.id, ruleId));
}

// ==================== 等级划分规则 ====================

/**
 * 获取所有等级划分规则
 */
export async function getGradeRules() {
  return db
    .select()
    .from(performanceGradeRules)
    .orderBy(performanceGradeRules.sortOrder);
}

/**
 * 创建等级划分规则
 */
export async function createGradeRule(data: {
  grade: string;
  minScore: number;
  maxScore: number;
  percentage?: number;
  benefits?: string;
  description?: string;
  sortOrder?: number;
  createdBy: string;
}) {
  const id = crypto.randomUUID();
  await db.insert(performanceGradeRules).values({
    id,
    grade: data.grade,
    minScore: data.minScore.toString(),
    maxScore: data.maxScore.toString(),
    percentage: data.percentage?.toString(),
    benefits: data.benefits,
    description: data.description,
    sortOrder: data.sortOrder || 0,
    createdBy: data.createdBy,
  });
  return id;
}

/**
 * 更新等级划分规则
 */
export async function updateGradeRule(
  ruleId: string,
  data: {
    grade?: string;
    minScore?: number;
    maxScore?: number;
    percentage?: number;
    benefits?: string;
    description?: string;
    sortOrder?: number;
    updatedBy: string;
  }
) {
  await db
    .update(performanceGradeRules)
    .set({
      grade: data.grade,
      minScore: data.minScore?.toString(),
      maxScore: data.maxScore?.toString(),
      percentage: data.percentage?.toString(),
      benefits: data.benefits,
      description: data.description,
      sortOrder: data.sortOrder,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    })
    .where(eq(performanceGradeRules.id, ruleId));
}

/**
 * 删除等级划分规则
 */
export async function deleteGradeRule(ruleId: string) {
  await db.delete(performanceGradeRules).where(eq(performanceGradeRules.id, ruleId));
}

// ==================== 规则版本管理 ====================

/**
 * 记录规则版本
 */
export async function recordRuleVersion(data: {
  ruleType: 'dimension' | 'bonus' | 'penalty' | 'grade';
  versionNumber: number;
  content: Record<string, any>;
  changeDescription?: string;
  createdBy: string;
}) {
  const id = crypto.randomUUID();
  await db.insert(performanceRuleVersions).values({
    id,
    ruleType: data.ruleType,
    versionNumber: data.versionNumber,
    content: data.content,
    changeDescription: data.changeDescription,
    createdBy: data.createdBy,
  });
  return id;
}

/**
 * 获取规则版本历史
 */
export async function getRuleVersionHistory(ruleType: string) {
  return db
    .select()
    .from(performanceRuleVersions)
    .where(eq(performanceRuleVersions.ruleType, ruleType))
    .orderBy(performanceRuleVersions.versionNumber);
}
