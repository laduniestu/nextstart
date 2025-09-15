'use server';
import 'server-only';
import { APIError } from 'better-auth';
import { unstable_cache } from 'next/cache';
import { returnValidationErrors } from 'next-safe-action';
import {
  type GetUserTableSchema,
  schemaGetUsers,
} from '@/app/admin/users/_table/validation';
import type { UserType } from '@/db/types/user';
import { auth } from '@/lib/auth/auth-server';
import { SystemError } from '@/lib/safe-action';
import {
  deleteUsers,
  getUsers,
  getUsersEmailVerified,
  getUsersRoles,
  updateUsersRoles,
} from '../data/user';
import {
  CreateUserSchema,
  type CreateUserType,
  type DeleteUseresType,
  type UpdateUsersRolesType,
} from '../validation/user';

export async function fnGetUsers(input: GetUserTableSchema) {
  return unstable_cache(
    async () => {
      try {
        schemaGetUsers.parse(input);
        return await getUsers(input);
      } catch {
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    { revalidate: 60 * 60, tags: ['users'] }
  )();
}

export async function fnGetUsersRoles() {
  return unstable_cache(
    async () => {
      try {
        return await getUsersRoles();
      } catch {
        return {} as Record<UserType['role'], number>;
      }
    },
    ['usersrolecount'],
    { revalidate: 60 * 60, tags: ['usersrolecount'] }
  )();
}

export async function fnUsersEmailVerified() {
  return unstable_cache(
    async () => {
      try {
        return await getUsersEmailVerified();
      } catch {
        return {} as Record<'verified' | 'unverified', number>;
      }
    },
    ['usersemailverifiedcount'],
    { revalidate: 60 * 60, tags: ['usersemailverifiedcount'] }
  )();
}

export async function fnAdminCreateUser(value: CreateUserType) {
  try {
    return await auth.api.createUser({
      body: {
        ...value,
        data: { emailVerified: value.emailVerified },
      },
    });
  } catch (ctx) {
    if (ctx instanceof APIError) {
      if (ctx.body?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
        returnValidationErrors(CreateUserSchema, {
          email: {
            _errors: [ctx.message],
          },
        });
      }
      throw new SystemError(ctx.message);
    }
    throw new SystemError('Something went wrong. Please try again later');
  }
}

export async function fnAdminUpdateUsersRoles(
  values: UpdateUsersRolesType,
  id: UserType['id']
) {
  if (values.id.length === 0) {
    throw new SystemError('No IDs provided.');
  }
  if (values.id.includes(id)) {
    throw new SystemError('You cannot delete your own account.');
  }
  return await updateUsersRoles(values);
}

export async function fnAdminDeleteUsers(
  values: DeleteUseresType,
  id: UserType['id']
) {
  if (values.length === 0) {
    throw new SystemError('No IDs provided.');
  }
  if (values.includes(id)) {
    throw new SystemError('You cannot delete your own account.');
  }
  return await deleteUsers(values);
}
