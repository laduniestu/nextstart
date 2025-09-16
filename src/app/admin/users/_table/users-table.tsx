'use client';

import { use, useMemo, useState } from 'react';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableSortList } from '@/components/data-table/data-table-sort-list';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import type { DataTableRowAction } from '@/components/data-table/helper/types';
import type {
  fnGetUsers,
  fnGetUsersRoles,
  fnUsersEmailVerified,
} from '@/core/function/user';
import type { UserType } from '@/db/types/user';
import { useDataTable } from '@/hooks/use-data-table';
import { DeleteUsersModal } from '../_form/delete';
import { UsersTableActionBar } from './users-table-action-bar';
import { getUsersTableColumns } from './users-table-column';
import { UsersTableToolbarActions } from './users-table-toolbar-icon';

interface UsersTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof fnGetUsers>>,
      Awaited<ReturnType<typeof fnGetUsersRoles>>,
      Awaited<ReturnType<typeof fnUsersEmailVerified>>,
    ]
  >;
}

export function UsersTable({ promises }: UsersTableProps) {
  const [{ data, pageCount }, roleCount, emailVerifiedCount] = use(promises);

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<UserType> | null>(null);

  const columns = useMemo(
    () =>
      getUsersTableColumns({
        roleCount,
        emailVerifiedCount,
        setRowAction,
      }),
    [roleCount, emailVerifiedCount]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        actionBar={<UsersTableActionBar table={table} />}
        table={table}
      >
        <DataTableToolbar table={table}>
          <UsersTableToolbarActions table={table} />
          <DataTableSortList align="end" table={table} />
        </DataTableToolbar>
      </DataTable>
      <DeleteUsersModal
        onOpenChange={() => setRowAction(null)}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        open={rowAction?.variant === 'delete'}
        showTrigger={false}
        users={rowAction?.row.original ? [rowAction?.row.original] : []}
      />
    </>
  );
}
