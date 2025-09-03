import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '@/db/schema';
import { env } from '@/env/server';

let db: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

if (env.NODE_ENV === 'production') {
  pg = postgres(env.DATABASE_URL);
  db = drizzle(pg, { schema });
} else {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  if (!(global as any).database!) {
    pg = postgres(env.DATABASE_URL);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (global as any).db = drizzle(pg, { schema });
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  db = (global as any).db;
}

export { db, pg };
