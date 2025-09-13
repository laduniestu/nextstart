import { userTableSearchParamsSchema } from '@/app/admin/users/_table/validation.server';
import { authed, pub } from '@/lib/orpc';
import { getUserTableController } from '../controller/user';

export const getUserTableProcedures = pub
  .input(userTableSearchParamsSchema)
  .handler(async ({ input, context }) => {
    const data = await getUserTableController(input);
    return data;
  });
