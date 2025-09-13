import { parseAsInteger, parseAsString } from 'nuqs';
import { getSortingStateParser } from '@/components/data-table/lib/parser';
import type { UserType } from '@/core/type/user';

export const userTableSearchParamsSchemaNuqsClient = {
  page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
  perPage: parseAsInteger.withDefault(10).withOptions({ clearOnDefault: true }),
  sort: getSortingStateParser<UserType>()
    .withDefault([{ id: 'createdAt', desc: true }])
    .withOptions({ clearOnDefault: true }),
  from: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  to: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  name: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
};
