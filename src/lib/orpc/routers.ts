import { getUsersProcedures } from '@/data-usecase/user';

export const router = {
  user: {
    list: getUsersProcedures,
  },
};
