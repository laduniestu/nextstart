import { ORPCError, os } from '@orpc/server';
import type { SessionType } from '@/lib/auth/auth-server';
import { getServerSession } from '@/lib/auth/helpers/get-session';

export const requiredAuthMiddleware = os
  .$context<{ session?: SessionType }>()
  .middleware(async ({ context, next }) => {
    const session = context.session ?? (await getSession());

    if (!session) {
      throw new ORPCError('UNAUTHORIZED');
    }

    return next({
      context: { user: session.user },
    });
  });

async function getSession() {
  return await getServerSession();
}
