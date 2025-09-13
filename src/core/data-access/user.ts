/** biome-ignore-all lint/suspicious/useAwait: <explanation> */
import 'server-only';
import { and, asc, count, desc, gte, ilike, lte } from 'drizzle-orm';
import type { userTableSearchParamsTypeNuqs } from '@/app/admin/users/_table/validation.server';
import { db } from '@/db';
import { user } from '@/db/schema';

export async function getUsers() {
  const user = await db.query.user.findMany();
  return user;
}
export async function getUserTableDB(
  input: userTableSearchParamsTypeNuqs,
  trx = db
) {
  const offset = (input.page - 1) * input.perPage;
  const limit = input.perPage;
  const fromDate = input.from ? new Date(input.from) : undefined;
  const toDate = input.to ? new Date(input.to) : undefined;
  const where = and(
    input.name ? ilike(user.name, `%${input.name}%`) : undefined,
    fromDate ? gte(user.createdAt, fromDate) : undefined,
    toDate ? lte(user.createdAt, toDate) : undefined
  );
  const orderBy =
    input.sort.length > 0
      ? input.sort.map((item) =>
          item.desc ? desc(user[item.id]) : asc(user[item.id])
        )
      : [asc(user.createdAt)];

  return trx
    .select()
    .from(user)
    .limit(limit)
    .offset(offset)
    .where(where)
    .orderBy(...orderBy);
}

export async function getUserCountTableDB(
  input: userTableSearchParamsTypeNuqs,
  trx = db
) {
  const fromDate = input.from ? new Date(input.from) : undefined;
  const toDate = input.to ? new Date(input.to) : undefined;
  const where = and(
    input.name ? ilike(user.name, `%${input.name}%`) : undefined,
    fromDate ? gte(user.createdAt, fromDate) : undefined,
    toDate ? lte(user.createdAt, toDate) : undefined
  );
  return trx
    .select({
      count: count(),
    })
    .from(user)
    .where(where)
    .execute()
    .then((res) => res[0]?.count ?? 0);
}
