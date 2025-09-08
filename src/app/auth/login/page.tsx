import Link from 'next/link';
import { Suspense } from 'react';
import FormSkeleton from '@/components/form/form-skeleton';
import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center font-bold text-3xl">Login</h1>
      <Suspense fallback={<FormSkeleton row={2} />}>
        <LoginForm />
      </Suspense>
      <div className="flex justify-center">
        <Link
          className="text-sm underline-offset-4 hover:underline"
          href="/auth/register"
        >
          Do not have an account?
        </Link>
      </div>
    </div>
  );
}
