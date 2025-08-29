'use client';

import { InputHTMLAttributes } from 'react';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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

export function FormInput<S>({
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
        <FormItem className="space-y-0.5">
          <FormLabel htmlFor={schema}>{title}</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...props}
              id={schema}
              className={cn(className)}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-muted-foreground text-xs">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
