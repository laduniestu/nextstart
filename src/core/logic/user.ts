import 'server-only';
import { unstable_cache } from 'next/cache';
import type { GetUserTableSchema } from '@/app/admin/users/_table/validation';
import type { UserType } from '@/db/types/user';
import { selectRoleList, selectUsersTable } from '../data/user';

export async function getUsersTable(input: GetUserTableSchema) {
  return await selectUsersTable(input);
}

export async function getUsersRoles() {
  return unstable_cache(
    async () => {
      try {
        return await selectRoleList();
      } catch {
        return {} as Record<UserType['role'], number>;
      }
    },
    ['users-role-count'],
    { revalidate: 300, tags: ['users-role-count'] }
  )();
}
