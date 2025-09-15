import 'server-only';
import { unstable_cache } from 'next/cache';
import type { GetUserTableSchema } from '@/app/admin/users/_table/validation';
import type { UserType } from '@/db/types/user';
import { getUsers, getUsersRoles } from '../data/user';

export async function fnGetUsers(input: GetUserTableSchema) {
  return unstable_cache(
    async () => {
      try {
        return await getUsers(input);
      } catch {
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    { revalidate: 60 * 60, tags: ['users'] }
  )();
}

export async function fnGetUsersRoles() {
  return unstable_cache(
    async () => {
      try {
        return await getUsersRoles();
      } catch {
        return {} as Record<UserType['role'], number>;
      }
    },
    ['users-role-count'],
    { revalidate: 60 * 60, tags: ['users-role-count'] }
  )();
}
