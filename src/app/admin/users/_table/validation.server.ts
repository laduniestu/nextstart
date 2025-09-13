import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';
import z from 'zod';
import { getSortingStateParser } from '@/components/data-table/lib/parser';
import type { UserType } from '@/core/type/user';
import { user } from '@/db/schema';

export const userKeys = Object.keys(user);

export type UserKeys = keyof typeof user;

export const userTableSearchParamsSchema = z.object({
  page: z.preprocess((val) => Number(val), z.number().int().min(1)).default(1),
  perPage: z
    .preprocess((val) => Number(val), z.number().int().min(1))
    .default(10),
  sort: z
    .array(
      z.object({
        id: z.enum(userKeys),
        desc: z.boolean(),
      })
    )
    .default([{ id: 'createdAt', desc: true }]),
  from: z.string().default(''),
  to: z.string().default(''),
  name: z.string().default(''),
});

export type userTableSearchParamsType = z.infer<
  typeof userTableSearchParamsSchema
>;

export const userTableSearchParamsSchemaNuqs = createSearchParamsCache({
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  perPage: parseAsInteger.withDefault(10).withOptions({ clearOnDefault: true }),
  sort: getSortingStateParser<UserType>()
    .withDefault([{ id: 'createdAt', desc: true }])
    .withOptions({ clearOnDefault: true }),
  from: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  to: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  name: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
});

export type userTableSearchParamsTypeNuqs = Awaited<
  ReturnType<typeof userTableSearchParamsSchemaNuqs.parse>
>;
