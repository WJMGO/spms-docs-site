import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema';

let db: any = null;

/**
 * 获取数据库连接
 * 使用单例模式确保只有一个连接池
 */
export async function getDb() {
  if (db) {
    return db;
  }

  const connection = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'spms',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  db = drizzle(connection, { schema, mode: 'default' });
  return db;
}

// 导出所有 schema
export * from '../drizzle/schema';
