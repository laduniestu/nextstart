import type { SearchParams } from 'nuqs';
import { orpcQuery } from '@/lib/orpc/client';
import { getQueryClient, HydrateClient } from '@/lib/tanstack/hydration';
import UserTable from './_table/user-table';
import { userTableSearchParamsSchemaNuqs } from './_table/validation.server';
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
        <UserTable />
      </div>
    </HydrateClient>
  );
}
