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
  createdAt: parseAsArrayOf(z.coerce.number()).withDefault([]),
});

export type GetUserTableSchema = Awaited<
  ReturnType<typeof userTableSearchParamsCache.parse>
>;
