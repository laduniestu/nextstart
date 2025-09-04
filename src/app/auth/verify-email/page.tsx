import { Loader2Icon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import z from 'zod';
import VerifyEmailForm from './verify-email-form';

export default async function VerifyEmailPage(
  props: PageProps<'/auth/verify-email'>
) {
  const { email } = await props.searchParams;

  const emailSchema = z.email();

  const parseResult = emailSchema.safeParse(email);
  if (!parseResult.success) {
    notFound();
  }
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-center font-bold text-3xl">Verify Your Email</h1>
      <p className="mt-10">You're almost there! We sent an email to</p>
      <b className="mb-10">{email}</b>
      <Suspense
        fallback={
          <div className="flex h-40 w-full items-center justify-center">
            <Loader2Icon className="h-6 w-6 animate-spin" />
          </div>
        }
      >
        <VerifyEmailForm email={parseResult.data} />
      </Suspense>
    </div>
  );
}
