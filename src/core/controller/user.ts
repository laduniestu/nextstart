import type { userTableSearchParamsTypeNuqs } from '@/app/admin/users/_table/validation.server';
import { getUserCountTableDB, getUserTableDB } from '../data-access/user';
import { createTransaction } from '../data-access/utils';

export async function getUserTableController(
  input: userTableSearchParamsTypeNuqs
) {
  try {
    const { data, total } = await createTransaction(async (trx) => {
      const data = await getUserTableDB(input, trx);
      const total = await getUserCountTableDB(input, trx);
      return { data, total };
    });

    const pageCount = Math.ceil(total / input.perPage);
    return { data, pageCount };
  } catch {
    return { data: [], pageCount: 0 };
  }
}
