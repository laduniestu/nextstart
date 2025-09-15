import { env } from '@/env/server';
import { auth } from '@/lib/auth/auth-server';

export async function seedUser(input: { count: number }) {
  try {
    console.info('👤 Creating Admin Account');
    await auth.api.createUser({
      body: {
        email: env.DEFAULT_ADMIN_EMAIL ?? 'admin@example.com',
        password: env.DEFAULT_ADMIN_PASSWORD ?? 'password',
        name: 'Admin',
        role: 'admin',
      },
    });
  } catch (err) {
    console.info('❌ Creating Admin Error');
    console.error(err);
  }
  const count = input.count ?? 100;
  console.info(`👤 Start inserting ${count} user`);
  try {
    for (let i = 0; i < count; i++) {
      await auth.api.createUser({
        body: {
          email: `usersample${i + 1}@dun.gg`,
          password: 'password123',
          name: `User ${i + 1}`,
          role: 'user',
        },
      });
      console.log(`👤 ${i + 1} user created ✓`);
    }
  } catch (err) {
    console.info('❌ Insert User Error');
    console.error(err);
  }
}
