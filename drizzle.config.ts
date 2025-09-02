import { defineConfig } from 'drizzle-kit';
import { DATABASE_PREFIX } from '@/config';
import { env } from '@/env/server';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  out: './drizzle',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  tablesFilter: [`${DATABASE_PREFIX}_*`],
});
