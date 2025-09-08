import Link from 'next/link';
import { Suspense } from 'react';
import FormSkeleton from '@/components/form/form-skeleton';
import ForgotPasswordForm from './forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center font-bold text-3xl">Forgot Password</h1>
      <p>
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      <Suspense fallback={<FormSkeleton />}>
        <ForgotPasswordForm />
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
