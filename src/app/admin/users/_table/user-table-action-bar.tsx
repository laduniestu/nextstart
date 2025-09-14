'use client';

import { SelectTrigger } from '@radix-ui/react-select';
import type { Table } from '@tanstack/react-table';
import { CheckCircle2, Download, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar';
import { exportTableToCSV } from '@/components/data-table/helper/export';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UserRoleEnum, type UserType } from '@/db/types/user';

const actions = ['update-role', 'export', 'delete'] as const;

type Action = (typeof actions)[number];

interface TasksTableActionBarProps {
  table: Table<UserType>;
}

export function TasksTableActionBar({ table }: TasksTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction]
  );

  const onTaskUpdate = React.useCallback(
    ({ field, value }: { field: 'role'; value: UserType['role'] }) => {
      setCurrentAction('update-role');
      startTransition(async () => {
        console.log(field, value);

        // TODO
        // const { error } = await updateTasks({
        //   ids: rows.map((row) => row.original.id),
        //   [field]: value,
        // });

        // if (error) {
        //   toast.error(error);
        //   return;
        // }
        toast.success('Tasks updated');
      });
    },
    [rows]
  );

  const onTaskExport = React.useCallback(() => {
    setCurrentAction('export');
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ['select', 'actions'],
        onlySelected: true,
      });
    });
  }, [table]);

  const onTaskDelete = React.useCallback(() => {
    setCurrentAction('delete');
    startTransition(async () => {
      // TODO
      // const { error } = await deleteTasks({
      //   ids: rows.map((row) => row.original.id),
      // });

      // if (error) {
      //   toast.error(error);
      //   return;
      // }
      table.toggleAllRowsSelected(false);
    });
  }, [rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        className="hidden data-[orientation=vertical]:h-5 sm:block"
        orientation="vertical"
      />
      <div className="flex items-center gap-1.5">
        <Select
          onValueChange={(value: UserType['role']) =>
            onTaskUpdate({ field: 'role', value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              isPending={getIsActionPending('update-role')}
              size="icon"
              tooltip="Update role"
            >
              <CheckCircle2 />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {UserRoleEnum.map((status) => (
                <SelectItem className="capitalize" key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <Select
          onValueChange={(value: UserType['priority']) =>
            onTaskUpdate({ field: 'priority', value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              isPending={getIsActionPending('update-priority')}
              size="icon"
              tooltip="Update priority"
            >
              <ArrowUp />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {tasks.priority.enumValues.map((priority) => (
                <SelectItem
                  className="capitalize"
                  key={priority}
                  value={priority}
                >
                  {priority}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select> */}
        <DataTableActionBarAction
          isPending={getIsActionPending('export')}
          onClick={onTaskExport}
          size="icon"
          tooltip="Export tasks"
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          isPending={getIsActionPending('delete')}
          onClick={onTaskDelete}
          size="icon"
          tooltip="Delete tasks"
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
