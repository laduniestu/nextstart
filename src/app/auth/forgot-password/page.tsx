import Link from 'next/link';
import { Suspense } from 'react';
import ForgotPasswordForm from './forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center font-bold text-3xl">Forgot Password</h1>
      <p>
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      <Suspense>
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
