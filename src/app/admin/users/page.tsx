import type { SearchParams } from 'nuqs';
import { orpcQuery } from '@/lib/orpc/client';
import { getQueryClient, HydrateClient } from '@/lib/tanstack/hydration';
import UserTable from './_table/user-table';
import { userTableSearchParamsSchemaNuqs } from './_table/validation.server';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
export default async function AdminUserPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const input = await userTableSearchParamsSchemaNuqs.parse(props.searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(orpcQuery.user.table.queryOptions({ input }));
  
  return (
    <HydrateClient client={queryClient}>
      <div className="flex flex-col">
        <p>Admin User Dashboard</p>
        <Suspense
        fallback={<DataTableSkeleton columnCount={6} toolbarCount={2} cellWidths={["3rem", "8rem", "20rem", "8rem", "8rem", "3rem"]} shrinkZero />}
        >
        <UserTable />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
