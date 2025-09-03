'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod/mini';
import { LoginSchema, type LoginType } from '@/app/auth/login/type';
import { FormButton } from '@/components/form/form-button';
import { FormError } from '@/components/form/form-error';
import { FormInput } from '@/components/form/form-input';
import { FormPassword } from '@/components/form/form-password';
import { Form } from '@/components/ui/form';
import { AFTER_LOGIN_URL } from '@/config';
import { authClient } from '@/lib/auth/auth-client';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [isPending, startTransition] = useTransition();
  const [errorForm, setErrorForm] = useState<{ message: string } | null>(null);
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      await authClient.signIn.email(values, {
        onError(ctx) {
          setErrorForm({ message: ctx.error.message });
        },
        onSuccess() {
          router.push(callbackUrl || AFTER_LOGIN_URL);
          toast.success('Login successful! Redirecting to your dashboard.');
        },
      });
    });
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="text-center font-bold text-3xl">Login</h1>
        <FormError error={errorForm ?? undefined} />
        <FormInput<LoginType>
          placeholder="example@email.com"
          schema="email"
          title="Email"
        />
        <FormPassword<LoginType> schema="password" title="Password" />
        <Link
          className="-mt-4 flex text-sm underline-offset-4 hover:underline"
          href="/forgot-password"
        >
          Forgot your password?
        </Link>
        <FormButton className="w-full" isLoading={isPending}>
          Login
        </FormButton>
        <div className="flex justify-center">
          <Link
            className="text-sm underline-offset-4 hover:underline"
            href="/register"
          >
            Do not have an account?
          </Link>
        </div>
      </form>
    </Form>
  );
}
