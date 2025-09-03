'use client';

import type { TablerIcon } from '@tabler/icons-react';
import { type ComponentProps, forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface InputIconProps extends ComponentProps<'input'> {
  icon?: TablerIcon;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
}

const InputIcon = forwardRef<HTMLInputElement, InputIconProps>(
  (
    {
      className,
      type,
      icon: Icon,
      iconPosition = 'right',
      iconClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative">
        <input
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            Icon && iconPosition === 'left' && 'pr-3 pl-9',
            Icon && iconPosition === 'right' && 'pr-9 pl-3',
            !Icon && 'px-3',
            className
          )}
          ref={ref}
          type={type}
          {...props}
        />
        {Icon && (
          <div
            className={cn(
              'pointer-events-none absolute inset-y-0 flex items-center text-muted-foreground/80',
              iconPosition === 'left' ? 'left-3' : 'right-3',
              iconClassName
            )}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
          </div>
        )}
      </div>
    );
  }
);
InputIcon.displayName = 'InputIcon';

export { InputIcon };
