import 'dotenv/config';

import { seedUser } from '@/db/seed/user';
import { pg } from '@/db';

async function main() {
  console.info('⏳ Running seed...');
  const start = Date.now();

  await seedUser({ count: 10 });

  const end = Date.now();
  console.info(`✅ Seed completed in ${end - start}ms`);
  await pg.end();
}

main().catch((err) => {
  console.info('❌ Seed failed');
  console.error(err);
  process.exit(1);
});
