import 'server-only';
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';
import z from 'zod';
import { getSortingStateParser } from '@/components/data-table/helper/parser';
import { UserRoleEnum, type UserType } from '@/db/types/user';

export const userTableSearchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<UserType>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
  name: parseAsString.withDefault(''),
  role: parseAsArrayOf(z.enum(UserRoleEnum)).withDefault([]),
  emailVerified: parseAsString.withDefault(''),
  createdAt: parseAsArrayOf(z.coerce.number()).withDefault([]),
});

export const schemaGetUsers = z.object({
  page: z.number().default(1),
  perPage: z.number().max(100).default(10),
  sort: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean(),
      })
    )
    .default([{ id: 'createdAt', desc: true }]),
  name: z.string().default(''),
  role: z.array(z.enum(UserRoleEnum)).default([]),
  emailVerified: z.enum(['verified', 'unverified', '']).optional(),
  createdAt: z.array(z.coerce.number()).default([]),
});

export type GetUserTableSchema = Awaited<
  ReturnType<typeof userTableSearchParamsCache.parse>
>;
