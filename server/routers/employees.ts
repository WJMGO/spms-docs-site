import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { logAudit } from '../audit-logger';
import { parseFile } from '../file-parser';

export const employeeRouter = router({
  // 获取员工列表
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().max(100).default(20),
        search: z.string().optional(),
        departmentId: z.string().optional(),
        role: z.enum(['admin', 'user']).optional(),
        sortBy: z.enum(['name', 'email', 'department', 'createdAt']).default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ ctx }: any) => {
      // Mock 数据 - 后续替换为真实 API
      return {
        data: [
          {
            id: 'emp1',
            name: '张三',
            email: 'zhangsan@example.com',
            role: 'user',
            departmentId: 'dept1',
            createdAt: new Date('2026-01-01'),
            updatedAt: new Date('2026-01-01'),
          },
          {
            id: 'emp2',
            name: '李四',
            email: 'lisi@example.com',
            role: 'user',
            departmentId: 'dept1',
            createdAt: new Date('2026-01-02'),
            updatedAt: new Date('2026-01-02'),
          },
        ],
        total: 2,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      };
    }),

  // 获取单个员工详情
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }: any) => {
      return {
        id: input.id,
        name: '张三',
        email: 'zhangsan@example.com',
        role: 'user',
        departmentId: 'dept1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),

  // 创建员工
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        departmentId: z.string(),
        role: z.enum(['admin', 'user']).default('user'),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const newEmployee = {
        id: `user_${Date.now()}`,
        name: input.name,
        email: input.email,
        departmentId: input.departmentId,
        role: input.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 记录审计日志
      await logAudit({
        userId: ctx.user.id,
        userName: ctx.user.name || 'Unknown',
        action: 'create_employee',
        resource: 'employee',
        resourceId: newEmployee.id,
        changes: {
          name: input.name,
          email: input.email,
          departmentId: input.departmentId,
          role: input.role,
        },
        status: 'success',
      });

      return newEmployee;
    }),

  // 更新员工
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        departmentId: z.string().optional(),
        role: z.enum(['admin', 'user']).optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const { id, ...updateData } = input;

      const updateValues = {
        ...updateData,
        updatedAt: new Date(),
      };

      // 记录审计日志
      const changes: Record<string, any> = {};
      Object.keys(updateData).forEach((key) => {
        changes[key] = updateData[key as keyof typeof updateData];
      });

      if (Object.keys(changes).length > 0) {
        await logAudit({
          userId: ctx.user.id,
          userName: ctx.user.name || 'Unknown',
          action: 'update_employee',
          resource: 'employee',
          resourceId: id,
          changes,
          status: 'success',
        });
      }

      return { id, ...updateValues };
    }),

  // 删除员工
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }: any) => {
      // 记录审计日志
      await logAudit({
        userId: ctx.user.id,
        userName: ctx.user.name || 'Unknown',
        action: 'delete_employee',
        resource: 'employee',
        resourceId: input.id,
        changes: {
          id: input.id,
        },
        status: 'success',
      });

      return { success: true };
    }),

  // 解析上传的文件
  parseFile: protectedProcedure
    .input(
      z.object({
        fileContent: z.string(),
        filename: z.string(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const result = parseFile(input.fileContent, input.filename);

      // 记录审计日志
      await logAudit({
        userId: ctx.user.id,
        userName: ctx.user.name || 'Unknown',
        action: 'parse_employee_file',
        resource: 'employee',
        resourceId: 'batch',
        changes: {
          filename: input.filename,
          total: result.summary.total,
          valid: result.summary.valid,
          invalid: result.summary.invalid,
        },
        status: result.success ? 'success' : 'failure',
      });

      return result;
    }),

  // 批量导入员工
  importBatch: protectedProcedure
    .input(
      z.object({
        employees: z.array(
          z.object({
            name: z.string().min(1),
            email: z.string().email(),
            departmentId: z.string(),
            role: z.enum(['admin', 'user']).default('user'),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const results = {
        success: input.employees.length,
        failed: 0,
        errors: [] as Array<{ index: number; error: string }>,
      };

      // 记录审计日志
      await logAudit({
        userId: ctx.user.id,
        userName: ctx.user.name || 'Unknown',
        action: 'import_employees',
        resource: 'employee',
        resourceId: 'batch',
        changes: {
          total: input.employees.length,
          success: results.success,
          failed: results.failed,
        },
        status: results.failed === 0 ? 'success' : 'failure',
      });

      return results;
    }),

  // 导出员工列表
  export: protectedProcedure
    .input(
      z.object({
        format: z.enum(['csv', 'json']).default('csv'),
        departmentId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }: any) => {
      const employees = [
        {
          id: 'emp1',
          name: '张三',
          email: 'zhangsan@example.com',
          role: 'user',
          departmentId: 'dept1',
          createdAt: new Date(),
        },
      ];

      if (input.format === 'csv') {
        // 生成 CSV
        const headers = ['ID', '姓名', '邮箱', '部门', '角色', '创建时间'];
        const rows = employees.map((emp: any) => [
          emp.id,
          emp.name,
          emp.email,
          emp.departmentId,
          emp.role,
          emp.createdAt?.toISOString() || '',
        ]);

        const csv = [
          headers.join(','),
          ...rows.map((row: any[]) =>
            row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
          ),
        ].join('\n');

        // 记录审计日志
        await logAudit({
          userId: ctx.user.id,
          userName: ctx.user.name || 'Unknown',
          action: 'export_employees',
          resource: 'employee',
          resourceId: 'batch',
          changes: {
            format: 'csv',
            count: employees.length,
          },
          status: 'success',
        });

        return { data: csv, format: 'csv' };
      } else {
        // 记录审计日志
        await logAudit({
          userId: ctx.user.id,
          userName: ctx.user.name || 'Unknown',
          action: 'export_employees',
          resource: 'employee',
          resourceId: 'batch',
          changes: {
            format: 'json',
            count: employees.length,
          },
          status: 'success',
        });

        return { data: employees, format: 'json' };
      }
    }),

  // 获取部门列表
  getDepartments: protectedProcedure.query(async () => {
    return [
      { id: 'dept1', name: '平台设计一部' },
      { id: 'dept2', name: '平台设计二部' },
      { id: 'dept3', name: '基础架构部' },
    ];
  }),
});
