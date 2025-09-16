'use client';

import {
  IconDownload,
  IconMailCheck,
  IconShieldCheck,
  IconTrash,
} from '@tabler/icons-react';
import type { Table } from '@tanstack/react-table';
import { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar';
import { exportTableToCSV } from '@/components/data-table/helper/export';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  actionAdminUpdateUsersEmailVerified,
  actionAdminUpdateUsersRoles,
} from '@/core/action/user';
import { UserRoleEnum, type UserType } from '@/db/types/user';
import { extractActionError } from '@/lib/safe-action/helper';
import { DeleteUsersModal } from '../_form/delete';

const actions = [
  'update-emailVerified',
  'update-role',
  'export',
  'delete',
] as const;

type Action = (typeof actions)[number];

interface UsersTableActionBarProps {
  table: Table<UserType>;
}

export function UsersTableActionBar({ table }: UsersTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = useTransition();
  const [currentAction, setCurrentAction] = useState<Action | null>(null);

  const getIsActionPending = useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  );

  const onUserUpdateRole = useCallback(
    ({ role }: { role: UserType['role'] }) => {
      setCurrentAction('update-role');
      startTransition(async () => {
        const res = await actionAdminUpdateUsersRoles({
          id: rows.map((row) => row.original.id),
          role,
        });
        const error = extractActionError(res);
        if (error) {
          toast.error(error);
        } else {
          const count = res.data!;
          table.toggleAllRowsSelected(false);
          toast.success(
            `Successfully updated role${count > 1 ? 's' : ''} for ${count} user${count > 1 ? 's' : ''}.`
          );
        }
      });
    },
    [rows]
  );

  const onUserUpdateEmailVerified = useCallback(
    ({ emailVerified }: { emailVerified: 'true' | 'false' }) => {
      setCurrentAction('update-emailVerified');
      startTransition(async () => {
        const res = await actionAdminUpdateUsersEmailVerified({
          id: rows.map((row) => row.original.id),
          emailVerified,
        });
        const error = extractActionError(res);
        if (error) {
          toast.error(error);
        } else {
          const count = res.data!;
          table.toggleAllRowsSelected(false);
          toast.success(
            `Successfully updated Email Verification for ${count} user${count > 1 ? 's' : ''}.`
          );
        }
      });
    },
    [rows]
  );

  const onUserExport = useCallback(() => {
    setCurrentAction('export');
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ['select', 'actions'],
        onlySelected: true,
      });
    });
  }, [table]);

  return (
    <>
      <DeleteUsersModal
        onOpenChange={() => setCurrentAction(null)}
        onSuccess={() => table.toggleAllRowsSelected(false)}
        open={currentAction === 'delete'}
        showTrigger={false}
        users={rows.map((user) => user.original)}
      />
      <DataTableActionBar table={table} visible={rows.length > 0}>
        <DataTableActionBarSelection table={table} />
        <Separator
          className="hidden data-[orientation=vertical]:h-5 sm:block"
          orientation="vertical"
        />
        <div className="flex items-center gap-1.5">
          <DataTableActionBarAction
            isPending={getIsActionPending('export')}
            onClick={onUserExport}
            size="icon"
            tooltip="Export user"
          >
            <IconDownload />
          </DataTableActionBarAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DataTableActionBarAction
                isPending={getIsActionPending('update-role')}
                size="icon"
                tooltip="Update role"
              >
                <IconShieldCheck />
              </DataTableActionBarAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {UserRoleEnum.map((role) => (
                <DropdownMenuItem
                  className="capitalize"
                  key={role}
                  onClick={() => onUserUpdateRole({ role })}
                >
                  {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DataTableActionBarAction
                isPending={getIsActionPending('update-emailVerified')}
                size="icon"
                tooltip="Update Email Verification"
              >
                <IconMailCheck />
              </DataTableActionBarAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="capitalize"
                onClick={() =>
                  onUserUpdateEmailVerified({ emailVerified: 'true' })
                }
              >
                Verified
              </DropdownMenuItem>
              <DropdownMenuItem
                className="capitalize"
                onClick={() =>
                  onUserUpdateEmailVerified({ emailVerified: 'false' })
                }
              >
                Unverified
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DataTableActionBarAction
            isPending={getIsActionPending('delete')}
            onClick={() => setCurrentAction('delete')}
            size="icon"
            tooltip="Delete user"
          >
            <IconTrash />
          </DataTableActionBarAction>
        </div>
      </DataTableActionBar>
    </>
  );
}
