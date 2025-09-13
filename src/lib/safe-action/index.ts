'use server';
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import { z } from 'zod';
import {
  getServerSessionAdminRedirect,
  getServerSessionRedirect,
} from '../auth/helpers/get-session';

class ActionError extends Error {}

const baseAction = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleServerError(e) {
    console.error('Action error:', e.message);
    if (e instanceof ActionError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next, clientInput, metadata }) => {
  const startTime = performance.now();
  const result = await next();
  const endTime = performance.now();
  console.log('Result ->', result);
  console.log('Client input ->', clientInput);
  console.log('Metadata ->', metadata);
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
