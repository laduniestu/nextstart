'use client';

import type { ReactNode } from 'react';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SelectOption = {
  label: string;
  value: string;
};

type Props<S> = {
  title: string;
  schema: keyof S & string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
  valueTransform?: <T>(value: T) => string;
  afterSelect?: ReactNode;
};

export function FormSelect<S>({
  title,
  schema,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className,
  onValueChange,
  valueTransform = (value) => String(value),
  afterSelect,
}: Props<S>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={schema}
      render={({ field }) => (
        <FormItem className="space-y-0.5">
          <FormLabel htmlFor={schema}>{title}</FormLabel>
          <Select
            disabled={disabled}
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            value={valueTransform(field.value)}
          >
            <FormControl>
              <SelectTrigger className={className} id={schema}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {afterSelect}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
