import { defineConfig } from 'drizzle-kit';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
});
