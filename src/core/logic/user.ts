import 'server-only';
import { unstable_cache } from 'next/cache';
import type { GetUserTableSchema } from '@/app/admin/users/_table/validation';
import type { UserType } from '@/db/types/user';
import {
  selectRoleList,
  selectUsersCountTable,
  selectUsersTable,
} from '../data/user';
import { createTransaction } from '../data/utils';

export async function getUsersTable(input: GetUserTableSchema) {
  return await unstable_cache(
    async () => {
      try {
        const { data, total } = await createTransaction(async (trx) => {
          const data = await selectUsersTable(input, trx);
          const total = await selectUsersCountTable(input, trx);
          return { data, total };
        });

        const pageCount = Math.ceil(total / input.perPage);
        return { data, pageCount };
      } catch {
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    { revalidate: 300, tags: ['users'] }
  )();
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
