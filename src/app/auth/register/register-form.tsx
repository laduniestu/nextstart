'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { FormButton } from '@/components/form/form-button';
import { FormError } from '@/components/form/form-error';
import { FormInput } from '@/components/form/form-input';
import { FormPasswordCustom } from '@/components/form/form-password-custom';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth/auth-client';

const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
  email: z.email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    ),
});
type RegisterType = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorForm, setErrorForm] = useState<{
    message: string;
  } | null>(null);

  const form = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(async () => {
      await authClient.signUp.email(
        {
          callbackURL: '/auth/verify-email',
          ...values,
        },
        {
          onError(ctx) {
            setErrorForm({
              message: ctx.error.message,
            });
          },
          onSuccess() {
            router.push(`/auth/verify-email?email=${form.getValues('email')}`);
          },
        }
      );
    });
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormError error={errorForm ?? undefined} />
        <FormInput<RegisterType>
          placeholder="John Doe"
          schema="name"
          title="Name"
        />
        <FormInput<RegisterType>
          placeholder="example@email.com"
          schema="email"
          title="Email"
        />
        <FormPasswordCustom<RegisterType> schema="password" title="Password" />
        <FormButton className="w-full" isLoading={isPending}>
          Register
        </FormButton>
      </form>
    </Form>
  );
}
