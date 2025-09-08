'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormButton } from '@/components/form/form-button';
import { FormError } from '@/components/form/form-error';
import { FormInput } from '@/components/form/form-input';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth/auth-client';

const ForgotPasswordSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});
type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [errorForm, setErrorForm] = useState<{ message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    startTransition(async () => {
      await authClient.requestPasswordReset(
        {
          redirectTo: '/auth/reset-password',
          ...values,
        },
        {
          onError(ctx) {
            console.log(ctx);
            setErrorForm({ message: ctx.error.message });
          },
          onSuccess() {
            router.replace('/auth/login?status=SUCCESS_SEND_RESET_PASSWORD');
          },
        }
      );
    });
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormError error={errorForm ?? undefined} />
        <FormInput<ForgotPasswordType>
          autoComplete="email"
          autoFocus
          placeholder="example@email.com"
          schema="email"
          title="Email"
        />
        <FormButton className="w-full" isLoading={isPending}>
          Reset
        </FormButton>
      </form>
    </Form>
  );
}
