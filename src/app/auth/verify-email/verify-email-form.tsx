/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
'use client';
import { Loader2Icon } from 'lucide-react';
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
  const [rateLimitVerify, setRateLimitVerify] = useState<number | null>(null);
  const [rateLimitSendOTP, setRateLimitSendOTP] = useState<number | null>(null);

  useEffect(() => {
    const savedVerify = localStorage.getItem('__VhD1LvkgIaduR');
    const savedSendOTP = localStorage.getItem('__9XK53nT0spJHu');
    setRateLimitVerify(savedVerify ? Number(savedVerify) : 0);
    setRateLimitSendOTP(savedSendOTP ? Number(savedSendOTP) : 0);
  }, []);
  const [isPending, startTransition] = useTransition();
  const [otp, setOtp] = useState('');

  const handleResendVerification = () => {
    startTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp(
        {
          email,
          type: 'email-verification',
        },
        {
          onError: (ctx) => {
            const { response } = ctx;
            console.log(response.body);
            if (response.status === 429) {
              const retryAfter = response.headers.get('X-Retry-After');
              setRateLimitSendOTP(Number(retryAfter));
              return;
            }
            if (ctx.error.message) {
              setError(ctx.error.message);
            }
          },
        }
      );
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
          onError: (ctx) => {
            const { response } = ctx;
            console.log(response.body);
            if (response.status === 429) {
              const retryAfter = response.headers.get('X-Retry-After');
              setRateLimitVerify(Number(retryAfter));
              return;
            }
            if (ctx.error.code === 'TOO_MANY_ATTEMPTS') {
              setError(
                'You have exceeded the maximum number of attempts. Please try again later.'
              );
            } else {
              setError(ctx.error.message);
            }
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

  useEffect(() => {
    if (rateLimitVerify && rateLimitVerify > 0) {
      const timer = setTimeout(
        () => setRateLimitVerify(rateLimitVerify - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [rateLimitVerify]);
  useEffect(() => {
    if (rateLimitVerify && rateLimitVerify > 0) {
      localStorage.setItem('__VhD1LvkgIaduR', String(rateLimitVerify));
    } else {
      localStorage.removeItem('__VhD1LvkgIaduR');
    }
    if (rateLimitSendOTP && rateLimitSendOTP > 0) {
      localStorage.setItem('__9XK53nT0spJHu', String(rateLimitSendOTP));
    } else {
      localStorage.removeItem('__9XK53nT0spJHu');
    }
  }, [rateLimitVerify, rateLimitSendOTP]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (rateLimitVerify === null || rateLimitSendOTP === null) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <Loader2Icon className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-40 w-full flex-col items-center space-y-4">
      {rateLimitVerify > 0 || rateLimitSendOTP > 0 ? (
        <p className="flex text-center text-destructive">
          You have exceeded the maximum number of attempts. Please try again in{' '}
          {rateLimitVerify > 0
            ? formatTime(rateLimitVerify)
            : formatTime(rateLimitSendOTP)}
          .
        </p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
