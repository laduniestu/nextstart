import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { authPlugins } from '@/lib/auth/auth-plugins';
import { rateLimitConfig } from '@/lib/auth/auth-rate-limit';
import { sessionConfig } from './auth-sessions';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
    },
  }),
  rateLimit: rateLimitConfig,
  session: sessionConfig,
  advanced: {
    useSecureCookies: true,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
  },
  plugins: authPlugins,
});
