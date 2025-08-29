'use client';

import { TextareaHTMLAttributes } from 'react';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Props<S> = {
  title: string;
  schema: keyof S & string;
  description?: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea<S>({
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
            <Textarea
              {...field}
              {...props}
              id={schema}
              value={field.value || ''} // Handle undefined/null values
              className={cn(className)}
            />
          </FormControl>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
