import { z } from 'zod';

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, {
      message:
        'Invalid token. Please use the password reset link sent to your email.',
    }),
    newPassword: z.string().min(1, { message: 'New password is required' }),
    confirmNewPassword: z
      .string()
      .min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });
// export const ResetPasswordSchemaServer = z.object({
//   token: z.string().min(1, {
//     message:
//       'Invalid token. Please use the password reset link sent to your email.',
//   }),
//   newPassword: z
//     .string()
//     .min(8, 'At least 8 characters')
//     .refine((val) => /[0-9]/.test(val), {
//       message: 'At least 1 number',
//     })
//     .refine((val) => /[a-z]/.test(val), {
//       message: 'At least 1 lowercase letter',
//     })
//     .refine((val) => /[A-Z]/.test(val), {
//       message: 'At least 1 uppercase letter',
//     }),
// });

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
