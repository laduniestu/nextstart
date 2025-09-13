'use client';

import type { ColumnDef, Row } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

// import {
//   adminUpdateUserRoleAction,
//   adminUpdateUserStatusAction,
// } from '@/app/admin/users/action-user';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRoleEnum, type UserType } from '@/db/types/user';
import { formatDate, toRoleCase } from '@/lib/utils';

export interface UserActionTypes<TData> {
  row: Row<TData>;
  type: 'update' | 'delete' | 'password';
}

interface GetUsersTableColumnsProps {
  setRowAction: Dispatch<SetStateAction<UserActionTypes<UserType> | null>>;
}

export function getUsersTableColumns({
  setRowAction,
}: GetUsersTableColumnsProps): ColumnDef<UserType>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          className="translate-y-0.5"
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          className="translate-y-0.5"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 1,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const role = UserRoleEnum.find((role) => role === row.original.role);

        if (!role) return null;
        return (
          <Badge variant={role === 'admin' ? 'default' : 'outline'}>
            {toRoleCase(role)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      enableSorting: true,
      enableHiding: true,
      size: 100,
    },
    // {
    //   accessorKey: 'status',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Status" />
    //   ),
    //   cell: ({ row }) => {
    //     const status = users.status.enumValues.find(
    //       (status) => status === row.original.status
    //     );
    //     return (
    //       <Badge
    //         className={
    //           status === 'active' ? 'bg-green-500/50' : 'bg-gray-500/20'
    //         }
    //         variant="secondary"
    //       >
    //         {status}
    //       </Badge>
    //     );
    //   },
    //   filterFn: (row, id, value) => {
    //     return Array.isArray(value) && value.includes(row.getValue(id));
    //   },
    //   enableSorting: false,
    //   enableHiding: true,
    //   size: 50,
    // },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
      enableColumnFilter: true,
    },
    {
      id: 'actions',
      cell({ row }) {
        // const { execute: changeRole, isPending: pendingChangeRole } =
        //   useServerAction(adminUpdateUserRoleAction, {
        //     onError({ err }) {
        //       toast({
        //         title: 'Something went wrong',
        //         description: err.message,
        //         variant: 'destructive',
        //       });
        //     },
        //     onSuccess() {
        //       toast({
        //         title: `User data ${row.original.name ? 'saved' : 'created'}`,
        //         description: 'User can now login to their account.',
        //       });
        //     },
        //   });

        // const { execute: changeStatus, isPending: pendingChangeStatus } =
        //   useServerAction(adminUpdateUserStatusAction, {
        //     onError({ err }) {
        //       toast({
        //         title: 'Something went wrong',
        //         description: err.message,
        //         variant: 'destructive',
        //       });
        //     },
        //     onSuccess() {
        //       toast({
        //         title: `User data ${row.original.name ? 'saved' : 'created'}`,
        //         description: 'User can now login to their account.',
        //       });
        //     },
        //   });
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="h-full w-full bg-red-500">
              <Button
                aria-label="Open menu"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
                variant="ghost"
              >
                <Ellipsis aria-hidden="true" className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: 'update' })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: 'delete' })}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: 'password' })}
              >
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change role</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    // onValueChange={(value) => {
                    //   changeRole({
                    //     id: row.original.id,
                    //     role: value as UserRole,
                    //   });
                    // }}
                    value={row.original.role!}
                  >
                    {/* {users.role.enumValues.map((label) => (
                      <DropdownMenuRadioItem
                        className="capitalize"
                        disabled={pendingChangeRole}
                        key={label}
                        value={label}
                      >
                        {toRoleCase(label)}
                      </DropdownMenuRadioItem>
                    ))} */}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {/* <DropdownMenuRadioGroup
                    onValueChange={(value) => {
                      changeStatus({
                        id: row.original.id,
                        status: value as UserStatus,
                      });
                    }}
                    value={row.original.status}
                  >
                    {users.status.enumValues.map((label) => (
                      <DropdownMenuRadioItem
                        className="capitalize"
                        disabled={pendingChangeStatus}
                        key={label}
                        value={label}
                      >
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup> */}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 30,
    },
  ];
}
