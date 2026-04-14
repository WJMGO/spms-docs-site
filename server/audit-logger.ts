/**
 * 审计日志服务模块
 * 提供审计日志的记录、查询和统计功能
 */

import { db } from './db';
import { auditLogs } from '../drizzle/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export type AuditAction = 
  | 'edit_score'
  | 'publish_assessment'
  | 'delete_assessment'
  | 'create_assessment'
  | 'update_period'
  | 'create_period'
  | 'delete_period'
  | 'assign_role'
  | 'revoke_role'
  | 'create_user'
  | 'update_user'
  | 'delete_user'
  | 'export_data'
  | 'import_data'
  | 'batch_update';

export type AuditResource = 
  | 'assessment'
  | 'period'
  | 'user'
  | 'role'
  | 'permission'
  | 'report'
  | 'department'
  | 'employee';

export interface AuditLogEntry {
  userId: string;
  userName: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId: string;
  resourceName?: string;
  changes?: Record<string, any>;
  oldValue?: any;
  newValue?: any;
  status: 'success' | 'failure';
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * 记录审计日志
 */
export async function logAudit(entry: AuditLogEntry): Promise<string> {
  try {
    const id = uuidv4();
    const now = new Date();

    // 插入审计日志
    await db.insert(auditLogs).values({
      id,
      userId: entry.userId,
      action: entry.action as any,
      resource: entry.resource as any,
      resourceId: entry.resourceId,
      oldValue: entry.oldValue ? JSON.stringify(entry.oldValue) : undefined,
      newValue: entry.newValue ? JSON.stringify(entry.newValue) : undefined,
      status: entry.status,
      errorMessage: entry.errorMessage,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      createdAt: now,
    });

    return id;
  } catch (error) {
    console.error('Failed to log audit:', error);
    throw error;
  }
}

/**
 * 查询审计日志
 */
export async function getAuditLogs(options: {
  userId?: string;
  action?: AuditAction;
  resource?: AuditResource;
  resourceId?: string;
  status?: 'success' | 'failure';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  try {
    const conditions: any[] = [];

    if (options.userId) {
      conditions.push(eq(auditLogs.userId, options.userId));
    }
    if (options.action) {
      conditions.push(eq(auditLogs.action, options.action as any));
    }
    if (options.resource) {
      conditions.push(eq(auditLogs.resource, options.resource as any));
    }
    if (options.resourceId) {
      conditions.push(eq(auditLogs.resourceId, options.resourceId));
    }
    if (options.status) {
      conditions.push(eq(auditLogs.status, options.status));
    }
    if (options.startDate) {
      conditions.push(gte(auditLogs.createdAt, options.startDate));
    }
    if (options.endDate) {
      conditions.push(lte(auditLogs.createdAt, options.endDate));
    }

    const query = db
      .select()
      .from(auditLogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(auditLogs.createdAt));

    if (options.limit) {
      query.limit(options.limit);
    }
    if (options.offset) {
      query.offset(options.offset);
    }

    return await query;
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    throw error;
  }
}

/**
 * 获取用户的操作历史
 */
export async function getUserAuditHistory(userId: string, limit = 100) {
  try {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, userId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('Failed to get user audit history:', error);
    throw error;
  }
}

/**
 * 获取资源的操作历史
 */
export async function getResourceAuditHistory(resourceId: string, limit = 100) {
  try {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.resourceId, resourceId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('Failed to get resource audit history:', error);
    throw error;
  }
}

/**
 * 删除旧的审计日志（数据保留策略）
 */
export async function deleteOldAuditLogs(daysToKeep = 90) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await db
      .delete(auditLogs)
      .where(lte(auditLogs.createdAt, cutoffDate));

    return result;
  } catch (error) {
    console.error('Failed to delete old audit logs:', error);
    throw error;
  }
}

/**
 * 获取审计日志统计
 */
export async function getAuditStats(options: {
  startDate?: Date;
  endDate?: Date;
  action?: AuditAction;
  resource?: AuditResource;
}) {
  try {
    // TODO: 实现统计查询（待实现）
    return [];
  } catch (error) {
    console.error('Failed to get audit stats:', error);
    throw error;
  }
}
