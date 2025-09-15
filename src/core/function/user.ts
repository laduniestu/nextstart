'use server';
import 'server-only';
import { unstable_cache } from 'next/cache';
import type { GetUserTableSchema } from '@/app/admin/users/_table/validation';
import type { UserType } from '@/db/types/user';
import { auth } from '@/lib/auth/auth-server';
import { SystemError } from '@/lib/safe-action';
import {
  deleteUsers,
  getUsers,
  getUsersRoles,
  updateUsersRoles,
} from '../data/user';
import type {
  CreateUserType,
  DeleteUseresType,
  UpdateUsersRolesType,
} from '../validation/user';

export async function fnGetUsers(input: GetUserTableSchema) {
  return unstable_cache(
    async () => {
      try {
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

export async function fnAdminCreateUser(value: CreateUserType) {
  return await auth.api.createUser({
    body: {
      ...value,
      data: { emailVerified: value.emailVerified },
    },
  });
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
