import { os } from '@orpc/server';
import { requiredAuthMiddleware } from './middlewares/auth';

export const pub = os;

export const authed = pub.use(requiredAuthMiddleware);
