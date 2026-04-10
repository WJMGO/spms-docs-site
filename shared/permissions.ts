/**
 * 权限系统架构定义
 * 定义系统中的所有角色、权限和权限关系
 */

// 系统角色定义
export enum Role {
  SUPER_ADMIN = 'super_admin',      // 超级管理员 - 拥有所有权限
  ADMIN = 'admin',                  // 管理员 - 拥有大部分权限
  MANAGER = 'manager',              // 部门经理 - 可以管理部门内的员工和评分
  ASSESSOR = 'assessor',            // 评分员 - 可以进行评分
  EMPLOYEE = 'employee',            // 普通员工 - 可以查看自己的评分
  VIEWER = 'viewer',                // 查看者 - 只读权限
}

// 权限定义
export enum Permission {
  // 用户管理权限
  USER_VIEW = 'user:view',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // 权限管理权限
  PERMISSION_VIEW = 'permission:view',
  PERMISSION_MANAGE = 'permission:manage',

  // 评分权限
  ASSESSMENT_VIEW = 'assessment:view',
  ASSESSMENT_CREATE = 'assessment:create',
  ASSESSMENT_UPDATE = 'assessment:update',
  ASSESSMENT_DELETE = 'assessment:delete',
  ASSESSMENT_SUBMIT = 'assessment:submit',
  ASSESSMENT_APPROVE = 'assessment:approve',
  ASSESSMENT_REJECT = 'assessment:reject',

  // 管理层仪表板权限
  DASHBOARD_VIEW = 'dashboard:view',
  DASHBOARD_EDIT_SCORE = 'dashboard:edit_score',
  DASHBOARD_UPDATE_RANK = 'dashboard:update_rank',
  DASHBOARD_BATCH_UPDATE = 'dashboard:batch_update',
  DASHBOARD_PUBLISH = 'dashboard:publish',

  // 数据分析权限
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_EXPORT = 'analytics:export',

  // 报表权限
  REPORT_VIEW = 'report:view',
  REPORT_CREATE = 'report:create',
  REPORT_EXPORT = 'report:export',

  // 审计日志权限
  AUDIT_LOG_VIEW = 'audit_log:view',
}

// 角色权限映射
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    // 超级管理员拥有所有权限
    ...Object.values(Permission),
  ],

  [Role.ADMIN]: [
    // 管理员权限
    Permission.USER_VIEW,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.PERMISSION_VIEW,
    Permission.PERMISSION_MANAGE,
    Permission.ASSESSMENT_VIEW,
    Permission.ASSESSMENT_CREATE,
    Permission.ASSESSMENT_UPDATE,
    Permission.ASSESSMENT_DELETE,
    Permission.ASSESSMENT_SUBMIT,
    Permission.ASSESSMENT_APPROVE,
    Permission.ASSESSMENT_REJECT,
    Permission.DASHBOARD_VIEW,
    Permission.DASHBOARD_EDIT_SCORE,
    Permission.DASHBOARD_UPDATE_RANK,
    Permission.DASHBOARD_BATCH_UPDATE,
    Permission.DASHBOARD_PUBLISH,
    Permission.ANALYTICS_VIEW,
    Permission.ANALYTICS_EXPORT,
    Permission.REPORT_VIEW,
    Permission.REPORT_CREATE,
    Permission.REPORT_EXPORT,
    Permission.AUDIT_LOG_VIEW,
  ],

  [Role.MANAGER]: [
    // 部门经理权限
    Permission.USER_VIEW,
    Permission.ASSESSMENT_VIEW,
    Permission.ASSESSMENT_CREATE,
    Permission.ASSESSMENT_UPDATE,
    Permission.ASSESSMENT_SUBMIT,
    Permission.ASSESSMENT_APPROVE,
    Permission.DASHBOARD_VIEW,
    Permission.DASHBOARD_EDIT_SCORE,
    Permission.DASHBOARD_UPDATE_RANK,
    Permission.ANALYTICS_VIEW,
    Permission.REPORT_VIEW,
    Permission.REPORT_EXPORT,
  ],

  [Role.ASSESSOR]: [
    // 评分员权限
    Permission.ASSESSMENT_VIEW,
    Permission.ASSESSMENT_CREATE,
    Permission.ASSESSMENT_UPDATE,
    Permission.ASSESSMENT_SUBMIT,
    Permission.ANALYTICS_VIEW,
    Permission.REPORT_VIEW,
  ],

  [Role.EMPLOYEE]: [
    // 普通员工权限
    Permission.ASSESSMENT_VIEW,
    Permission.ANALYTICS_VIEW,
  ],

  [Role.VIEWER]: [
    // 查看者权限（只读）
    Permission.ASSESSMENT_VIEW,
    Permission.ANALYTICS_VIEW,
    Permission.REPORT_VIEW,
  ],
};

// 权限检查工具函数
export function hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
}

export function hasAllPermissions(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
}

// 获取角色的权限列表
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// 权限检查结果
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

// 权限检查函数
export function checkPermission(
  userPermissions: Permission[],
  requiredPermission: Permission
): PermissionCheckResult {
  if (hasPermission(userPermissions, requiredPermission)) {
    return { allowed: true };
  }
  return {
    allowed: false,
    reason: `User does not have permission: ${requiredPermission}`,
  };
}
