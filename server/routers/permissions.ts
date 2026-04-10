/**
 * 权限管理 Router
 * 提供权限检查和管理相关的 API 端点
 */

import { router, publicProcedure, protectedProcedure } from '../trpc';
import { Permission, Role, ROLE_PERMISSIONS } from '@shared/permissions';
import { requirePermission } from '../_core/permissions';
import { z } from 'zod';

export const permissionsRouter = router({
  // 获取当前用户的权限列表
  getMyPermissions: protectedProcedure.query(({ ctx }: any) => {
    // 从上下文中获取用户的权限
    const permissions = ctx.user?.permissions || [];
    return {
      userId: ctx.user?.id,
      role: ctx.user?.role,
      permissions,
    };
  }),

  // 检查用户是否有特定权限
  hasPermission: protectedProcedure
    .input(z.object({
      permission: z.nativeEnum(Permission),
    }))
    .query(({ ctx, input }: any) => {
      const userPermissions = ctx.user?.permissions || [];
      return userPermissions.includes(input.permission);
    }),

  // 检查用户是否有任何权限
  hasAnyPermission: protectedProcedure
    .input(z.object({
      permissions: z.array(z.nativeEnum(Permission)),
    }))
    .query(({ ctx, input }: any) => {
      const userPermissions = ctx.user?.permissions || [];
      return input.permissions.some((p: Permission) => userPermissions.includes(p));
    }),

  // 检查用户是否有所有权限
  hasAllPermissions: protectedProcedure
    .input(z.object({
      permissions: z.array(z.nativeEnum(Permission)),
    }))
    .query(({ ctx, input }: any) => {
      const userPermissions = ctx.user?.permissions || [];
      return input.permissions.every((p: Permission) => userPermissions.includes(p));
    }),

  // 获取角色的权限列表
  getRolePermissions: protectedProcedure
    .input(z.object({
      role: z.nativeEnum(Role),
    }))
    .query(({ input }: any) => {
      return ROLE_PERMISSIONS[input.role as Role] || [];
    }),

  // 获取所有角色
  getAllRoles: protectedProcedure.query(() => {
    return Object.values(Role).map(role => ({
      value: role,
      label: getRoleLabel(role),
      permissions: ROLE_PERMISSIONS[role] || [],
    }));
  }),

  // 检查用户是否可以访问管理层仪表板
  canAccessDashboard: protectedProcedure.query(({ ctx }: any) => {
    const userPermissions = ctx.user?.permissions || [];
    return userPermissions.includes(Permission.DASHBOARD_VIEW);
  }),

  // 检查用户是否可以编辑分数
  canEditScore: protectedProcedure.query(({ ctx }: any) => {
    const userPermissions = ctx.user?.permissions || [];
    return userPermissions.includes(Permission.DASHBOARD_EDIT_SCORE);
  }),

  // 检查用户是否可以访问数据分析
  canAccessAnalytics: protectedProcedure.query(({ ctx }: any) => {
    const userPermissions = ctx.user?.permissions || [];
    return userPermissions.includes(Permission.ANALYTICS_VIEW);
  }),

  // 检查用户是否可以导出数据
  canExportData: protectedProcedure.query(({ ctx }: any) => {
    const userPermissions = ctx.user?.permissions || [];
    return userPermissions.includes(Permission.ANALYTICS_EXPORT);
  }),

  // 检查用户是否可以查看报表
  canViewReports: protectedProcedure.query(({ ctx }: any) => {
    const userPermissions = ctx.user?.permissions || [];
    return userPermissions.includes(Permission.REPORT_VIEW);
  }),

  // 检查用户是否是管理员
  isAdmin: protectedProcedure.query(({ ctx }: any) => {
    return ctx.user?.role === Role.ADMIN || ctx.user?.role === Role.SUPER_ADMIN;
  }),

  // 检查用户是否是超级管理员
  isSuperAdmin: protectedProcedure.query(({ ctx }: any) => {
    return ctx.user?.role === Role.SUPER_ADMIN;
  }),
});

// 角色标签映射
function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    [Role.SUPER_ADMIN]: '超级管理员',
    [Role.ADMIN]: '管理员',
    [Role.MANAGER]: '部门经理',
    [Role.ASSESSOR]: '评分员',
    [Role.EMPLOYEE]: '普通员工',
    [Role.VIEWER]: '查看者',
  };
  return labels[role] || role;
}
