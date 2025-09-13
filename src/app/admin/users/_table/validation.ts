import 'server-only';
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';
import { getSortingStateParser } from '@/components/data-table/helper/parser';
import type { UserType } from '@/db/types/user';

export const userTableSearchParamsCache = createSearchParamsCache({
  // default filter
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<UserType>().withDefault([
    { id: 'createdAt', desc: true },
  ]),
  from: parseAsString.withDefault(''),
  to: parseAsString.withDefault(''),
  // database colums
  name: parseAsString.withDefault(''),
});

export type GetUserTableSchema = Awaited<
  ReturnType<typeof userTableSearchParamsCache.parse>
>;
