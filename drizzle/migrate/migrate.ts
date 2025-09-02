import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const pg = postgres(process.env.DATABASE_URL!);
const db = drizzle(pg);

async function main() {
  await migrate(db, { migrationsFolder: '..' });
  await pg.end();
}

main()
  .then(() => {
    console.info('✅ Migrate done!');
  })
  .catch((err) => {
    console.info('❌ Migration failed');
    console.error(err);
    process.exit(1);
  });
