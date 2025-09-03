'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type z from 'zod/mini';
import { RegisterSchema, type RegisterType } from '@/app/auth/register/type';
import { FormButton } from '@/components/form/form-button';
import { FormError } from '@/components/form/form-error';
import { FormInput } from '@/components/form/form-input';
import { FormPasswordCustom } from '@/components/form/form-password-custom';
import { FormSuccess } from '@/components/form/form-success';
import { Form } from '@/components/ui/form';
import { LOGIN_URL } from '@/config';
import { authClient } from '@/lib/auth/auth-client';

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [errorForm, setErrorForm] = useState<{
    message: string;
  } | null>(null);
  const [successForm, setSuccessForm] = useState<{
    code: string | number;
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
      await authClient.signUp.email(values, {
        onError(ctx) {
          setErrorForm({
            message: ctx.error.message,
          });
        },
        onSuccess() {
          setSuccessForm({
            code: "You're registered!",
            message: 'Please check your email to verify your account.',
          });
          form.reset();
        },
      });
    });
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="text-center font-bold text-3xl">Register</h1>
        <FormError error={errorForm ?? undefined} />
        <FormSuccess success={successForm ?? undefined} />
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
        <div className="flex justify-center">
          <Link
            className="text-sm underline-offset-4 hover:underline"
            href={LOGIN_URL}
          >
            Already have an account?
          </Link>
        </div>
      </form>
    </Form>
  );
}
