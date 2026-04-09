/**
 * 绩效评分计算模块
 * 根据真实的绩效表格规则计算各维度的分数
 */

/**
 * 工作质量评分计算
 * 满分 15 分
 */
export function calculateWorkQualityScore(details: {
  codeReviewCount: number;
  codeAuditCount: number;
  codeAuditErrorCount: number;
  bugReturnRate: number;
  personalBugCount: number;
  overdueProblemsAchieved: boolean;
  designReviewCount: number;
}): number {
  let score = 0;

  // 1. 代码走查：1-2分/场（组织者）+ 0.5分/场（参与者有效建议）
  // 假设 codeReviewCount 包含所有参与
  score += Math.min(details.codeReviewCount * 0.5, 4);

  // 2. 代码审核：0.5分/次（审核出异常加分，error 1分，其他0.5分，上限3分）
  let codeAuditScore = details.codeAuditCount * 0.5;
  if (details.codeAuditErrorCount > 0) {
    codeAuditScore += details.codeAuditErrorCount * 0.5;
  }
  // 额外加分
  if (details.codeAuditCount >= 50) {
    codeAuditScore += 2;
  } else if (details.codeAuditCount >= 30) {
    codeAuditScore += 1;
  }
  score += Math.min(codeAuditScore, 3);

  // 3. 部门 Bug 打回率（不区分是否有效）
  if (details.bugReturnRate <= 3) {
    score += 2;
  } else if (details.bugReturnRate <= 5) {
    score += 1;
  }

  // 4. 个人 Bug 有效打回：-1分/个
  score -= details.personalBugCount;

  // 5. 超期问题部门达成：3分/人
  if (details.overdueProblemsAchieved) {
    score += 3;
  }

  // 6. 设计评审：1-2分/场（组织者）+0.5分/场（参与者有效建议）
  score += Math.min(details.designReviewCount * 0.5, 4);

  // 上限 15 分
  return Math.min(Math.max(score, 0), 15);
}

/**
 * 个人目标评分计算
 * 满分 15 分
 */
export function calculatePersonalGoalScore(details: {
  sprintCompletionRate: number; // 90-95% = 1分，95-100% = 2分
  milestonAchievementRate: number; // 0-5分
  keyMatterScore: number; // 0-8分
  completionRate: number; // 0-100%
}): number {
  let score = 0;

  // 关键指标（0-7分）
  if (details.sprintCompletionRate >= 95) {
    score += 2;
  } else if (details.sprintCompletionRate >= 90) {
    score += 1;
  }
  score += Math.min(details.milestonAchievementRate, 5);

  // 关键事项（0-8分）
  // 最终得分 = 目标分 × 完成度
  const keyMatterFinalScore = details.keyMatterScore * (details.completionRate / 100);
  score += Math.min(keyMatterFinalScore, 8);

  // 上限 15 分
  return Math.min(Math.max(score, 0), 15);
}

/**
 * 部门互评评分计算
 * 满分 5 分
 */
export function calculateDepartmentReviewScore(details: {
  rankPercentile: number; // 0-100%
}): number {
  // 前 20% = 5分，前 50% = 3分，后 30% = 1分
  if (details.rankPercentile <= 20) {
    return 5;
  } else if (details.rankPercentile <= 50) {
    return 3;
  } else if (details.rankPercentile <= 70) {
    return 1;
  }
  return 0;
}

/**
 * 绩效加分计算
 * 满分 15 分
 */
export function calculateBonusScore(details: {
  newPersonTrainingScore: number; // 0-3分
  sharingScore: number; // 0-4分
  patentScore: number; // 0-6分
  documentScore: number; // 0-2分
  innovationScore: number; // 0-3分
  teamAtmosphereScore: number; // 0-2分
  recruitmentScore: number; // 0-3分
  praiseScore: number; // 0-8分
  plScore: number; // 0-5分
}): number {
  let score = 0;

  score += Math.min(details.newPersonTrainingScore, 3);
  score += Math.min(details.sharingScore, 4);
  score += Math.min(details.patentScore, 6);
  score += Math.min(details.documentScore, 2);
  score += Math.min(details.innovationScore, 3);
  score += Math.min(details.teamAtmosphereScore, 2);
  score += Math.min(details.recruitmentScore, 3);
  score += Math.min(details.praiseScore, 8);
  score += Math.min(details.plScore, 5);

  // 上限 15 分
  return Math.min(Math.max(score, 0), 15);
}

/**
 * 绩效减分计算
 */
export function calculatePenaltyScore(details: {
  technicalErrorAmount: number;
  lowErrorAmount: number;
  softwareTestingAnomalyCount: number;
  jenkinsCompileErrorCount: number;
  codeReviewAnomalyCount: number;
}): number {
  let score = 0;

  // 技术失误 / 管理失误
  if (details.technicalErrorAmount >= 1000000) {
    return 0; // 当月清 0
  } else if (details.technicalErrorAmount >= 100000) {
    score += 20;
  } else if (details.technicalErrorAmount >= 50000) {
    score += 15;
  } else if (details.technicalErrorAmount >= 10000) {
    score += 10;
  } else if (details.technicalErrorAmount > 0) {
    score += 5;
  }

  // 低级失误
  if (details.lowErrorAmount >= 30000) {
    return 0; // 当月清 0
  } else if (details.lowErrorAmount >= 5000) {
    score += 30;
  } else if (details.lowErrorAmount > 0) {
    score += 10;
  }

  // 质量异常
  score += details.softwareTestingAnomalyCount * 4;
  score += details.jenkinsCompileErrorCount * 1;
  score += details.codeReviewAnomalyCount * (score * 0.3); // 占失误分数的 30%

  return Math.max(score, 0);
}

/**
 * 总分计算
 * 满分 150 分
 */
export function calculateTotalScore(dimensions: {
  dailyWorkScore: number; // 100分
  workQualityScore: number; // 15分
  personalGoalScore: number; // 15分
  departmentReviewScore: number; // 5分
  bonusScore: number; // 15分
  penaltyScore: number; // 减分
}): number {
  let total = 0;

  total += Math.min(Math.max(dimensions.dailyWorkScore, 0), 100);
  total += Math.min(Math.max(dimensions.workQualityScore, 0), 15);
  total += Math.min(Math.max(dimensions.personalGoalScore, 0), 15);
  total += Math.min(Math.max(dimensions.departmentReviewScore, 0), 5);
  total += Math.min(Math.max(dimensions.bonusScore, 0), 15);
  total -= Math.max(dimensions.penaltyScore, 0);

  // 最小 0 分，最大 150 分
  return Math.min(Math.max(total, 0), 150);
}

/**
 * 绩效等级评定
 */
export function getPerformanceGrade(score: number): string {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 70) return '一般';
  if (score >= 60) return '及格';
  return '不及格';
}

/**
 * 计算员工在部门中的排名百分比
 */
export function calculateRankPercentile(
  employeeScore: number,
  allScores: number[]
): number {
  const betterScores = allScores.filter((s) => s > employeeScore).length;
  return (betterScores / allScores.length) * 100;
}
