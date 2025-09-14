'use client';

import { use, useMemo, useState } from 'react';

// import { UserDelete } from "@/app/admin/users/_form/user-delete";
// import { UserPassword } from "@/app/admin/users/_form/user-password";
// import { UserUpdate } from "@/app/admin/users/_form/user-update";
import { DataTable } from '@/components/data-table/data-table';
import { DataTableSortList } from '@/components/data-table/data-table-sort-list';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import type { DataTableRowAction } from '@/components/data-table/helper/types';
import type { getUsersRoles, getUsersTable } from '@/core/logic/user';
import type { UserType } from '@/db/types/user';
import { useDataTable } from '@/hooks/use-data-table';
import { TasksTableActionBar } from './user-table-action-bar';
import { getUsersTableColumns } from './users-table-column';

interface UsersTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getUsersTable>>,
      Awaited<ReturnType<typeof getUsersRoles>>,
    ]
  >;
}

export function UsersTable({ promises }: UsersTableProps) {
  const [{ data, pageCount }, roleCount] = use(promises);

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<UserType> | null>(null);
  console.log(rowAction);

  const columns = useMemo(
    () =>
      getUsersTableColumns({
        roleCount,
        setRowAction,
      }),
    [roleCount]
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
    <DataTable actionBar={<TasksTableActionBar table={table} />} table={table}>
      <DataTableToolbar table={table}>
        <DataTableSortList align="end" table={table} />
      </DataTableToolbar>
    </DataTable>
    // <DataTable table={table}>
    //   <DataTableToolbar filterFields={filterFields} table={table}>
    //     {/* <UsersTableToolbarActions table={table} /> */}
    //   </DataTableToolbar>
    // </DataTable>
  );
}
