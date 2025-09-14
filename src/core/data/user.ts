'use server';
import 'server-only';
import {
  and,
  asc,
  count,
  desc,
  gt,
  gte,
  ilike,
  inArray,
  lte,
} from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import type { GetUserTableSchema } from '@/app/admin/users/_table/validation';
import { db } from '@/db';
import { user } from '@/db/schema';
import type { UserType } from '@/db/types/user';

export async function selectRoleList() {
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

export async function selectUsersTable(input: GetUserTableSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;
        const where = and(
          input.name ? ilike(user.name, `%${input.name}%`) : undefined,
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
      } catch (_err) {
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 1,
      tags: ['users'],
    }
  )();
}
