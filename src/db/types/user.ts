import { createSelectSchema } from 'drizzle-zod';
import type z from 'zod';
import { user } from '../schema';

export const UserSchema = createSelectSchema(user);
export type UserType = z.infer<typeof UserSchema>;
