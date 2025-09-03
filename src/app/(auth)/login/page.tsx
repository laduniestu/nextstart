'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod/mini';

import { FormButton } from '@/components/form/form-button';
import { FormError } from '@/components/form/form-error';
import { FormInput } from '@/components/form/form-input';
import { FormPassword } from '@/components/form/form-password';
import { Form } from '@/components/ui/form';
import { LoginSchema, LoginType } from '@/app/(auth)/login/type';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { AFTER_LOGIN_URL } from '@/config';

export default function LoginPage() {
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

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="text-center text-3xl font-bold">Login</h1>
        <FormError error={errorForm ?? undefined} />
        <FormInput<LoginType>
          title="Email"
          schema="email"
          placeholder="example@email.com"
        />
        <FormPassword<LoginType> title="Password" schema="password" />
        <Link
          href="/forgot-password"
          className="text-sm underline-offset-4 hover:underline -mt-4 flex"
        >
          Forgot your password?
        </Link>
        <FormButton className="w-full" isLoading={isPending}>
          Login
        </FormButton>
        <div className="flex justify-center">
          <Link
            href="/register"
            className="text-sm underline-offset-4 hover:underline"
          >
            Do not have an account?
          </Link>
        </div>
      </form>
    </Form>
  );
}
