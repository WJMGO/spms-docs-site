import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

/**
 * 上下文类型定义
 */
export interface Context {
  user?: {
    id: string;
    openId: string;
    name: string;
    role: string;
  };
}

/**
 * 初始化 tRPC
 */
const t = initTRPC.context<Context>().create();

/**
 * 公开过程
 * 任何人都可以调用
 */
export const publicProcedure = t.procedure;

/**
 * 受保护的过程
 * 只有认证用户可以调用
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

/**
 * 管理员过程
 * 只有管理员可以调用
 */
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

/**
 * 路由器
 */
export const router = t.router;

/**
 * 中间件
 */
export const middleware = t.middleware;
