import { Loader2Icon } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';

export function FormButton({
  children,
  isLoading,
  className,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { isLoading: boolean }) {
  return (
    <Button
      disabled={isLoading}
      type="submit"
      {...props}
      className={cn('flex justify-center gap-2 px-3', className)}
    >
      {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
