import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import z from 'zod';
import ResetPasswordForm from './reset-password-form';

export default async function ResetPasswordPage(
  props: PageProps<'/auth/verify-email'>
) {
  const { token } = await props.searchParams;

  const tokenSchema = z.string().min(1);

  const parseResult = tokenSchema.safeParse(token);
  if (!parseResult.success) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center font-bold text-3xl">Reset Password</h1>
      <p>
        Enter your new password below. Make sure it's different from your old
        password.
      </p>
      <Suspense>
        <ResetPasswordForm token={parseResult.data} />
      </Suspense>
      <div className="flex gap-2">
        <p>Remember your password?</p>
        <Link className="underline" href="/auth/login">
          Login
        </Link>
      </div>
    </div>
  );
}
