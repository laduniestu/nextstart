import { getUserTableProcedures } from '@/core/rpc/user';

export const router = {
  user: {
    table: getUserTableProcedures,
  },
};
