'use client';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { z } from 'zod';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { authClient } from '@/lib/auth/auth-client';

export default function VerifyEmailForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState('');
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');

  const emailSchema = z.email();

  const parseResult = emailSchema.safeParse(emailParam);
  if (!parseResult.success) {
    notFound();
  }
  const email = parseResult.data;

  // const handleResendVerification = () => {
  //   startTransition(async () => {
  //     await authClient.sendVerificationEmail({
  //       email: email as string,
  //       callbackURL: '/auth/verify-email',
  //     });
  //   });
  // };
  const handleVerifyEmail = () => {
    startTransition(async () => {
      await authClient.emailOtp.verifyEmail(
        {
          email: email as string,
          otp: value,
        },
        {
          onSuccess: () => {
            router.push('/app');
          },
          onError: (error) => {
            console.log(error.error.message);
          },
        }
      );
      setValue('');
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (value.length === 6 && !isPending) {
      handleVerifyEmail();
    }
  }, [value, isPending]);

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-center font-bold text-3xl">Verify Your Email</h1>
      <p className="mt-10">You're almost there! We sent an email to</p>
      <b className="mb-10">{email}</b>
      {isPending ? (
        <p>Verifying...</p>
      ) : (
        <InputOTP
          maxLength={6}
          onChange={(value) => setValue(value)}
          value={value}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={4} />
          </InputOTPGroup>
          <InputOTPGroup>
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      )}
      <p className="mt-8">
        If you don't see it, please <b>check your spam folder</b>.
      </p>
      <p className="mt-8 mb-4">Still cant find the email?</p>
    </div>
  );
}
