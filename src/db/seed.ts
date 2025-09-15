'use server';
import 'dotenv/config';

import { pg } from '@/db';
import { seedUser } from '@/db/seed/user';

async function main() {
  console.info('⏳ Running seed...');
  const start = Date.now();

  await seedUser({ count: 200 });

  const end = Date.now();
  console.info(`✅ Seed completed in ${end - start}ms`);
  await pg.end();
}

main().catch((err) => {
  console.info('❌ Seed failed');
  console.error(err);
  process.exit(1);
});
