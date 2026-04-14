/**
 * 审计日志 API 路由
 */

import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getAuditLogs, getUserAuditHistory, getResourceAuditHistory } from '../audit-logger';
import { v4 as uuidv4 } from 'uuid';

export const auditRouter = router({
  /**
   * 获取审计日志列表
   */
  getLogs: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        action: z.string().optional(),
        resource: z.string().optional(),
        resourceId: z.string().optional(),
        status: z.enum(['success', 'failure']).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        limit: z.number().int().positive().default(50),
        offset: z.number().int().nonnegative().default(0),
      })
    )
    .query(async ({ input, ctx }: any) => {
      // 权限检查：只有管理员和审计员可以查看审计日志
      if (!ctx.user || (ctx.user.role !== 'admin' && ctx.user.role !== 'auditor')) {
        throw new Error('Permission denied: Only admins and auditors can view audit logs');
      }

      try {
        const logs = await getAuditLogs({
          userId: input.userId,
          action: input.action as any,
          resource: input.resource as any,
          resourceId: input.resourceId,
          status: input.status,
          startDate: input.startDate,
          endDate: input.endDate,
          limit: input.limit,
          offset: input.offset,
        });

        return {
          success: true,
          data: logs,
          total: logs.length,
        };
      } catch (error) {
        console.error('Failed to get audit logs:', error);
        throw new Error('Failed to get audit logs');
      }
    }),

  /**
   * 获取用户的操作历史
   */
  getUserHistory: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().int().positive().default(100),
      })
    )
    .query(async ({ input, ctx }: any) => {
      // 权限检查：用户可以查看自己的操作历史，管理员可以查看任何人的
      if (ctx.user?.id !== input.userId && ctx.user?.role !== 'admin') {
        throw new Error('Permission denied: You can only view your own audit history');
      }

      try {
        const history = await getUserAuditHistory(input.userId, input.limit);

        return {
          success: true,
          data: history,
          total: history.length,
        };
      } catch (error) {
        console.error('Failed to get user audit history:', error);
        throw new Error('Failed to get user audit history');
      }
    }),

  /**
   * 获取资源的操作历史
   */
  getResourceHistory: protectedProcedure
    .input(
      z.object({
        resourceId: z.string(),
        limit: z.number().int().positive().default(100),
      })
    )
    .query(async ({ input, ctx }: any) => {
      // 权限检查：只有管理员可以查看资源的操作历史
      if (!ctx.user || ctx.user.role !== 'admin') {
        throw new Error('Permission denied: Only admins can view resource audit history');
      }

      try {
        const history = await getResourceAuditHistory(input.resourceId, input.limit);

        return {
          success: true,
          data: history,
          total: history.length,
        };
      } catch (error) {
        console.error('Failed to get resource audit history:', error);
        throw new Error('Failed to get resource audit history');
      }
    }),

  /**
   * 导出审计日志
   */
  export: protectedProcedure
    .input(
      z.object({
        format: z.enum(['csv', 'json', 'excel']).default('csv'),
        userId: z.string().optional(),
        action: z.string().optional(),
        resource: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      // 权限检查：只有管理员可以导出审计日志
      if (!ctx.user || ctx.user.role !== 'admin') {
        throw new Error('Permission denied: Only admins can export audit logs');
      }

      try {
        const logs = await getAuditLogs({
          userId: input.userId,
          action: input.action as any,
          resource: input.resource as any,
          startDate: input.startDate,
          endDate: input.endDate,
          limit: 10000, // 导出最多 10000 条记录
        });

        // TODO: 实现导出逻辑（CSV、JSON、Excel）
        return {
          success: true,
          message: 'Export functionality will be implemented',
          data: logs,
        };
      } catch (error) {
        console.error('Failed to export audit logs:', error);
        throw new Error('Failed to export audit logs');
      }
    }),

  /**
   * 获取审计日志统计
   */
  getStats: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        action: z.string().optional(),
        resource: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }: any) => {
      // 权限检查：只有管理员可以查看审计统计
      if (!ctx.user || ctx.user.role !== 'admin') {
        throw new Error('Permission denied: Only admins can view audit stats');
      }

      try {
        // TODO: 实现统计查询
        return {
          success: true,
          data: {
            totalLogs: 0,
            successCount: 0,
            failureCount: 0,
            byAction: {},
            byResource: {},
          },
        };
      } catch (error) {
        console.error('Failed to get audit stats:', error);
        throw new Error('Failed to get audit stats');
      }
    }),
});
