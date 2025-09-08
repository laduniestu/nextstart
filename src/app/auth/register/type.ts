import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});
// export const RegisterSchemaServer = z.object({
//   name: z.string().min(1, 'Name is required'),
//   email: z.email(),
//   password: z
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

export type RegisterType = z.infer<typeof RegisterSchema>;
