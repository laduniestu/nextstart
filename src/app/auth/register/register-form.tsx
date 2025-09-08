'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type z from 'zod/mini';
import { RegisterSchema, type RegisterType } from '@/app/auth/register/type';
import { FormButton } from '@/components/form/form-button';
import { FormError } from '@/components/form/form-error';
import { FormInput } from '@/components/form/form-input';
import { FormPasswordCustom } from '@/components/form/form-password-custom';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth/auth-client';

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorForm, setErrorForm] = useState<{
    message: string;
  } | null>(null);

  const form = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(async () => {
      await authClient.signUp.email(
        {
          callbackURL: '/auth/verify-email',
          ...values,
        },
        {
          onError(ctx) {
            setErrorForm({
              message: ctx.error.message,
            });
          },
          onSuccess() {
            router.push(`/auth/verify-email?email=${form.getValues('email')}`);
          },
        }
      );
    });
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormError error={errorForm ?? undefined} />
        <FormInput<RegisterType>
          placeholder="John Doe"
          schema="name"
          title="Name"
        />
        <FormInput<RegisterType>
          placeholder="example@email.com"
          schema="email"
          title="Email"
        />
        <FormPasswordCustom<RegisterType> schema="password" title="Password" />
        <FormButton className="w-full" isLoading={isPending}>
          Register
        </FormButton>
      </form>
    </Form>
  );
}
