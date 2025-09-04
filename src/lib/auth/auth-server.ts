import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin, emailOTP } from 'better-auth/plugins';
import { render } from 'jsx-email';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { env } from '@/env/server';
import { sendEmail } from '@/lib/mail';
import { OtpVerificationTemplate } from '../mail/template/otp-verification';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
    },
  }),
  session: {
    expiresIn: 60 * 60 * 24, // 1 day
    updateAge: 60 * 60, // 1 hour (every 1 hour the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  advanced: {
    useSecureCookies: true,
  },
  rateLimit: {
    enabled: true,
    window: 10, // time window in seconds
    max: 1, // max requests in the window
    customRules: {
      '/auth/login': {
        window: 10,
        max: 3,
      },
      '/auth/verify-email': (request) => {
        // custom function to return rate limit window and max
        console.log(request);
        return {
          window: 10,
          max: 3,
        };
      },
    },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    onLimit: (ctx: any) => {
      console.log('Rate limit triggered:', ctx);
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
  },
  plugins: [
    admin({
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
    emailOTP({
      // biome-ignore lint/suspicious/useAwait: <explanation>
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'email-verification') {
          if (env.NODE_ENV === 'development') {
            console.log(`OTP Code : ${otp}`);
          } else {
            const body = await render(
              OtpVerificationTemplate({ name: email, otp })
            );
            await sendEmail({
              to: email,
              subject: 'OTP Code',
              body,
            });
          }
        }
      },
      otpLength: 6,
      expiresIn: 60 * 10,
      sendVerificationOnSignUp: true,
    }),
    nextCookies(),
  ],
});
