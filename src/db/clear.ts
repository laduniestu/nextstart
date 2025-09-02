import 'dotenv/config';

import { sql } from 'drizzle-orm';

import { db, pg } from '@/db';

async function main() {
  const tablesSchema = db._.schema;
  if (!tablesSchema) throw new Error('Schema not loaded');
  // prettier-ignore
  await db.execute(sql.raw('DROP SCHEMA IF EXISTS "drizzle" CASCADE;'));
  await db.execute(sql.raw('DROP SCHEMA public CASCADE;'));
  await db.execute(sql.raw('CREATE SCHEMA public;'));
  await db.execute(sql.raw('GRANT ALL ON SCHEMA public TO postgres;'));
  await db.execute(sql.raw('GRANT ALL ON SCHEMA public TO public;'));
  await db.execute(
    sql.raw("COMMENT ON SCHEMA public IS 'standard public schema';")
  );

  await pg.end();
}

main()
  .then(() => {
    console.info('✅ Clearing database successfully');
  })
  .catch((err) => {
    console.info('❌ Clearing database failed');
    console.error(err);
    process.exit(1);
  });
