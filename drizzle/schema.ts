import {
  mysqlTable,
  varchar,
  int,
  text,
  timestamp,
  decimal,
  boolean,
  json,
  unique,
  primaryKey,
  foreignKey,
  index,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ==================== 用户管理表 ====================

/**
 * 用户表
 * 存储系统用户信息，支持企业微信 OAuth 集成
 */
export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    openId: varchar('open_id', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 20 }),
    avatar: varchar('avatar', { length: 500 }),
    role: varchar('role', { length: 50 }).default('employee'),
    status: varchar('status', { length: 50 }).default('active'),
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    openIdIdx: index('idx_open_id').on(table.openId),
    roleIdx: index('idx_role').on(table.role),
    statusIdx: index('idx_status').on(table.status),
  })
);

// ==================== 员工管理表 ====================

/**
 * 部门表
 * 存储公司部门信息
 */
export const departments = mysqlTable(
  'departments',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    managerId: varchar('manager_id', { length: 36 }),
    parentId: varchar('parent_id', { length: 36 }),
    level: int('level').default(0),
    status: varchar('status', { length: 50 }).default('active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    managerIdFk: foreignKey({
      columns: [table.managerId],
      foreignColumns: [users.id],
    }),
    parentIdFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }),
    nameIdx: index('idx_dept_name').on(table.name),
    statusIdx: index('idx_dept_status').on(table.status),
  })
);

/**
 * 职位表
 * 存储职位信息
 */
export const positions = mysqlTable(
  'positions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    level: int('level').notNull(),
    status: varchar('status', { length: 50 }).default('active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    nameIdx: index('idx_position_name').on(table.name),
    levelIdx: index('idx_position_level').on(table.level),
  })
);

/**
 * 员工表
 * 存储员工信息，关联用户和部门
 */
export const employees = mysqlTable(
  'employees',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 }).notNull().unique(),
    employeeId: varchar('employee_id', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    departmentId: varchar('department_id', { length: 36 }).notNull(),
    positionId: varchar('position_id', { length: 36 }).notNull(),
    managerId: varchar('manager_id', { length: 36 }),
    joinDate: timestamp('join_date').notNull(),
    status: varchar('status', { length: 50 }).default('active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    departmentIdFk: foreignKey({
      columns: [table.departmentId],
      foreignColumns: [departments.id],
    }),
    positionIdFk: foreignKey({
      columns: [table.positionId],
      foreignColumns: [positions.id],
    }),
    managerIdFk: foreignKey({
      columns: [table.managerId],
      foreignColumns: [table.id],
    }),
    employeeIdIdx: index('idx_employee_id').on(table.employeeId),
    departmentIdIdx: index('idx_employee_dept').on(table.departmentId),
    statusIdx: index('idx_employee_status').on(table.status),
  })
);

// ==================== 绩效评分表 ====================

/**
 * 评分模板表
 * 存储绩效评分模板
 */
export const assessmentTemplates = mysqlTable(
  'assessment_templates',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    type: varchar('type', { length: 50 }).notNull(),
    totalScore: decimal('total_score', { precision: 5, scale: 2 }).default('150'),
    status: varchar('status', { length: 50 }).default('active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    typeIdx: index('idx_template_type').on(table.type),
    statusIdx: index('idx_template_status').on(table.status),
  })
);

/**
 * 评分项表
 * 存储评分模板中的评分项
 */
export const assessmentItems = mysqlTable(
  'assessment_items',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    templateId: varchar('template_id', { length: 36 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    weight: decimal('weight', { precision: 5, scale: 2 }).notNull(),
    minScore: decimal('min_score', { precision: 5, scale: 2 }).default('0'),
    maxScore: decimal('max_score', { precision: 5, scale: 2 }).default('100'),
    order: int('order').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    templateIdFk: foreignKey({
      columns: [table.templateId],
      foreignColumns: [assessmentTemplates.id],
    }),
    templateIdIdx: index('idx_item_template').on(table.templateId),
  })
);

/**
 * 绩效评分周期表
 * 存储评分周期信息
 */
export const assessmentPeriods = mysqlTable(
  'assessment_periods',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    status: varchar('status', { length: 50 }).default('draft'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    statusIdx: index('idx_period_status').on(table.status),
    dateIdx: index('idx_period_date').on(table.startDate, table.endDate),
  })
);

/**
 * 绩效评分表（主表）
 * 存储员工的绩效评分记录，包含 6 个维度的总分
 * 维度：日常工作(100分)、工作质量(15分)、个人目标(15分)、部门互评(5分)、绩效加分(15分)、绩效减分
 */
export const performanceAssessments = mysqlTable(
  'performance_assessments',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    employeeId: varchar('employee_id', { length: 36 }).notNull(),
    periodId: varchar('period_id', { length: 36 }).notNull(),
    templateId: varchar('template_id', { length: 36 }).notNull(),
    evaluatorId: varchar('evaluator_id', { length: 36 }).notNull(),
    status: varchar('status', { length: 50 }).default('draft'),
    
    // 6 个维度的分数
    dailyWorkScore: decimal('daily_work_score', { precision: 5, scale: 2 }).default('0'),
    workQualityScore: decimal('work_quality_score', { precision: 5, scale: 2 }).default('0'),
    personalGoalScore: decimal('personal_goal_score', { precision: 5, scale: 2 }).default('0'),
    departmentReviewScore: decimal('department_review_score', { precision: 5, scale: 2 }).default('0'),
    bonusScore: decimal('bonus_score', { precision: 5, scale: 2 }).default('0'),
    penaltyScore: decimal('penalty_score', { precision: 5, scale: 2 }).default('0'),
    
    // 总分和排名
    totalScore: decimal('total_score', { precision: 5, scale: 2 }),
    rank: int('rank'),
    
    // 备注和审批信息
    comments: text('comments'),
    submittedAt: timestamp('submitted_at'),
    approvedAt: timestamp('approved_at'),
    approvedBy: varchar('approved_by', { length: 36 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    employeeIdFk: foreignKey({
      columns: [table.employeeId],
      foreignColumns: [employees.id],
    }),
    periodIdFk: foreignKey({
      columns: [table.periodId],
      foreignColumns: [assessmentPeriods.id],
    }),
    templateIdFk: foreignKey({
      columns: [table.templateId],
      foreignColumns: [assessmentTemplates.id],
    }),
    evaluatorIdFk: foreignKey({
      columns: [table.evaluatorId],
      foreignColumns: [users.id],
    }),
    approvedByFk: foreignKey({
      columns: [table.approvedBy],
      foreignColumns: [users.id],
    }),
    employeeIdIdx: index('idx_assessment_employee').on(table.employeeId),
    periodIdIdx: index('idx_assessment_period').on(table.periodId),
    statusIdx: index('idx_assessment_status').on(table.status),
    uniqueAssessment: unique('uk_assessment_employee_period_template').on(
      table.employeeId,
      table.periodId,
      table.templateId
    ),
  })
);

/**
 * 工作质量详情表
 * 存储工作质量维度的详细评分
 */
export const workQualityDetails = mysqlTable(
  'work_quality_details',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    assessmentId: varchar('assessment_id', { length: 36 }).notNull().unique(),
    
    // 代码走查
    codeReviewCount: int('code_review_count').default(0),
    codeReviewScore: decimal('code_review_score', { precision: 5, scale: 2 }).default('0'),
    
    // 代码审核
    codeAuditCount: int('code_audit_count').default(0),
    codeAuditScore: decimal('code_audit_score', { precision: 5, scale: 2 }).default('0'),
    
    // Bug 打回率
    bugReturnRate: decimal('bug_return_rate', { precision: 5, scale: 2 }).default('0'),
    bugReturnRateScore: decimal('bug_return_rate_score', { precision: 5, scale: 2 }).default('0'),
    
    // 个人 Bug 有效打回
    personalBugCount: int('personal_bug_count').default(0),
    personalBugScore: decimal('personal_bug_score', { precision: 5, scale: 2 }).default('0'),
    
    // 超期问题部门达成
    overdueProblemsAchieved: boolean('overdue_problems_achieved').default(false),
    overdueProblemsScore: decimal('overdue_problems_score', { precision: 5, scale: 2 }).default('0'),
    
    // 设计评审
    designReviewCount: int('design_review_count').default(0),
    designReviewScore: decimal('design_review_score', { precision: 5, scale: 2 }).default('0'),
    
    // 总分
    totalScore: decimal('total_score', { precision: 5, scale: 2 }).default('0'),
    
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    assessmentIdFk: foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [performanceAssessments.id],
    }),
    assessmentIdIdx: index('idx_work_quality_assessment').on(table.assessmentId),
  })
);

/**
 * 个人目标详情表
 * 存储个人目标维度的详细评分
 */
export const personalGoalDetails = mysqlTable(
  'personal_goal_details',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    assessmentId: varchar('assessment_id', { length: 36 }).notNull().unique(),
    
    // 关键指标（0-7分）
    keyIndicatorScore: decimal('key_indicator_score', { precision: 5, scale: 2 }).default('0'),
    sprintCompletionRate: decimal('sprint_completion_rate', { precision: 5, scale: 2 }).default('0'),
    milestonAchievementRate: decimal('milestone_achievement_rate', { precision: 5, scale: 2 }).default('0'),
    
    // 关键事项（0-8分）
    keyMatterScore: decimal('key_matter_score', { precision: 5, scale: 2 }).default('0'),
    keyMatterDescription: text('key_matter_description'),
    keyMatterCompletionRate: decimal('key_matter_completion_rate', { precision: 5, scale: 2 }).default('0'),
    
    // 总分
    totalScore: decimal('total_score', { precision: 5, scale: 2 }).default('0'),
    
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    assessmentIdFk: foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [performanceAssessments.id],
    }),
    assessmentIdIdx: index('idx_personal_goal_assessment').on(table.assessmentId),
  })
);

/**
 * 部门互评详情表
 * 存储部门互评维度的详细评分
 */
export const departmentReviewDetails = mysqlTable(
  'department_review_details',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    assessmentId: varchar('assessment_id', { length: 36 }).notNull().unique(),
    
    // 团队交付（按时、质量等维度）
    teamDeliveryScore: decimal('team_delivery_score', { precision: 5, scale: 2 }).default('0'),
    
    // 团队协作（问题解答、技术协助等）
    teamCollaborationScore: decimal('team_collaboration_score', { precision: 5, scale: 2 }).default('0'),
    
    // 态度和反馈
    attitudeScore: decimal('attitude_score', { precision: 5, scale: 2 }).default('0'),
    
    // 排名百分比（前20%=5分，前50%=3分，后30%=1分）
    rankPercentile: decimal('rank_percentile', { precision: 5, scale: 2 }).default('0'),
    
    // 总分
    totalScore: decimal('total_score', { precision: 5, scale: 2 }).default('0'),
    
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    assessmentIdFk: foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [performanceAssessments.id],
    }),
    assessmentIdIdx: index('idx_department_review_assessment').on(table.assessmentId),
  })
);

/**
 * 绩效加分详情表
 * 存储绩效加分维度的详细评分
 */
export const bonusDetails = mysqlTable(
  'bonus_details',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    assessmentId: varchar('assessment_id', { length: 36 }).notNull().unique(),
    
    // 培养新人（0-3分）
    newPersonTrainingScore: decimal('new_person_training_score', { precision: 5, scale: 2 }).default('0'),
    newPersonCount: int('new_person_count').default(0),
    newPersonMonth: int('new_person_month').default(0),
    
    // 分享目标（0-4分）
    sharingScore: decimal('sharing_score', { precision: 5, scale: 2 }).default('0'),
    sharingCount: int('sharing_count').default(0),
    
    // 专利目标（0-6分）
    patentScore: decimal('patent_score', { precision: 5, scale: 2 }).default('0'),
    patentProposalPassed: int('patent_proposal_passed').default(0),
    patentFilingPassed: int('patent_filing_passed').default(0),
    
    // 文档目标（0-2分）
    documentScore: decimal('document_score', { precision: 5, scale: 2 }).default('0'),
    documentCount: int('document_count').default(0),
    
    // 微创新（0-3分）
    innovationScore: decimal('innovation_score', { precision: 5, scale: 2 }).default('0'),
    innovationDescription: text('innovation_description'),
    
    // 团队氛围（0-2分）
    teamAtmosphereScore: decimal('team_atmosphere_score', { precision: 5, scale: 2 }).default('0'),
    teamAtmosphereCount: int('team_atmosphere_count').default(0),
    
    // 招聘面试（0-3分）
    recruitmentScore: decimal('recruitment_score', { precision: 5, scale: 2 }).default('0'),
    recruitmentCount: int('recruitment_count').default(0),
    
    // 表扬（相关方）
    praiseScore: decimal('praise_score', { precision: 5, scale: 2 }).default('0'),
    informalPraiseCount: int('informal_praise_count').default(0),
    formalPraisePersonal: int('formal_praise_personal').default(0),
    formalPraiseTeam: int('formal_praise_team').default(0),
    
    // 其他（项目 PL）
    plScore: decimal('pl_score', { precision: 5, scale: 2 }).default('0'),
    plType: varchar('pl_type', { length: 50 }),
    
    // 总分
    totalScore: decimal('total_score', { precision: 5, scale: 2 }).default('0'),
    
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    assessmentIdFk: foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [performanceAssessments.id],
    }),
    assessmentIdIdx: index('idx_bonus_assessment').on(table.assessmentId),
  })
);

/**
 * 绩效减分详情表
 * 存储绩效减分维度的详细评分
 */
export const penaltyDetails = mysqlTable(
  'penalty_details',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    assessmentId: varchar('assessment_id', { length: 36 }).notNull().unique(),
    
    // 技术失误 / 管理失误
    technicalErrorAmount: decimal('technical_error_amount', { precision: 10, scale: 2 }).default('0'),
    technicalErrorSeverity: varchar('technical_error_severity', { length: 50 }),
    technicalErrorScore: decimal('technical_error_score', { precision: 5, scale: 2 }).default('0'),
    
    // 低级失误
    lowErrorAmount: decimal('low_error_amount', { precision: 10, scale: 2 }).default('0'),
    lowErrorSeverity: varchar('low_error_severity', { length: 50 }),
    lowErrorScore: decimal('low_error_score', { precision: 5, scale: 2 }).default('0'),
    
    // 质量异常
    softwareTestingAnomalyCount: int('software_testing_anomaly_count').default(0),
    softwareTestingAnomalyScore: decimal('software_testing_anomaly_score', { precision: 5, scale: 2 }).default('0'),
    
    jenkinsCompileErrorCount: int('jenkins_compile_error_count').default(0),
    jenkinsCompileErrorScore: decimal('jenkins_compile_error_score', { precision: 5, scale: 2 }).default('0'),
    
    codeReviewAnomalyCount: int('code_review_anomaly_count').default(0),
    codeReviewAnomalyScore: decimal('code_review_anomaly_score', { precision: 5, scale: 2 }).default('0'),
    
    // 总分
    totalScore: decimal('total_score', { precision: 5, scale: 2 }).default('0'),
    
    // 是否清零（当月清0）
    isCleared: boolean('is_cleared').default(false),
    
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    assessmentIdFk: foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [performanceAssessments.id],
    }),
    assessmentIdIdx: index('idx_penalty_assessment').on(table.assessmentId),
  })
);

/**
 * 评分分数表
 * 存储每个评分项的具体分数（用于兼容旧的评分项系统）
 */
export const assessmentScores = mysqlTable(
  'assessment_scores',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    assessmentId: varchar('assessment_id', { length: 36 }).notNull(),
    itemId: varchar('item_id', { length: 36 }).notNull(),
    score: decimal('score', { precision: 5, scale: 2 }).notNull(),
    remark: text('remark'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    assessmentIdFk: foreignKey({
      columns: [table.assessmentId],
      foreignColumns: [performanceAssessments.id],
    }),
    itemIdFk: foreignKey({
      columns: [table.itemId],
      foreignColumns: [assessmentItems.id],
    }),
    assessmentIdIdx: index('idx_score_assessment').on(table.assessmentId),
    itemIdIdx: index('idx_score_item').on(table.itemId),
  })
);

// ==================== 报表表 ====================

/**
 * 报表模板表
 * 存储报表模板
 */
export const reportTemplates = mysqlTable(
  'report_templates',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    type: varchar('type', { length: 50 }).notNull(),
    sections: json('sections'),
    status: varchar('status', { length: 50 }).default('active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    typeIdx: index('idx_report_template_type').on(table.type),
  })
);

/**
 * 报表表
 * 存储生成的报表
 */
export const reports = mysqlTable(
  'reports',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    templateId: varchar('template_id', { length: 36 }).notNull(),
    periodId: varchar('period_id', { length: 36 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    data: json('data'),
    status: varchar('status', { length: 50 }).default('draft'),
    exportFormat: varchar('export_format', { length: 50 }),
    exportedAt: timestamp('exported_at'),
    exportedBy: varchar('exported_by', { length: 36 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    templateIdFk: foreignKey({
      columns: [table.templateId],
      foreignColumns: [reportTemplates.id],
    }),
    periodIdFk: foreignKey({
      columns: [table.periodId],
      foreignColumns: [assessmentPeriods.id],
    }),
    exportedByFk: foreignKey({
      columns: [table.exportedBy],
      foreignColumns: [users.id],
    }),
    templateIdIdx: index('idx_report_template').on(table.templateId),
    periodIdIdx: index('idx_report_period').on(table.periodId),
    statusIdx: index('idx_report_status').on(table.status),
  })
);

// ==================== 权限管理表 ====================

/**
 * 角色表
 * 存储系统角色
 */
export const roles = mysqlTable(
  'roles',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description'),
    status: varchar('status', { length: 50 }).default('active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    nameIdx: index('idx_role_name').on(table.name),
  })
);

/**
 * 权限表
 * 存储系统权限
 */
export const permissions = mysqlTable(
  'permissions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description'),
    resource: varchar('resource', { length: 100 }).notNull(),
    action: varchar('action', { length: 100 }).notNull(),
    status: varchar('status', { length: 50 }).default('active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  (table) => ({
    nameIdx: index('idx_permission_name').on(table.name),
    resourceActionIdx: index('idx_permission_resource_action').on(table.resource, table.action),
  })
);

/**
 * 角色权限关系表
 * 存储角色和权限的关系
 */
export const rolePermissions = mysqlTable(
  'role_permissions',
  {
    roleId: varchar('role_id', { length: 36 }).notNull(),
    permissionId: varchar('permission_id', { length: 36 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    roleIdFk: foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.id],
    }),
    permissionIdFk: foreignKey({
      columns: [table.permissionId],
      foreignColumns: [permissions.id],
    }),
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
    roleIdIdx: index('idx_role_permission_role').on(table.roleId),
    permissionIdIdx: index('idx_role_permission_permission').on(table.permissionId),
  })
);

/**
 * 用户角色关系表
 * 存储用户和角色的关系
 */
export const userRoles = mysqlTable(
  'user_roles',
  {
    userId: varchar('user_id', { length: 36 }).notNull(),
    roleId: varchar('role_id', { length: 36 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    roleIdFk: foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.id],
    }),
    pk: primaryKey({ columns: [table.userId, table.roleId] }),
    userIdIdx: index('idx_user_role_user').on(table.userId),
    roleIdIdx: index('idx_user_role_role').on(table.roleId),
  })
);

// ==================== 审计日志表 ====================

/**
 * 操作审计日志表
 * 记录系统中的所有重要操作
 */
export const auditLogs = mysqlTable(
  'audit_logs',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 }).notNull(),
    action: varchar('action', { length: 100 }).notNull(),
    resource: varchar('resource', { length: 100 }).notNull(),
    resourceId: varchar('resource_id', { length: 36 }),
    oldValue: json('old_value'),
    newValue: json('new_value'),
    status: varchar('status', { length: 50 }).default('success'),
    errorMessage: text('error_message'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    userIdIdx: index('idx_audit_user').on(table.userId),
    actionIdx: index('idx_audit_action').on(table.action),
    resourceIdx: index('idx_audit_resource').on(table.resource),
    createdAtIdx: index('idx_audit_created').on(table.createdAt),
  })
);

// ==================== 数据关系定义 ====================

export const usersRelations = relations(users, ({ many, one }) => ({
  employees: many(employees),
  departments: many(departments),
  assessments: many(performanceAssessments),
  auditLogs: many(auditLogs),
  userRoles: many(userRoles),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  manager: one(users, {
    fields: [departments.managerId],
    references: [users.id],
  }),
  parent: one(departments, {
    fields: [departments.parentId],
    references: [departments.id],
  }),
  employees: many(employees),
}));

export const positionsRelations = relations(positions, ({ many }) => ({
  employees: many(employees),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  position: one(positions, {
    fields: [employees.positionId],
    references: [positions.id],
  }),
  manager: one(employees, {
    fields: [employees.managerId],
    references: [employees.id],
  }),
  assessments: many(performanceAssessments),
}));

export const assessmentTemplatesRelations = relations(assessmentTemplates, ({ many }) => ({
  items: many(assessmentItems),
  assessments: many(performanceAssessments),
}));

export const assessmentItemsRelations = relations(assessmentItems, ({ one, many }) => ({
  template: one(assessmentTemplates, {
    fields: [assessmentItems.templateId],
    references: [assessmentTemplates.id],
  }),
  scores: many(assessmentScores),
}));

export const assessmentPeriodsRelations = relations(assessmentPeriods, ({ many }) => ({
  assessments: many(performanceAssessments),
  reports: many(reports),
}));

export const performanceAssessmentsRelations = relations(performanceAssessments, ({ one, many }) => ({
  employee: one(employees, {
    fields: [performanceAssessments.employeeId],
    references: [employees.id],
  }),
  period: one(assessmentPeriods, {
    fields: [performanceAssessments.periodId],
    references: [assessmentPeriods.id],
  }),
  template: one(assessmentTemplates, {
    fields: [performanceAssessments.templateId],
    references: [assessmentTemplates.id],
  }),
  evaluator: one(users, {
    fields: [performanceAssessments.evaluatorId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [performanceAssessments.approvedBy],
    references: [users.id],
  }),
  scores: many(assessmentScores),
  workQualityDetails: one(workQualityDetails, {
    fields: [performanceAssessments.id],
    references: [workQualityDetails.assessmentId],
  }),
  personalGoalDetails: one(personalGoalDetails, {
    fields: [performanceAssessments.id],
    references: [personalGoalDetails.assessmentId],
  }),
  departmentReviewDetails: one(departmentReviewDetails, {
    fields: [performanceAssessments.id],
    references: [departmentReviewDetails.assessmentId],
  }),
  bonusDetails: one(bonusDetails, {
    fields: [performanceAssessments.id],
    references: [bonusDetails.assessmentId],
  }),
  penaltyDetails: one(penaltyDetails, {
    fields: [performanceAssessments.id],
    references: [penaltyDetails.assessmentId],
  }),
}));

export const workQualityDetailsRelations = relations(workQualityDetails, ({ one }) => ({
  assessment: one(performanceAssessments, {
    fields: [workQualityDetails.assessmentId],
    references: [performanceAssessments.id],
  }),
}));

export const personalGoalDetailsRelations = relations(personalGoalDetails, ({ one }) => ({
  assessment: one(performanceAssessments, {
    fields: [personalGoalDetails.assessmentId],
    references: [performanceAssessments.id],
  }),
}));

export const departmentReviewDetailsRelations = relations(departmentReviewDetails, ({ one }) => ({
  assessment: one(performanceAssessments, {
    fields: [departmentReviewDetails.assessmentId],
    references: [performanceAssessments.id],
  }),
}));

export const bonusDetailsRelations = relations(bonusDetails, ({ one }) => ({
  assessment: one(performanceAssessments, {
    fields: [bonusDetails.assessmentId],
    references: [performanceAssessments.id],
  }),
}));

export const penaltyDetailsRelations = relations(penaltyDetails, ({ one }) => ({
  assessment: one(performanceAssessments, {
    fields: [penaltyDetails.assessmentId],
    references: [performanceAssessments.id],
  }),
}));

export const assessmentScoresRelations = relations(assessmentScores, ({ one }) => ({
  assessment: one(performanceAssessments, {
    fields: [assessmentScores.assessmentId],
    references: [performanceAssessments.id],
  }),
  item: one(assessmentItems, {
    fields: [assessmentScores.itemId],
    references: [assessmentItems.id],
  }),
}));

export const reportTemplatesRelations = relations(reportTemplates, ({ many }) => ({
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  template: one(reportTemplates, {
    fields: [reports.templateId],
    references: [reportTemplates.id],
  }),
  period: one(assessmentPeriods, {
    fields: [reports.periodId],
    references: [assessmentPeriods.id],
  }),
  exportedBy: one(users, {
    fields: [reports.exportedBy],
    references: [users.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  permissions: many(rolePermissions),
  users: many(userRoles),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));


