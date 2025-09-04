/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { authClient } from '@/lib/auth/auth-client';

export default function VerifyEmailForm({ email }: { email: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);

  const [isPending, startTransition] = useTransition();
  const [otp, setOtp] = useState('');

  const handleResendVerification = () => {
    startTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
      });
    });
  };
  const handleVerifyEmail = () => {
    setError('');
    startTransition(async () => {
      await authClient.emailOtp.verifyEmail(
        { email, otp },
        {
          onSuccess: () => {
            router.push('/app');
          },
          onError: (error) => {
            setError(error.error.message);
          },
        }
      );
      setOtp('');
    });
  };

  useEffect(() => {
    if (otp.length === 6 && !isPending) {
      handleVerifyEmail();
    }
  }, [otp, isPending]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="flex h-40 w-full flex-col items-center space-y-4">
      <InputOTP
        autoFocus
        disabled={isPending}
        maxLength={6}
        onChange={(otp) => setOtp(otp)}
        value={otp}
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
      <p className="flex text-center text-destructive">{error}</p>
      <p className="mt-10">
        If you don't see it, please <b>check your spam folder</b>.
      </p>
      <p className="mt-4">
        Still can't find the email?{' '}
        {countdown > 0 ? (
          `Resend in   ${countdown}`
        ) : (
          <button
            className="cursor-pointer text-blue-500 underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-gray-400"
            disabled={countdown > 0}
            onClick={() => {
              handleResendVerification();
              setCountdown(60);
            }}
            type="button"
          >
            Resend
          </button>
        )}
      </p>
    </div>
  );
}
