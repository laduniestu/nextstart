'use client';

import type { TablerIcon } from '@tabler/icons-react';
import type { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InputIcon } from '@/components/ui/input-icon';
import { cn } from '@/lib/utils';

type Props<S> = {
  title: string;
  schema: keyof S & string;
  icon?: TablerIcon;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormInputIcon<S>({
  title,
  schema,
  icon,
  iconPosition,
  iconClassName,
  className,
  ...props
}: Props<S>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={schema}
      render={({ field }) => (
        <FormItem className="space-y-0.5">
          <FormLabel htmlFor={schema}>{title}</FormLabel>
          <FormControl>
            <InputIcon
              {...field}
              {...props}
              className={cn(className)}
              icon={icon}
              iconClassName={iconClassName}
              iconPosition={iconPosition}
              id={schema}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
