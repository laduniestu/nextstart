import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']),
    DATABASE_URL: z.url(),
    PLUNK_API_KEY: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),
    DEFAULT_ADMIN_EMAIL: z.string().min(1).optional(),
    DEFAULT_ADMIN_PASSWORD: z.string().min(1).optional(),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
