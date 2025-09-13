import type { Column } from '@tanstack/react-table';
import type { CSSProperties } from 'react';

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: (() => {
      if (!withBorder) return;
      if (isLastLeftPinnedColumn)
        return '-4px 0 4px -4px hsl(var(--border)) inset';
      if (isFirstRightPinnedColumn)
        return '4px 0 4px -4px hsl(var(--border)) inset';
      return;
    })(),
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? 'hsl(var(--background))' : 'hsl(var(--background))',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}
