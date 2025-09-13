'use client';

import { SelectIcon } from '@radix-ui/react-select';
import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';
import type { HTMLAttributes } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!(column.getCanSort() || column.getCanHide())) {
    return <div className={cn(className)}>{title}</div>;
  }

  const ascValue = `${column.id}-asc`;
  const descValue = `${column.id}-desc`;
  const hideValue = `${column.id}-hide`;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Select
        onValueChange={(value) => {
          if (value === ascValue) column.toggleSorting(false);
          else if (value === descValue) column.toggleSorting(true);
          else if (value === hideValue) column.toggleVisibility(false);
        }}
        value={
          column.getIsSorted() === 'desc'
            ? descValue
            : column.getIsSorted() === 'asc'
              ? ascValue
              : undefined
        }
      >
        <SelectTrigger
          aria-label={
            column.getIsSorted() === 'desc'
              ? 'Sorted descending. Click to sort ascending.'
              : column.getIsSorted() === 'asc'
                ? 'Sorted ascending. Click to sort descending.'
                : 'Not sorted. Click to sort ascending.'
          }
          className="-ml-3 h-8 w-fit border-none text-xs hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent [&>svg:last-child]:hidden"
        >
          {title}
          <SelectIcon asChild>
            {column.getCanSort() && column.getIsSorted() === 'desc' ? (
              <ArrowDown aria-hidden="true" className="ml-2.5 size-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp aria-hidden="true" className="ml-2.5 size-4" />
            ) : (
              <ChevronsUpDown aria-hidden="true" className="ml-2.5 size-4" />
            )}
          </SelectIcon>
        </SelectTrigger>
        <SelectContent align="start">
          {column.getCanSort() && (
            <>
              <SelectItem value={ascValue}>
                <span className="flex items-center">
                  <ArrowUp
                    aria-hidden="true"
                    className="mr-2 size-3.5 text-muted-foreground/70"
                  />
                  Asc
                </span>
              </SelectItem>
              <SelectItem value={descValue}>
                <span className="flex items-center">
                  <ArrowDown
                    aria-hidden="true"
                    className="mr-2 size-3.5 text-muted-foreground/70"
                  />
                  Desc
                </span>
              </SelectItem>
            </>
          )}
          {column.getCanHide() && (
            <SelectItem value={hideValue}>
              <span className="flex items-center">
                <EyeOff
                  aria-hidden="true"
                  className="mr-2 size-3.5 text-muted-foreground/70"
                />
                Hide
              </span>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
