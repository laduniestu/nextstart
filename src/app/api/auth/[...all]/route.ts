import { toNextJsHandler } from 'better-auth/next-js';

import { auth } from '@/lib/auth/auth-server';

export const { POST, GET } = toNextJsHandler(auth);
