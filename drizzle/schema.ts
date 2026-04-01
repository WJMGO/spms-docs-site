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
    totalScore: decimal('total_score', { precision: 5, scale: 2 }).default('100'),
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
 * 绩效评分表
 * 存储员工的绩效评分记录
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
    totalScore: decimal('total_score', { precision: 5, scale: 2 }),
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
 * 评分分数表
 * 存储每个评分项的具体分数
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
