/**
 * 文件解析器模块
 * 支持 CSV 和 Excel 文件的解析
 */

import { parse } from 'csv-parse/sync';

export interface ParsedEmployee {
  name: string;
  email: string;
  departmentId: string;
  role: 'admin' | 'user';
  errors?: string[];
}

export interface ParseResult {
  success: boolean;
  data: ParsedEmployee[];
  errors: string[];
  warnings: string[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
}

/**
 * 解析 CSV 文件
 */
export function parseCSV(fileContent: string): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const data: ParsedEmployee[] = [];

  try {
    // 解析 CSV 内容
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    records.forEach((record: any, index: number) => {
      const rowNumber = index + 2; // 加 2 是因为第一行是标题，索引从 0 开始
      const employee = validateAndTransformRecord(record, rowNumber);

      if (employee.errors && employee.errors.length > 0) {
        errors.push(`第 ${rowNumber} 行: ${employee.errors.join(', ')}`);
      } else {
        data.push(employee);
      }
    });
  } catch (error) {
    errors.push(`CSV 文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }

  return {
    success: errors.length === 0,
    data: data.filter((emp) => !emp.errors || emp.errors.length === 0),
    errors,
    warnings,
    summary: {
      total: data.length + errors.length,
      valid: data.length,
      invalid: errors.length,
    },
  };
}

/**
 * 解析 Excel 文件（XLSX 格式）
 * 注：需要安装 xlsx 库
 */
export function parseExcel(buffer: Buffer): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const data: ParsedEmployee[] = [];

  try {
    // 动态导入 xlsx 库（如果已安装）
    const XLSX = require('xlsx');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const records = XLSX.utils.sheet_to_json(worksheet);

    records.forEach((record: any, index: number) => {
      const rowNumber = index + 2;
      const employee = validateAndTransformRecord(record, rowNumber);

      if (employee.errors && employee.errors.length > 0) {
        errors.push(`第 ${rowNumber} 行: ${employee.errors.join(', ')}`);
      } else {
        data.push(employee);
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      errors.push('不支持 Excel 文件解析，请使用 CSV 格式');
    } else {
      errors.push(`Excel 文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  return {
    success: errors.length === 0,
    data: data.filter((emp) => !emp.errors || emp.errors.length === 0),
    errors,
    warnings,
    summary: {
      total: data.length + errors.length,
      valid: data.length,
      invalid: errors.length,
    },
  };
}

/**
 * 验证和转换单条记录
 */
function validateAndTransformRecord(record: any, rowNumber: number): ParsedEmployee {
  const errors: string[] = [];

  // 验证姓名
  const name = (record.name || record.姓名 || record.Name || '').trim();
  if (!name) {
    errors.push('姓名不能为空');
  }

  // 验证邮箱
  const email = (record.email || record.邮箱 || record.Email || '').trim();
  if (!email) {
    errors.push('邮箱不能为空');
  } else if (!isValidEmail(email)) {
    errors.push('邮箱格式不正确');
  }

  // 验证部门
  const departmentId = (record.departmentId || record.部门 || record.Department || '').trim();
  if (!departmentId) {
    errors.push('部门不能为空');
  }

  // 验证角色（可选，默认为 'user'）
  let role: 'admin' | 'user' = 'user';
  const roleStr = (record.role || record.角色 || record.Role || 'user').trim().toLowerCase();
  if (roleStr === 'admin' || roleStr === '管理员') {
    role = 'admin';
  } else if (roleStr === 'user' || roleStr === '普通员工' || roleStr === '') {
    role = 'user';
  } else {
    errors.push(`角色 "${roleStr}" 不合法，应为 "admin" 或 "user"`);
  }

  return {
    name,
    email,
    departmentId,
    role,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * 验证邮箱格式
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 根据文件类型选择合适的解析器
 */
export function parseFile(fileContent: string | Buffer, filename: string): ParseResult {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'csv') {
    const content = typeof fileContent === 'string' ? fileContent : fileContent.toString('utf-8');
    return parseCSV(content);
  } else if (ext === 'xlsx' || ext === 'xls') {
    const buffer = typeof fileContent === 'string' ? Buffer.from(fileContent) : fileContent;
    return parseExcel(buffer);
  } else {
    return {
      success: false,
      data: [],
      errors: [`不支持的文件格式: ${ext}，请使用 CSV 或 Excel 文件`],
      warnings: [],
      summary: {
        total: 0,
        valid: 0,
        invalid: 0,
      },
    };
  }
}
