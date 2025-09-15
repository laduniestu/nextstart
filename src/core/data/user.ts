'use server';
import 'server-only';
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lte,
} from 'drizzle-orm';
import type { GetUserTableSchema } from '@/app/admin/users/_table/validation';
import { db } from '@/db';
import { user } from '@/db/schema';
import type { UserType } from '@/db/types/user';
import type {
  DeleteUseresType,
  UpdateUsersRolesType,
} from '../validation/user';

export async function updateUsersRoles(data: UpdateUsersRolesType) {
  const res = await db
    .update(user)
    .set({ role: data.role })
    .where(inArray(user.id, data.id))
    .returning({ id: user.id });
  return res.length;
}

export async function deleteUsers(data: DeleteUseresType) {
  const res = await db
    .delete(user)
    .where(inArray(user.id, data))
    .returning({ id: user.id });
  return res.length;
}

export async function getUsersRoles() {
  return await db
    .select({
      role: user.role,
      count: count(),
    })
    .from(user)
    .groupBy(user.role)
    .having(gt(count(), 0))
    .then((res) =>
      res.reduce(
        (acc, { role, count }) => {
          acc[role] = count;
          return acc;
        },
        {} as Record<UserType['role'], number>
      )
    );
}
export async function getUsersEmailVerified() {
  return await db
    .select({
      emailVerified: user.emailVerified,
      count: count(),
    })
    .from(user)
    .groupBy(user.emailVerified)
    .having(gt(count(), 0))
    .then((res) =>
      res.reduce(
        (acc, { emailVerified, count }) => {
          acc[emailVerified ? 'verified' : 'unverified'] = count;
          return acc;
        },
        {} as Record<'verified' | 'unverified', number>
      )
    );
}

export async function getUsers(input: GetUserTableSchema) {
  const offset = (input.page - 1) * input.perPage;
  const where = and(
    input.name ? ilike(user.name, `%${input.name}%`) : undefined,
    input.emailVerified
      ? eq(user.emailVerified, input.emailVerified === 'verified')
      : undefined,
    input.role.length > 0 ? inArray(user.role, input.role) : undefined,
    input.createdAt.length > 0
      ? and(
          input.createdAt[0]
            ? gte(
                user.createdAt,
                (() => {
                  const date = new Date(input.createdAt[0]);
                  date.setHours(0, 0, 0, 0);
                  return date;
                })()
              )
            : undefined,
          input.createdAt[1]
            ? lte(
                user.createdAt,
                (() => {
                  const date = new Date(input.createdAt[1]);
                  date.setHours(23, 59, 59, 999);
                  return date;
                })()
              )
            : undefined
        )
      : undefined
  );

  const orderBy =
    input.sort.length > 0
      ? input.sort.map((item) =>
          item.desc ? desc(user[item.id]) : asc(user[item.id])
        )
      : [asc(user.createdAt)];

  const { data, total } = await db.transaction(async (tx) => {
    const data = await tx
      .select()
      .from(user)
      .limit(input.perPage)
      .offset(offset)
      .where(where)
      .orderBy(...orderBy);

    const total = await tx
      .select({
        count: count(),
      })
      .from(user)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);

    return {
      data,
      total,
    };
  });

  const pageCount = Math.ceil(total / input.perPage);
  return { data, pageCount };
}
