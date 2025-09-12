import { getUsers } from '@/data-access/user';
import { pub } from '@/lib/orpc';

export const getUsersProcedures = pub.handler(async () => {
  const data = await getUsers();
  return data;
});
