"use client";

import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordInput from "@/components/ui/input-password";

type Props<S> = {
  title: string;
  schema: keyof S & string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormPasswordCustom<S>({ title, schema }: Props<S>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={schema}
      render={({ field }) => (
        <FormItem className="space-y-0.5">
          <FormLabel htmlFor={schema}>{title}</FormLabel>
          <FormControl>
            <PasswordInput
              value={field.value}
              onChange={field.onChange}
              id={schema}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
