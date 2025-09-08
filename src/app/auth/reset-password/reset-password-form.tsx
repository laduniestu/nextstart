'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod/mini';
import { FormButton } from '@/components/form/form-button';
import { FormError } from '@/components/form/form-error';
import { FormHidden } from '@/components/form/form-hidden';
import { FormPassword } from '@/components/form/form-password';
import { FormPasswordCustom } from '@/components/form/form-password-custom';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth/auth-client';
import { ResetPasswordSchema, type ResetPasswordType } from './type';

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [errorForm, setErrorForm] = useState<{ message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token,
      newPassword: '',
      confirmNewPassword: '',
    },
  });
  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    startTransition(async () => {
      await authClient.resetPassword(
        {
          ...values,
        },
        {
          onError(ctx) {
            console.log(ctx);
            setErrorForm({ message: ctx.error.message });
          },
          onSuccess() {
            router.replace('/auth/login?status=SUCCESS_RESET_PASSWORD');
          },
        }
      );
    });
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormError error={errorForm ?? undefined} />
        <FormHidden<ResetPasswordType> schema="token" title="Token" />
        <FormPasswordCustom<ResetPasswordType>
          schema="newPassword"
          title="New Password"
        />
        <FormPassword<ResetPasswordType>
          schema="confirmNewPassword"
          title="Confirm New Password"
        />
        <FormButton className="w-full" isLoading={isPending}>
          Reset
        </FormButton>
      </form>
    </Form>
  );
}
