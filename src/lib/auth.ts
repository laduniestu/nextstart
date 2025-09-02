import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendEmail } from "@/lib/mail";
import { render } from "jsx-email";
import { EmailVerificationTemplate } from "./mail/template/email-verification";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
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
    max: 20, // max requests in the window
    onLimit: (ctx: any) => {
      console.log("Rate limit triggered:", ctx);
    },
  },
  // account: {
  //   accountLinking: {
  //     enabled: true,
  //   },
  // },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const body = await render(
        EmailVerificationTemplate({ name: user.name, url })
      );
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        body,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  //   google: {
  //     prompt: 'select_account',
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //   },
  // },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    nextCookies(),
  ],
});
