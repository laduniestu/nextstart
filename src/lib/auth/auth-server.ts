import 'server-only';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { render } from 'jsx-email';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { env } from '@/env/server';
import { authPlugins } from '@/lib/auth/auth-plugins';
import { rateLimitConfig } from '@/lib/auth/auth-rate-limit';
import { sendEmail } from '@/lib/mail';
import { ResetPasswordTemplate } from '../mail/template/reset-password';
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
    ipAddress: {
      ipAddressHeaders: ['cf-connecting-ip', 'x-forwarded-for'],
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour,
    sendResetPassword: async ({ user, url }) => {
      if (env.NODE_ENV === 'development') {
        console.log(`URL Reset : ${url}`);
      } else {
        const body = await render(
          ResetPasswordTemplate({ name: user.name, url })
        );
        await sendEmail({
          to: user.email,
          subject: 'Reset your password',
          body,
        });
      }
    },
  },
  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    otpLength: 6,
    expiresIn: 60 * 5,
    autoSignInAfterVerification: true,
  },
  trustedOrigins: ['https://labs.duni.work', env.BETTER_AUTH_URL],
  plugins: authPlugins,
});

export type SessionType = typeof auth.$Infer.Session;
