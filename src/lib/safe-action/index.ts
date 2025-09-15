import 'server-only';
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import {
  getServerSessionAdminRedirect,
  getServerSessionRedirect,
} from '../auth/helpers/get-session';

class ActionError extends Error {}

export const baseAction = createSafeActionClient({
  handleServerError(e) {
    console.error('Action error:', e.message);
    if (e instanceof ActionError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next }) => {
  const startTime = performance.now();
  const result = await next();
  const endTime = performance.now();
  console.log('Action execution took', endTime - startTime, 'ms');
  return result;
});

export const userAction = baseAction.use(async ({ next }) => {
  const { user } = await getServerSessionRedirect();
  return next({ ctx: { user } });
});

export const adminAction = baseAction.use(async ({ next }) => {
  const { user } = await getServerSessionAdminRedirect();
  return next({ ctx: { user } });
});
