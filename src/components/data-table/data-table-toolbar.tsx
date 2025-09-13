'use client';

import type { Table } from '@tanstack/react-table';
import { Download, X } from 'lucide-react';
import { type HTMLAttributes, useMemo } from 'react';

import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { DateRangePicker } from '../custom/date-range-picker';
import { exportTableToCSV } from './lib/export';
import type { DataTableFilterField } from './lib/types';

interface DataTableToolbarProps<TData> extends HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { searchableColumns, filterableColumns } = useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-between gap-2 overflow-auto p-1">
        {children}
        <div className="flex items-center">
          <Button
            className="gap-2"
            onClick={() =>
              exportTableToCSV(table, {
                filename: 'tasks',
                excludeColumns: ['select', 'actions'],
              })
            }
            size="sm"
            variant="outline"
          >
            <Download aria-hidden="true" className="size-4" />
            Export
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div
        className={cn(
          'flex w-full flex-col justify-between gap-2 overflow-auto p-1 sm:flex-row sm:items-center',
          className
        )}
        {...props}
      >
        <div className="flex flex-1 items-center gap-2">
          {searchableColumns.length > 0 &&
            searchableColumns.map(
              (column) =>
                table.getColumn(column.id ? String(column.id) : '') && (
                  <Input
                    className="h-8 w-40 lg:w-64"
                    key={String(column.id)}
                    onChange={(event) =>
                      table
                        .getColumn(String(column.id))
                        ?.setFilterValue(event.target.value)
                    }
                    placeholder={column.placeholder}
                    value={
                      (table
                        .getColumn(String(column.id))
                        ?.getFilterValue() as string) ?? ''
                    }
                  />
                )
            )}
          {filterableColumns.length > 0 &&
            filterableColumns.map(
              (column) =>
                table.getColumn(column.id ? String(column.id) : '') && (
                  <DataTableFacetedFilter
                    column={table.getColumn(column.id ? String(column.id) : '')}
                    key={String(column.id)}
                    options={column.options ?? []}
                    title={column.label}
                  />
                )
            )}
          {isFiltered && (
            <Button
              aria-label="Reset filters"
              className="h-8 px-2 lg:px-3"
              onClick={() => table.resetColumnFilters()}
              variant="ghost"
            >
              Reset
              <X aria-hidden="true" className="ml-2 size-4" />
            </Button>
          )}
        </div>
        <DateRangePicker
          align="start"
          shallow={false}
          triggerClassName=" w-40 lg:w-60"
          triggerSize="sm"
        />
      </div>
    </div>
  );
}
