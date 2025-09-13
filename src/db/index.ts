import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import type * as schema from '@/db/schema';
import { env } from '@/env/server';

let db: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

if (env.NODE_ENV === 'production') {
  pg = postgres(env.DATABASE_URL);
  db = drizzle(pg);
} else {
  if (!(global as any).database!) {
    pg = postgres(env.DATABASE_URL);
    (global as any).db = drizzle(pg);
  }
  db = (global as any).db;
}

export { db, pg };
