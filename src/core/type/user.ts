import { createSelectSchema } from 'drizzle-zod';
import type z from 'zod';
import { user } from '@/db/schema';

//__________  READ  USER __________
export const UserSchema = createSelectSchema(user);
export type UserType = z.infer<typeof UserSchema>;

export type UserId = UserType['id'];
