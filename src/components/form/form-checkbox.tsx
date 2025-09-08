'use client';

import type * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

type Props<S> = {
  title: string;
  schema: keyof S & string;
  description?: string;
  className?: string;
} & React.ComponentProps<typeof CheckboxPrimitive.Root>;

export function FormCheckbox<S>({
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
          <div className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                id={schema}
                onCheckedChange={field.onChange}
                {...props}
                className={cn(className)}
              />
            </FormControl>
            <FormLabel htmlFor={schema}>{title}</FormLabel>
          </div>
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
