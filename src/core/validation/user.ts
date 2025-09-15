import z from 'zod';
import { UserRoleEnum } from '@/db/types/user';

export const CreateUserSchema = z.object({
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
  role: z.enum(UserRoleEnum),
  emailVerified: z.boolean(),
});
export type CreateUserType = z.infer<typeof CreateUserSchema>;

export const UpdateUsersRolesSchema = z.object({
  id: z.array(z.string().min(1)).min(1),
  role: z.enum(UserRoleEnum),
});
export type UpdateUsersRolesType = z.infer<typeof UpdateUsersRolesSchema>;

export const DeleteUseresSchema = z.array(z.string().min(1)).min(1);

export type DeleteUseresType = z.infer<typeof DeleteUseresSchema>;
