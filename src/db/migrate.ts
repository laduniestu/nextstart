import 'dotenv/config';

import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { db, pg } from '@/db';

async function main() {
  await migrate(db, { migrationsFolder: 'drizzle' });
  await pg.end();
}

main()
  .then(() => {
    console.info('✅ Migration successfully');
  })
  .catch((err) => {
    console.info('❌ Migration failed');
    console.error(err);
    process.exit(1);
  });
