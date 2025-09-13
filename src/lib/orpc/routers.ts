import { getUsersProcedures } from '@/core/rpc/user';

export const router = {
  user: {
    list: getUsersProcedures,
  },
};
