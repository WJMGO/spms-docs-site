/**
 * 前端权限检查 Hook
 */

import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from '@shared/permissions';

export interface UsePermissionResult {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canViewDashboard: () => boolean;
  canEditScore: () => boolean;
  canUpdateRank: () => boolean;
  canBatchUpdate: () => boolean;
  canPublish: () => boolean;
  canViewAnalytics: () => boolean;
  canExportData: () => boolean;
  canViewReports: () => boolean;
  canCreateReports: () => boolean;
  canViewAuditLogs: () => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isManager: () => boolean;
}

export function usePermission(userPermissions: Permission[] = [], userRole?: string): UsePermissionResult {
  return {
    // 基础权限检查
    hasPermission: (permission: Permission) => {
      return hasPermission(userPermissions, permission);
    },

    hasAnyPermission: (permissions: Permission[]) => {
      return hasAnyPermission(userPermissions, permissions);
    },

    hasAllPermissions: (permissions: Permission[]) => {
      return hasAllPermissions(userPermissions, permissions);
    },

    // 管理层仪表板权限
    canViewDashboard: () => {
      return hasPermission(userPermissions, Permission.DASHBOARD_VIEW);
    },

    canEditScore: () => {
      return hasPermission(userPermissions, Permission.DASHBOARD_EDIT_SCORE);
    },

    canUpdateRank: () => {
      return hasPermission(userPermissions, Permission.DASHBOARD_UPDATE_RANK);
    },

    canBatchUpdate: () => {
      return hasPermission(userPermissions, Permission.DASHBOARD_BATCH_UPDATE);
    },

    canPublish: () => {
      return hasPermission(userPermissions, Permission.DASHBOARD_PUBLISH);
    },

    // 数据分析权限
    canViewAnalytics: () => {
      return hasPermission(userPermissions, Permission.ANALYTICS_VIEW);
    },

    canExportData: () => {
      return hasPermission(userPermissions, Permission.ANALYTICS_EXPORT);
    },

    // 报表权限
    canViewReports: () => {
      return hasPermission(userPermissions, Permission.REPORT_VIEW);
    },

    canCreateReports: () => {
      return hasPermission(userPermissions, Permission.REPORT_CREATE);
    },

    // 审计日志权限
    canViewAuditLogs: () => {
      return hasPermission(userPermissions, Permission.AUDIT_LOG_VIEW);
    },

    // 角色检查
    isAdmin: () => {
      return userRole === 'admin' || userRole === 'super_admin';
    },

    isSuperAdmin: () => {
      return userRole === 'super_admin';
    },

    isManager: () => {
      return userRole === 'manager';
    },
  };
}
