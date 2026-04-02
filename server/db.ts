import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema';

let db: any = null;

// 创建一个全局 db 实例
const initDbInstance = async () => {
  if (!db) {
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
  }
  return db;
};

// 创建全局 db 实例
let globalDb: any = null;

export const getOrInitDb = async () => {
  if (!globalDb) {
    globalDb = await initDbInstance();
  }
  return globalDb;
};

/**
 * 获取数据库连接
 * 使用单例模式确保只有一个连接池
 */
export async function getDb() {
  return await getOrInitDb();
}

// 导出所有 schema
export * from '../drizzle/schema';

// 导出 db 实例以便使用
export { db };
