'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod/mini';

import { LOGIN_URL } from '@/config';
import { FormButton } from '@/components/form/form-button';
import { FormError } from '@/components/form/form-error';
import { FormInput } from '@/components/form/form-input';
import { FormPasswordCustom } from '@/components/form/form-password-custom';
import { Form } from '@/components/ui/form';
import { RegisterSchema, RegisterType } from '@/app/(auth)/register/type';
import { authClient } from '@/lib/auth/auth-client';
import { FormSuccess } from '@/components/form/form-success';

export default function RegisterPage() {
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
      const { data, error } = await authClient.signUp.email(values, {
        onError(ctx) {
          setErrorForm({
            message: ctx.error.message,
          });
        },
        onSuccess(ctx) {
          setSuccessForm({
            code: "You're registered!",
            message: 'Please check your email to verify your account.',
          });
          form.reset();
        },
      });
      console.log(data, error);
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="text-center text-3xl font-bold">Register</h1>
        <FormError error={errorForm ?? undefined} />
        <FormSuccess success={successForm ?? undefined} />
        <FormInput<RegisterType>
          title="Name"
          schema="name"
          placeholder="John Doe"
        />
        <FormInput<RegisterType>
          title="Email"
          schema="email"
          placeholder="example@email.com"
        />
        <FormPasswordCustom<RegisterType> title="Password" schema="password" />
        <FormButton className="w-full" isLoading={isPending}>
          Register
        </FormButton>
        <div className="flex justify-center">
          <Link
            href={LOGIN_URL}
            className="text-sm underline-offset-4 hover:underline"
          >
            Already have an account?
          </Link>
        </div>
      </form>
    </Form>
  );
}
