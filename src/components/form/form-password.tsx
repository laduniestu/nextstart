'use client';

import { Eye, EyeOff } from 'lucide-react';
import { type InputHTMLAttributes, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
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
  rightElement?: React.ReactNode;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormPassword<S>({
  title,
  schema,
  className,
  rightElement,
  ...props
}: Props<S>) {
  const form = useFormContext();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  return (
    <FormField
      control={form.control}
      name={schema}
      render={({ field }) => (
        <FormItem className="space-y-0.5">
          <div className="flex justify-between">
            <FormLabel htmlFor={schema}>{title}</FormLabel>
            {rightElement && <div>{rightElement}</div>}
          </div>
          <FormControl>
            <div className="relative">
              <Input
                placeholder="********"
                type={isVisible ? 'text' : 'password'}
                {...field}
                {...props}
                autoComplete="new-password"
                className={cn(className)}
                id={schema}
              />
              <button
                aria-controls="password"
                aria-label={isVisible ? 'Hide password' : 'Show password'}
                aria-pressed={isVisible}
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={toggleVisibility}
                tabIndex={-1}
                type="button"
              >
                {isVisible ? (
                  <EyeOff aria-hidden="true" size={16} strokeWidth={2} />
                ) : (
                  <Eye aria-hidden="true" size={16} strokeWidth={2} />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
