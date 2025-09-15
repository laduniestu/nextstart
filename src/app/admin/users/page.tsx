'use server';
import type { SearchParams } from 'next/dist/server/request/search-params';
import { Suspense } from 'react';
import { UsersTable } from '@/app/admin/users/_table/users-table';
import { userTableSearchParamsCache } from '@/app/admin/users/_table/validation';
import { Shell } from '@/components/custom/shell';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import {
  fnGetUsers,
  fnGetUsersRoles,
  fnUsersEmailVerified,
} from '@/core/function/user';
import CreateUserPage from './_form/create';

export default async function UsersPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const search = await userTableSearchParamsCache.parse(props.searchParams);
  const promises = Promise.all([
    fnGetUsers(search),
    fnGetUsersRoles(),
    fnUsersEmailVerified(),
  ]);

  return (
    <Shell className="gap-2 p-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-bold text-3xl">Users</h1>
        <CreateUserPage />
      </div>
      <Suspense
        fallback={
          <DataTableSkeleton
            cellWidths={['3rem', '8rem', '20rem', '8rem', '8rem', '3rem']}
            columnCount={6}
            shrinkZero
          />
        }
      >
        <UsersTable promises={promises} />
      </Suspense>
    </Shell>
  );
}
