'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { FormButton } from '@/components/form/form-button';
import { FormPassword } from '@/components/form/form-password';
import { FormPasswordCustom } from '@/components/form/form-password-custom';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth/auth-client';

const ChangePasswordSchema = z
  .object({
    revokeOtherSessions: z.boolean().optional(),
    currentPassword: z
      .string()
      .min(1, { message: 'Current password is required' }),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[0-9]/, 'New password must contain at least one number')
      .max(100, 'New password must be less than 100 characters')
      .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
      .regex(
        /[^A-Za-z0-9]/,
        'New password must contain at least one special character'
      ),
    confirmNewPassword: z
      .string()
      .min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });
type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ChangePasswordType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      revokeOtherSessions: false,
      confirmNewPassword: '',
      currentPassword: '',
      newPassword: '',
    },
  });
  const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    startTransition(async () => {
      await authClient.changePassword(values, {
        onError(ctx) {
          toast.error(ctx.error.message);
        },
        onSuccess() {
          toast.success('Your name has been updated');
          router.refresh();
        },
      });
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 rounded-xl border p-5 shadow-none"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-3">
          <div className="flex flex-col pb-4">
            <b className="text-lg">Change Password</b>
            <p className="text-sm">Change your log in password</p>
          </div>
          <FormPassword<ChangePasswordType>
            schema="currentPassword"
            title="Current Password"
          />
          <FormPasswordCustom<ChangePasswordType>
            schema="newPassword"
            title="New Password"
          />
          <FormPassword<ChangePasswordType>
            schema="confirmNewPassword"
            title="Confirm New Password"
          />
        </div>

        <div className="flex justify-end">
          <FormButton disabled={!form.formState.isDirty} isLoading={isPending}>
            Save Changes
          </FormButton>
        </div>
      </form>
    </Form>
  );
}
