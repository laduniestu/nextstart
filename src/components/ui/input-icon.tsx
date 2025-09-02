'use client';

import { ComponentProps, forwardRef } from 'react';

import { TablerIcon } from '@tabler/icons-react';

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
          type={type}
          className={cn(
            'border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            Icon && iconPosition === 'left' && 'pr-3 pl-9',
            Icon && iconPosition === 'right' && 'pr-9 pl-3',
            !Icon && 'px-3',
            className
          )}
          ref={ref}
          {...props}
        />
        {Icon && (
          <div
            className={cn(
              'text-muted-foreground/80 pointer-events-none absolute inset-y-0 flex items-center',
              iconPosition === 'left' ? 'left-3' : 'right-3',
              iconClassName
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
      </div>
    );
  }
);
InputIcon.displayName = 'InputIcon';

export { InputIcon };
