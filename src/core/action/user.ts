'use server';
import { APIError } from 'better-auth/api';
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
// import { schemaGetUsers } from '@/app/admin/users/_table/validation';
// import { adminAction } from '@/lib/safe-action';
// import { fnGetUsers, fnGetUsersRoles } from '../function/user';

// export const actionGetUsers = adminAction
//   .inputSchema(schemaGetUsers)
//   .action(async ({ parsedInput: input }) => {
//     // @ts-expect-error Zod validation cant match with nuqs validation
//     return await fnGetUsers(input);
//   });

// export const actionGetUsersRoles = adminAction.action(async () => {
//   return await fnGetUsersRoles();
// });

export const actionAdminCreateUser = adminAction
  .inputSchema(CreateUserSchema)
  .action(async ({ parsedInput: value }) => {
    try {
      const user = await fnAdminCreateUser(value);
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
    return await fnAdminUpdateUsersRoles(values, ctx.user.id);
  });

export const actionAdminDeleteUsers = adminAction
  .inputSchema(DeleteUseresSchema)
  .outputSchema(z.number())
  .action(async ({ parsedInput: values, ctx }) => {
    return await fnAdminDeleteUsers(values, ctx.user.id);
  });
