import { nextCookies } from 'better-auth/next-js';
import { admin, emailOTP } from 'better-auth/plugins';
import { render } from 'jsx-email';
import { APP_NAME } from '@/config';
import { env } from '@/env/server';
import { sendEmail } from '@/lib/mail';
import { OtpVerificationTemplate } from '@/lib/mail/template/otp-verification';

export const authPlugins = [
  admin({
    defaultRole: 'user',
    adminRoles: ['admin'],
  }),
  emailOTP({
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
            subject: `OTP Code for ${APP_NAME}`,
            body,
          });
        }
      }
    },
    overrideDefaultEmailVerification: true,
  }),
  nextCookies(),
];
