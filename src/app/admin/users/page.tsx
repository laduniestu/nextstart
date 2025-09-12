import { orpcQuery } from '@/lib/orpc/client';
import { getQueryClient, HydrateClient } from '@/lib/tanstack/hydration';
import UsersTable from './_table/user-table';

export default async function AdminUserPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(orpcQuery.user.list.queryOptions());
  return (
    <HydrateClient client={queryClient}>
      <div className="flex flex-col">
        <p>Admin User Dashboard</p>
        <UsersTable />
      </div>
    </HydrateClient>
  );
}
