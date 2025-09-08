import Link from 'next/link';
import { Suspense } from 'react';
import FormSkeleton from '@/components/form/form-skeleton';
import { LOGIN_URL } from '@/config';
import RegisterForm from './register-form';

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-center font-bold text-3xl">Register</h1>
      <Suspense fallback={<FormSkeleton row={3} />}>
        <RegisterForm />
      </Suspense>
      <div className="flex justify-center">
        <Link
          className="text-sm underline-offset-4 hover:underline"
          href={LOGIN_URL}
        >
          Already have an account?
        </Link>
      </div>
    </div>
  );
}
