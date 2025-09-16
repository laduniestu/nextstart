'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon, CheckCircle2Icon, Ellipsis, Text } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { DataTableRowAction } from '@/components/data-table/helper/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  actionAdminUpdateUsersEmailVerified,
  actionAdminUpdateUsersRoles,
} from '@/core/action/user';
import { UserRoleEnum, type UserType } from '@/db/types/user';
import { extractActionError } from '@/lib/safe-action/helper';
import { formatDate } from '@/lib/utils';

interface GetUsersTableColumnsProps {
  roleCount: Record<UserType['role'], number>;
  emailVerifiedCount: Record<'verified' | 'unverified', number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<UserType> | null>
  >;
}

export function getUsersTableColumns({
  roleCount,
  emailVerifiedCount,
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
      size: 40,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue('name')}
            </span>
          </div>
        );
      },
      meta: {
        label: 'Name',
        placeholder: 'Search name...',
        variant: 'text',
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: 'emailVerified',
      accessorKey: 'emailVerified',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Verified" />
      ),
      cell: ({ row }) => {
        const verified = row.original.emailVerified;
        return (
          <CheckCircle2Icon
            className={`${verified ? 'opacity-100' : 'opacity-20'}`}
          />
        );
      },
      meta: {
        label: 'Verified',
        variant: 'select',
        options: [
          {
            label: 'Verified',
            value: 'verified',
            count: emailVerifiedCount['verified'],
          },
          {
            label: 'Unverified',
            value: 'unverified',
            count: emailVerifiedCount['unverified'],
          },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ cell }) => {
        const role = UserRoleEnum.find(
          (role) => role === cell.getValue<UserType['role']>()
        );

        if (!role) return null;

        return (
          <Badge className="py-1 [&>svg]:size-3.5" variant="outline">
            <span className="capitalize">{role}</span>
          </Badge>
        );
      },
      meta: {
        label: 'Role',
        variant: 'multiSelect',
        options: UserRoleEnum.map((role) => ({
          label: role.charAt(0).toUpperCase() + role.slice(1),
          value: role,
          count: roleCount[role],
        })),
      },
      enableColumnFilter: true,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: 'Created At',
        variant: 'dateRange',
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: 'actions',
      cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
                onSelect={() => setRowAction({ row, variant: 'update' })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Roles</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    onValueChange={(value) => {
                      if (value !== row.original.role) {
                        startUpdateTransition(async () => {
                          const res = await actionAdminUpdateUsersRoles({
                            id: [row.original.id],
                            role: value as UserType['role'],
                          });
                          const error = extractActionError(res);
                          if (error) {
                            toast.error(error);
                          } else {
                            toast.success('Successfully updated user role.');
                          }
                        });
                      }
                    }}
                    value={row.original.role}
                  >
                    {UserRoleEnum.map((label) => (
                      <DropdownMenuRadioItem
                        className="capitalize"
                        disabled={isUpdatePending}
                        key={label}
                        value={label}
                      >
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Email Verification
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    onValueChange={(value) => {
                      if (value !== String(row.original.emailVerified)) {
                        startUpdateTransition(async () => {
                          const res = await actionAdminUpdateUsersEmailVerified(
                            {
                              id: [row.original.id],
                              emailVerified: value as 'false' | 'true',
                            }
                          );
                          const error = extractActionError(res);
                          if (error) {
                            toast.error(error);
                          } else {
                            toast.success('Successfully updated user role.');
                          }
                        });
                      }
                    }}
                    value={String(row.original.emailVerified)}
                  >
                    <DropdownMenuRadioItem
                      className="capitalize"
                      disabled={isUpdatePending}
                      value="true"
                    >
                      Verified
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      className="capitalize"
                      disabled={isUpdatePending}
                      value="false"
                    >
                      Unverified
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: 'delete' })}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
