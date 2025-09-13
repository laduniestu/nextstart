'use client';

import { use, useMemo, useState } from 'react';

// import { UserDelete } from "@/app/admin/users/_form/user-delete";
// import { UserPassword } from "@/app/admin/users/_form/user-password";
// import { UserUpdate } from "@/app/admin/users/_form/user-update";
import {
  getUsersTableColumns,
  type UserActionTypes,
} from '@/app/admin/users/_table/users-table-column';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import type { DataTableFilterField } from '@/components/data-table/helper/types';
import type { getUsersRoles, getUsersTable } from '@/core/logic/user';
import { UserRoleEnum, type UserType } from '@/db/types/user';
import { useDataTable } from '@/hooks/use-data-table';
import { toRoleCase } from '@/lib/utils';

interface UsersTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getUsersTable>>,
      Awaited<ReturnType<typeof getUsersRoles>>,
    ]
  >;
}

export function UsersTable({ promises }: UsersTableProps) {
  const [{ data, pageCount }, roleCounts] = use(promises);
  const [rowAction, setRowAction] = useState<UserActionTypes<UserType> | null>(
    null
  );
  console.log(rowAction);

  const columns = useMemo(
    () => getUsersTableColumns({ setRowAction }),
    [setRowAction]
  );
  const filterFields: DataTableFilterField<UserType>[] = [
    {
      id: 'name',
      label: 'Name',
      placeholder: 'Filter name...',
    },
    {
      id: 'role',
      label: 'Role',
      options: UserRoleEnum.map((role) => ({
        label: toRoleCase(role),
        value: role,
        count: roleCounts[role],
      })),
    },
    // {
    //   id: 'status',
    //   label: 'Status',
    //   options: users.status.enumValues.map((status) => ({
    //     label: toSentenceCase(status),
    //     value: status,
    //     count: statusCounts[status],
    //   })),
    // },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'], left: ['select'] },
    },
    getRowId: (originalRow) => originalRow.id.toString(),
    shallow: false,
    clearOnDefault: true,
  });
  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar filterFields={filterFields} table={table}>
          {/* <UsersTableToolbarActions table={table} /> */}
        </DataTableToolbar>
      </DataTable>
      {/* <UserUpdate
        onOpenChange={() => setRowAction(null)}
        open={rowAction?.type === 'update'}
        user={rowAction?.row.original ?? null}
      />
      <UserPassword
        onOpenChange={() => setRowAction(null)}
        open={rowAction?.type === 'password'}
        user={rowAction?.row.original ?? null}
      />
      <UserDelete
        onOpenChange={() => setRowAction(null)}
        open={rowAction?.type === 'delete'}
        showTrigger={false}
        users={rowAction?.row.original ? [rowAction?.row.original] : []}
      /> */}
    </>
  );
}
