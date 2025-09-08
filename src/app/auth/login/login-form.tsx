'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { FormButton } from '@/components/form/form-button';
import { FormCheckbox } from '@/components/form/form-checkbox';
import { FormError } from '@/components/form/form-error';
import { FormInput } from '@/components/form/form-input';
import { FormPassword } from '@/components/form/form-password';
import { FormSuccess } from '@/components/form/form-success';
import { Form } from '@/components/ui/form';
import { AFTER_LOGIN_URL } from '@/config';
import { authClient } from '@/lib/auth/auth-client';

const LoginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});
type LoginType = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const status = searchParams.get('status');
  const [isPending, startTransition] = useTransition();
  const [successForm, setSuccessForm] = useState<{ message: string } | null>(
    null
  );
  const [errorForm, setErrorForm] = useState<{ message: string } | null>(null);
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  useEffect(() => {
    if (status === 'OTP_TOO_MANY_ATTEMPTS') {
      setErrorForm({
        message: 'Too many OTP attempts. Please try again later.',
      });
    } else if (status === 'SUCCESS_SEND_RESET_PASSWORD') {
      setSuccessForm({
        message: 'Check your email for the password reset link',
      });
    } else if (status === 'SUCCESS_RESET_PASSWORD') {
      setSuccessForm({
        message:
          'Your password has been reset successfully. Please log in with your new password.',
      });
    }
  }, [status]);

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
        <FormError error={errorForm ?? undefined} />
        <FormSuccess success={successForm ?? undefined} />
        <FormInput<LoginType>
          autoComplete="email"
          autoFocus
          placeholder="example@email.com"
          schema="email"
          title="Email"
        />
        <FormPassword<LoginType>
          rightElement={
            <Link
              className="flex text-sm underline underline-offset-2"
              href="/auth/forgot-password"
              tabIndex={-1}
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
      </form>
    </Form>
  );
}
