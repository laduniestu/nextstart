'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormButton } from '@/components/form/form-button';
import { FormError } from '@/components/form/form-error';
import { FormHidden } from '@/components/form/form-hidden';
import { FormPassword } from '@/components/form/form-password';
import { FormPasswordCustom } from '@/components/form/form-password-custom';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth/auth-client';

const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, {
      message:
        'Invalid token. Please use the password reset link sent to your email.',
    }),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .max(100, 'Password must be less than 100 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmNewPassword: z
      .string()
      .min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });
type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

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
