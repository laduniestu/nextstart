'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';
import { cn } from '@/lib/utils';

// Variants for NavigationList (reused from tabsListVariants)
const navigationListVariants = cva('flex shrink-0 items-center', {
  variants: {
    variant: {
      default: 'bg-accent p-1',
      button: '',
      line: 'border-border border-b',
    },
    shape: {
      default: '',
      pill: '',
    },
    size: {
      lg: 'gap-2.5',
      md: 'gap-2',
      sm: 'gap-1.5',
      xs: 'gap-1',
    },
  },
  compoundVariants: [
    { variant: 'default', size: 'lg', className: 'gap-2.5 p-1.5' },
    { variant: 'default', size: 'md', className: 'gap-2 p-1' },
    { variant: 'default', size: 'sm', className: 'gap-1.5 p-1' },
    { variant: 'default', size: 'xs', className: 'gap-1 p-1' },

    {
      variant: 'default',
      shape: 'default',
      size: 'lg',
      className: 'rounded-lg',
    },
    {
      variant: 'default',
      shape: 'default',
      size: 'md',
      className: 'rounded-lg',
    },
    {
      variant: 'default',
      shape: 'default',
      size: 'sm',
      className: 'rounded-md',
    },
    {
      variant: 'default',
      shape: 'default',
      size: 'xs',
      className: 'rounded-md',
    },

    { variant: 'line', size: 'lg', className: 'gap-9' },
    { variant: 'line', size: 'md', className: 'gap-8' },
    { variant: 'line', size: 'sm', className: 'gap-4' },
    { variant: 'line', size: 'xs', className: 'gap-4' },

    {
      variant: 'default',
      shape: 'pill',
      className: 'rounded-full [&_[role=tab]]:rounded-full',
    },
    {
      variant: 'button',
      shape: 'pill',
      className: 'rounded-full [&_[role=tab]]:rounded-full',
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

// Variants for NavigationItem (reused from tabsTriggerVariants)
const navigationItemVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 [&:hover_svg]:text-primary [&_svg]:shrink-0 [&_svg]:text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:text-foreground',
        button:
          'rounded-lg text-accent-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        line: 'border-transparent border-b-2 text-muted-foreground hover:text-primary',
      },
      size: {
        lg: 'gap-2.5 text-sm [&_svg]:size-5',
        md: 'gap-2 text-sm [&_svg]:size-4',
        sm: 'gap-1.5 text-xs [&_svg]:size-3.5',
        xs: 'gap-1 text-xs [&_svg]:size-3.5',
      },
    },
    compoundVariants: [
      { variant: 'default', size: 'lg', className: 'rounded-md px-4 py-2.5' },
      { variant: 'default', size: 'md', className: 'rounded-md px-3 py-1.5' },
      { variant: 'default', size: 'sm', className: 'rounded-sm px-2.5 py-1.5' },
      { variant: 'default', size: 'xs', className: 'rounded-sm px-2 py-1' },

      { variant: 'button', size: 'lg', className: 'rounded-lg px-4 py-3' },
      { variant: 'button', size: 'md', className: 'rounded-lg px-3 py-2.5' },
      { variant: 'button', size: 'sm', className: 'rounded-md px-2.5 py-2' },
      { variant: 'button', size: 'xs', className: 'rounded-md px-2 py-1.5' },

      { variant: 'line', size: 'lg', className: 'py-3' },
      { variant: 'line', size: 'md', className: 'py-2.5' },
      { variant: 'line', size: 'sm', className: 'py-2' },
      { variant: 'line', size: 'xs', className: 'py-1.5' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

type NavigationListProps = React.ComponentProps<'ul'> &
  VariantProps<typeof navigationListVariants>;

function NavigationMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex', className)}
      data-slot="navigation-menu"
      {...props}
    >
      {children}
    </div>
  );
}

function NavigationList({
  className,
  variant = 'default',
  shape = 'default',
  size = 'md',
  ...props
}: NavigationListProps) {
  return (
    <ul
      className={cn(
        navigationListVariants({ variant, shape, size }),
        className
      )}
      data-slot="navigation-list"
      {...props}
    />
  );
}

type NavigationItemProps = React.ComponentProps<'a'> &
  VariantProps<typeof navigationItemVariants>;

function NavigationItem({
  className,
  variant = 'default',
  size = 'md',
  href,
  children,
  ...props
}: NavigationItemProps) {
  const pathname = usePathname();
  const isActive = typeof href === 'string' && pathname === href;
  let activeClass = '';
  if (isActive) {
    if (variant === 'line') {
      activeClass = 'text-foreground border-b-2 border-primary';
    } else if (variant === 'default' || variant === 'button') {
      activeClass = 'bg-background text-foreground shadow-xs';
    }
  }
  return (
    <Link
      className={cn(
        navigationItemVariants({ variant, size }),
        activeClass,
        className
      )}
      data-slot="navigation-item"
      href={href as Route}
      prefetch={false}
      {...props}
    >
      {children}
    </Link>
  );
}

export { NavigationMenu, NavigationList, NavigationItem };
