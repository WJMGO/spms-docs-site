/**
 * 权限守卫组件 - 根据权限显示/隐藏内容
 */

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Lock } from 'lucide-react';
import { Permission } from '@shared/permissions';

interface PermissionGuardProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  userPermissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showAlert?: boolean;
}

/**
 * 权限守卫组件 - 检查权限并显示/隐藏内容
 * 
 * @param permission - 单个权限（检查用户是否有该权限）
 * @param permissions - 权限数组（与 requireAll 配合使用）
 * @param requireAll - 是否需要所有权限（默认 false，表示只需要任意一个）
 * @param userPermissions - 用户的权限列表
 * @param children - 有权限时显示的内容
 * @param fallback - 无权限时显示的内容
 * @param showAlert - 是否显示权限不足的提示（默认 true）
 */
export function PermissionGuard({
  permission,
  permissions = [],
  requireAll = false,
  userPermissions,
  children,
  fallback,
  showAlert = true,
}: PermissionGuardProps) {
  let hasPermission = false;

  if (permission) {
    // 检查单个权限
    hasPermission = userPermissions.includes(permission);
  } else if (permissions.length > 0) {
    // 检查权限数组
    if (requireAll) {
      hasPermission = permissions.every(p => userPermissions.includes(p));
    } else {
      hasPermission = permissions.some(p => userPermissions.includes(p));
    }
  } else {
    // 没有指定权限检查，默认允许
    hasPermission = true;
  }

  if (hasPermission) {
    return <>{children}</>;
  }

  // 无权限时的处理
  if (fallback) {
    return <>{fallback}</>;
  }

  if (showAlert) {
    return (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertTitle>权限不足</AlertTitle>
        <AlertDescription>
          您没有权限访问此内容。如需帮助，请联系管理员。
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

/**
 * 权限按钮包装组件 - 根据权限启用/禁用按钮
 */
interface PermissionButtonProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  userPermissions: Permission[];
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
}

export function PermissionButton({
  permission,
  permissions = [],
  requireAll = false,
  userPermissions,
  children,
  disabled = false,
  title,
}: PermissionButtonProps) {
  let hasPermission = false;

  if (permission) {
    hasPermission = userPermissions.includes(permission);
  } else if (permissions.length > 0) {
    if (requireAll) {
      hasPermission = permissions.every(p => userPermissions.includes(p));
    } else {
      hasPermission = permissions.some(p => userPermissions.includes(p));
    }
  } else {
    hasPermission = true;
  }

  const isDisabled = disabled || !hasPermission;
  const tooltipText = !hasPermission ? '您没有权限执行此操作' : title;

  return (
    <div title={tooltipText} className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}>
      {React.cloneElement(children as React.ReactElement<any>, {
        disabled: isDisabled,
      })}
    </div>
  );
}

/**
 * 权限不足提示组件
 */
interface PermissionDeniedProps {
  message?: string;
  requiredPermission?: string;
}

export function PermissionDenied({
  message = '您没有权限访问此功能',
  requiredPermission,
}: PermissionDeniedProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>权限不足</AlertTitle>
      <AlertDescription>
        {message}
        {requiredPermission && ` (需要权限: ${requiredPermission})`}
      </AlertDescription>
    </Alert>
  );
}

/**
 * 权限检查工具函数
 */
export function hasPermission(userPermissions: Permission[], permission: Permission): boolean {
  return userPermissions.includes(permission);
}

export function hasAnyPermission(userPermissions: Permission[], permissions: Permission[]): boolean {
  return permissions.some(p => userPermissions.includes(p));
}

export function hasAllPermissions(userPermissions: Permission[], permissions: Permission[]): boolean {
  return permissions.every(p => userPermissions.includes(p));
}
