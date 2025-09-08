'use client';

import type { InputHTMLAttributes } from 'react';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Props<S> = {
  title: string;
  schema: keyof S & string;
  description?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormHidden<S>({
  title,
  schema,
  description,
  className,
  ...props
}: Props<S>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={schema}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              {...field}
              {...props}
              className={cn(className)}
              id={schema}
              type="hidden"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
