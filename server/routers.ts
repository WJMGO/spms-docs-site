import { router, publicProcedure, protectedProcedure } from './trpc';
import { assessmentRouter } from './routers/assessment';
import { reportsRouter } from './routers/reports';
import { z } from 'zod';
import { getDb, users, employees, departments, positions } from './db';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

/**
 * 健康检查路由
 */
const healthRouter = router({
  check: publicProcedure.query(async () => {
    return {
      status: 'ok',
      timestamp: new Date(),
    };
  }),
});

/**
 * 用户管理路由
 */
const usersRouter = router({
  /**
   * 获取当前用户信息
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const user = await db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });
    return user;
  }),

  /**
   * 获取用户列表（仅管理员）
   */
  list: protectedProcedure
    .input(
      z.object({
        skip: z.number().default(0),
        take: z.number().default(10),
        role: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const db = await getDb();
      const userList = await db.query.users.findMany({
        limit: input.take,
        offset: input.skip,
      });

      return userList;
    }),

  /**
   * 获取用户详情
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const user = await db.query.users.findFirst({
        where: eq(users.id, input.id),
      });
      return user;
    }),

  /**
   * 更新用户信息
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();

      // 只能更新自己的信息或管理员可以更新任何人
      if (ctx.user.id !== input.id && ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const result = await db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
          phone: input.phone,
          avatar: input.avatar,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.id));

      return { success: true };
    }),
});

/**
 * 员工管理路由
 */
const employeesRouter = router({
  /**
   * 获取员工列表
   */
  list: protectedProcedure
    .input(
      z.object({
        skip: z.number().default(0),
        take: z.number().default(10),
        departmentId: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      const employeeList = await db.query.employees.findMany({
        limit: input.take,
        offset: input.skip,
        with: {
          user: true,
          department: true,
          position: true,
        },
      });
      return employeeList;
    }),

  /**
   * 获取员工详情
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const employee = await db.query.employees.findFirst({
        where: eq(employees.id, input.id),
        with: {
          user: true,
          department: true,
          position: true,
          manager: true,
        },
      });
      return employee;
    }),

  /**
   * 创建员工
   */
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        employeeId: z.string(),
        name: z.string(),
        departmentId: z.string(),
        positionId: z.string(),
        managerId: z.string().optional(),
        joinDate: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'hr') {
        throw new Error('Unauthorized');
      }

      const db = await getDb();
      const result = await db.insert(employees).values({
        id: uuidv4(),
        ...input,
      });

      return { success: true };
    }),

  /**
   * 更新员工信息
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        departmentId: z.string().optional(),
        positionId: z.string().optional(),
        managerId: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'hr') {
        throw new Error('Unauthorized');
      }

      const db = await getDb();
      await db
        .update(employees)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(employees.id, input.id));

      return { success: true };
    }),
});

/**
 * 部门管理路由
 */
const departmentsRouter = router({
  /**
   * 获取部门列表
   */
  list: protectedProcedure.query(async () => {
    const db = await getDb();
    const deptList = await db.query.departments.findMany({
      with: {
        manager: true,
      },
    });
    return deptList;
  }),

  /**
   * 获取部门详情
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const dept = await db.query.departments.findFirst({
        where: eq(departments.id, input.id),
        with: {
          manager: true,
          employees: true,
        },
      });
      return dept;
    }),

  /**
   * 创建部门
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        managerId: z.string().optional(),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const db = await getDb();
      await db.insert(departments).values({
        id: uuidv4(),
        ...input,
      });

      return { success: true };
    }),
});

/**
 * 职位管理路由
 */
const positionsRouter = router({
  /**
   * 获取职位列表
   */
  list: protectedProcedure.query(async () => {
    const db = await getDb();
    const posList = await db.query.positions.findMany();
    return posList;
  }),

  /**
   * 创建职位
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        level: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const db = await getDb();
      await db.insert(positions).values({
        id: uuidv4(),
        ...input,
      });

      return { success: true };
    }),
});

/**
 * 主路由
 */
export const appRouter = router({
  health: healthRouter,
  users: usersRouter,
  employees: employeesRouter,
  departments: departmentsRouter,
  positions: positionsRouter,
  assessment: assessmentRouter,
  reports: reportsRouter,
});

export type AppRouter = typeof appRouter;
