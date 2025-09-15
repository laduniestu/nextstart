'use client';

import type { Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { exportTableToCSV } from '@/components/data-table/helper/export';
import { Button } from '@/components/ui/button';
import type { UserType } from '@/db/types/user';

// import { CreateUserSheet } from './create-task-sheet';
// import { DeleteUsersDialog } from './delete-tasks-dialog';

interface UsersTableToolbarActionsProps {
  table: Table<UserType>;
}

export function UsersTableToolbarActions({
  table,
}: UsersTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteUsersDialog
          onSuccess={() => table.toggleAllRowsSelected(false)}
          tasks={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
        />
      ) : null}
      <CreateUserSheet /> */}
      <Button
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'tasks',
            excludeColumns: ['select', 'actions'],
          })
        }
        size="sm"
        variant="outline"
      >
        <Download />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
