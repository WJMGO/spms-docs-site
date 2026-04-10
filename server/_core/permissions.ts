/**
 * 后端权限检查中间件和工具函数
 */

import { TRPCError } from '@trpc/server';
import { Permission, Role, ROLE_PERMISSIONS, hasPermission } from '@shared/permissions';

// 用户权限上下文
export interface PermissionContext {
  userId: string;
  role: Role;
  permissions: Permission[];
  departmentId?: string;
}

// 权限检查错误
export class PermissionError extends TRPCError {
  constructor(message: string = 'Permission denied') {
    super({
      code: 'FORBIDDEN',
      message,
    });
  }
}

// 权限检查函数
export function requirePermission(ctx: PermissionContext, permission: Permission): void {
  if (!hasPermission(ctx.permissions, permission)) {
    throw new PermissionError(
      `User does not have permission: ${permission}`
    );
  }
}

export function requireAnyPermission(ctx: PermissionContext, permissions: Permission[]): void {
  const hasAny = permissions.some(p => hasPermission(ctx.permissions, p));
  if (!hasAny) {
    throw new PermissionError(
      `User does not have any of the required permissions: ${permissions.join(', ')}`
    );
  }
}

export function requireAllPermissions(ctx: PermissionContext, permissions: Permission[]): void {
  const hasAll = permissions.every(p => hasPermission(ctx.permissions, p));
  if (!hasAll) {
    throw new PermissionError(
      `User does not have all required permissions: ${permissions.join(', ')}`
    );
  }
}

// 检查用户是否是管理员
export function isAdmin(ctx: PermissionContext): boolean {
  return ctx.role === Role.ADMIN || ctx.role === Role.SUPER_ADMIN;
}

// 检查用户是否是超级管理员
export function isSuperAdmin(ctx: PermissionContext): boolean {
  return ctx.role === Role.SUPER_ADMIN;
}

// 检查用户是否是部门经理
export function isManager(ctx: PermissionContext): boolean {
  return ctx.role === Role.MANAGER;
}

// 获取用户的权限列表
export function getUserPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// 权限检查装饰器工厂函数
export function requirePermissionMiddleware(permission: Permission) {
  return (ctx: PermissionContext) => {
    requirePermission(ctx, permission);
  };
}

// 审计日志接口
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, any>;
  result: 'success' | 'failure';
  errorMessage?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// 审计日志记录函数
export function createAuditLog(
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  changes?: Record<string, any>,
  result: 'success' | 'failure' = 'success',
  errorMessage?: string
): Omit<AuditLog, 'id'> {
  return {
    userId,
    action,
    resource,
    resourceId,
    changes,
    result,
    errorMessage,
    timestamp: new Date(),
  };
}

// 权限检查结果
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

// 高级权限检查函数
export function checkPermissionAdvanced(
  ctx: PermissionContext,
  permission: Permission,
  additionalCheck?: (ctx: PermissionContext) => boolean
): PermissionCheckResult {
  // 首先检查基本权限
  if (!hasPermission(ctx.permissions, permission)) {
    return {
      allowed: false,
      reason: `User does not have permission: ${permission}`,
    };
  }

  // 如果提供了额外的检查函数，执行它
  if (additionalCheck && !additionalCheck(ctx)) {
    return {
      allowed: false,
      reason: 'Additional permission check failed',
    };
  }

  return { allowed: true };
}

// 权限检查缓存
const permissionCache = new Map<string, Permission[]>();

export function cacheUserPermissions(userId: string, permissions: Permission[]): void {
  permissionCache.set(userId, permissions);
}

export function getCachedPermissions(userId: string): Permission[] | undefined {
  return permissionCache.get(userId);
}

export function clearPermissionCache(userId?: string): void {
  if (userId) {
    permissionCache.delete(userId);
  } else {
    permissionCache.clear();
  }
}
