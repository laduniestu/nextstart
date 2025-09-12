'use client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { orpcQuery } from '@/lib/orpc/client';

export default function UsersTable() {
  const { data, isError, isLoading } = useSuspenseQuery(
    orpcQuery.user.list.queryOptions()
  );
  if (isLoading) {
    return <p>Load</p>;
  }
  if (isError) {
    return <p>Something went wrong</p>;
  }
  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
