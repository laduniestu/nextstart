'use server';
import { revalidateTag } from 'next/cache';
import z from 'zod';
import { adminAction } from '@/lib/safe-action';
import {
  fnAdminCreateUser,
  fnAdminDeleteUsers,
  fnAdminUpdateUsersEmailVerified,
  fnAdminUpdateUsersRoles,
} from '../function/user';
import {
  CreateUserSchema,
  DeleteUseresSchema,
  UpdateUsersEmailVerifiedSchema,
  UpdateUsersRolesSchema,
} from '../validation/user';

export const actionAdminCreateUser = adminAction
  .inputSchema(CreateUserSchema)
  .action(async ({ parsedInput: value }) => {
    const user = await fnAdminCreateUser(value);
    revalidateTag('users');
    revalidateTag('usersrolecount');
    return { user };
  });
export const actionAdminUpdateUsersRoles = adminAction
  .inputSchema(UpdateUsersRolesSchema)
  .outputSchema(z.number())
  .action(async ({ parsedInput: values, ctx }) => {
    const res = await fnAdminUpdateUsersRoles(values, ctx.user.id);
    revalidateTag('users');
    revalidateTag('usersrolecount');
    return res;
  });

export const actionAdminUpdateUsersEmailVerified = adminAction
  .inputSchema(UpdateUsersEmailVerifiedSchema)
  .outputSchema(z.number())
  .action(async ({ parsedInput: values, ctx }) => {
    const res = await fnAdminUpdateUsersEmailVerified(values, ctx.user.id);
    revalidateTag('users');
    revalidateTag('usersrolecount');
    return res;
  });

export const actionAdminDeleteUsers = adminAction
  .inputSchema(DeleteUseresSchema)
  .outputSchema(z.number())
  .action(async ({ parsedInput: values, ctx }) => {
    const res = await fnAdminDeleteUsers(values, ctx.user.id);
    revalidateTag('users');
    revalidateTag('usersrolecount');
    return res;
  });
