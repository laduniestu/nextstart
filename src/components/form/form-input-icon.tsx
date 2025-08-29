'use client';

import { InputHTMLAttributes } from 'react';

import { TablerIcon } from '@tabler/icons-react';
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
              id={schema}
              icon={icon}
              iconPosition={iconPosition}
              iconClassName={iconClassName}
              className={cn(className)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
