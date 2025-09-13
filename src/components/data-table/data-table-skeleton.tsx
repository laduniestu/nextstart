import type { HTMLAttributes } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DataTableSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  columnCount: number;
  rowCount?: number;
  toolbarCount?: number;
  cellWidths?: string[];
  withPagination?: boolean;
  shrinkZero?: boolean;
}

export function DataTableSkeleton(props: DataTableSkeletonProps) {
  const {
    columnCount,
    rowCount = 10,
    toolbarCount = 0,
    cellWidths = ['auto'],
    withPagination = true,
    shrinkZero = false,
    className,
    ...skeletonProps
  } = props;

  return (
    <div
      className={cn('w-full space-y-3 overflow-auto', className)}
      {...skeletonProps}
    >
      {toolbarCount > 0
        ? Array.from({ length: toolbarCount }).map((_, i) => (
            <div className="flex w-full justify-between" key={i}>
              <Skeleton className="h-7 w-40 lg:w-60" />
              <Skeleton className="h-7 w-40 lg:w-60" />
            </div>
          ))
        : null}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {Array.from({ length: 1 }).map((_, i) => (
              <TableRow className="hover:bg-transparent" key={i}>
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableHead
                    key={j}
                    style={{
                      width: cellWidths[j],
                      minWidth: shrinkZero ? cellWidths[j] : 'auto',
                    }}
                  >
                    <Skeleton className="h-8 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow className="hover:bg-transparent" key={i}>
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    style={{
                      width: cellWidths[j],
                      minWidth: shrinkZero ? cellWidths[j] : 'auto',
                    }}
                  >
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {withPagination ? (
        <div className="flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:gap-8">
          <Skeleton className="h-7 w-40 shrink-0" />
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-[4.5rem]" />
            </div>
            <div className="flex items-center justify-center font-medium text-sm">
              <Skeleton className="h-7 w-20" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="hidden size-7 lg:block" />
              <Skeleton className="size-7" />
              <Skeleton className="size-7" />
              <Skeleton className="hidden size-7 lg:block" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
