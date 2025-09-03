'use client';

import { useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type RadioOption = {
  label: string;
  value: boolean;
  description?: string;
};

type Props<S> = {
  title: string;
  schema: keyof S & string;
  options: RadioOption[];
  disabled?: boolean;
};

export function FormCheckboxGroup<S>({
  title,
  schema,
  options,
  disabled = false,
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={schema}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{title}</FormLabel>
          <div className="flex gap-3 pt-2">
            {options.map((option) => (
              <label
                className={`flex flex-1 cursor-pointer flex-row items-start rounded-md border p-4 ${
                  field.value === option.value
                    ? 'border-primary bg-primary/5'
                    : ''
                }`}
                key={String(option.value)}
              >
                <input
                  checked={field.value === option.value}
                  className="sr-only"
                  disabled={disabled}
                  onChange={() => field.onChange(option.value)}
                  type="radio"
                />
                <div className="flex h-5 items-center">
                  <Checkbox checked={field.value === option.value} disabled />
                </div>
                <div className="ml-2 space-y-1">
                  <p className="font-medium">{option.label}</p>
                  {option.description && (
                    <p className="text-muted-foreground text-sm">
                      {option.description}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
