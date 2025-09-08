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
import { FormCheckbox } from '@/components/form/form-checkbox';
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
  const errorStatus = searchParams.get('status');
  const [isPending, startTransition] = useTransition();
  const [errorForm, setErrorForm] = useState<{ message: string } | null>(null);
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  if (errorStatus === 'OTP_TOO_MANY_ATTEMPTS' && !errorForm) {
    setErrorForm({ message: 'Too many OTP attempts. Please try again later.' });
  }

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      await authClient.signIn.email(values, {
        onError(ctx) {
          if (ctx.error.code === 'EMAIL_NOT_VERIFIED') {
            toast.error('Please verify your email before logging in.');
            router.push(
              `/auth/verify-email?email=${encodeURIComponent(values.email)}`
            );
            return;
          }
          setErrorForm({ message: ctx.error.message });
        },
        onSuccess() {
          toast.success('Login successful! Redirecting to your dashboard.');
          router.push((callbackUrl || AFTER_LOGIN_URL) as never);
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
        <FormPassword<LoginType>
          rightElement={
            <Link
              className="flex text-sm underline underline-offset-2"
              href="/auth/forgot-password"
            >
              Forgot your password?
            </Link>
          }
          schema="password"
          title="Password"
        />
        <FormCheckbox<LoginType> schema="rememberMe" title="Remember me" />
        <FormButton className="w-full" isLoading={isPending}>
          Login
        </FormButton>
        <div className="flex justify-center">
          <Link
            className="text-sm underline-offset-4 hover:underline"
            href="/auth/register"
          >
            Do not have an account?
          </Link>
        </div>
      </form>
    </Form>
  );
}
