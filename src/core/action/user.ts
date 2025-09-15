'use server';
import { APIError } from 'better-auth/api';
import { revalidateTag } from 'next/cache';
import { returnValidationErrors } from 'next-safe-action';
import z from 'zod';
import { adminAction } from '@/lib/safe-action';
import {
  fnAdminCreateUser,
  fnAdminDeleteUsers,
  fnAdminUpdateUsersRoles,
} from '../function/user';
import {
  CreateUserSchema,
  DeleteUseresSchema,
  UpdateUsersRolesSchema,
} from '../validation/user';

export const actionAdminCreateUser = adminAction
  .inputSchema(CreateUserSchema)
  .action(async ({ parsedInput: value }) => {
    try {
      const user = await fnAdminCreateUser(value);
      revalidateTag('users');
      revalidateTag('usersrolecount');
      return { user };
    } catch (ctx) {
      if (ctx instanceof APIError) {
        if (ctx.body?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
          returnValidationErrors(CreateUserSchema, {
            email: {
              _errors: [ctx.message],
            },
          });
        }
        returnValidationErrors(CreateUserSchema, {
          _errors: [ctx.message],
        });
      } else {
        returnValidationErrors(CreateUserSchema, {
          _errors: ['Something went wrong.', 'Please try again later'],
        });
      }
    }
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

export const actionAdminDeleteUsers = adminAction
  .inputSchema(DeleteUseresSchema)
  .outputSchema(z.number())
  .action(async ({ parsedInput: values, ctx }) => {
    const res = await fnAdminDeleteUsers(values, ctx.user.id);
    revalidateTag('users');
    revalidateTag('usersrolecount');
    return res;
  });
