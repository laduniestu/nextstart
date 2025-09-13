'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/components/data-table/hooks/use-data-table';
import type { DataTableFilterField } from '@/components/data-table/lib/types';
import type { UserType } from '@/core/type/user';
import { orpcQuery } from '@/lib/orpc/client';
import {
  getUsersTableColumns,
  type UserActionTypes,
} from './user-table-column';
import { userTableSearchParamsSchemaNuqsClient } from './validation.client';

export default function UserTable() {
  const [input, setInput] = useQueryStates(
    userTableSearchParamsSchemaNuqsClient
  );
  const { data } = useSuspenseQuery(
    orpcQuery.user.table.queryOptions({
      input,
    })
  );

  const [rowAction, setRowAction] = useState<UserActionTypes<UserType> | null>(
    null
  );
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
    // {
    //   id: "role",
    //   label: "Role",
    //   options: users.role.enumValues.map((role) => ({
    //     label: toRoleCase(role),
    //     value: role,
    //     count: roleCounts[role],
    //   })),
    // },
    // {
    //   id: "status",
    //   label: "Status",
    //   options: users.status.enumValues.map((status) => ({
    //     label: toSentenceCase(status),
    //     value: status,
    //     count: statusCounts[status],
    //   })),
    // },
  ];

  const { table } = useDataTable({
    data: data.data,
    columns,
    pageCount: data.pageCount,
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
      {/* <UserUpdate open={rowAction?.type === "update"} onOpenChange={() => setRowAction(null)} user={rowAction?.row.original ?? null} />
      <UserPassword open={rowAction?.type === "password"} onOpenChange={() => setRowAction(null)} user={rowAction?.row.original ?? null} />
      <UserDelete
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        users={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
      /> */}
    </>
  );
}
