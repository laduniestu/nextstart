'use server';
import 'server-only';
import { revalidateTag, unstable_cache } from 'next/cache';
import type { GetUserTableSchema } from '@/app/admin/users/_table/validation';
import type { UserType } from '@/db/types/user';
import { auth } from '@/lib/auth/auth-server';
import { SystemError } from '@/lib/safe-action';
import {
  checkUserIdsExist,
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
    ['users-role-count'],
    { revalidate: 60 * 60, tags: ['users-role-count'] }
  )();
}

export async function fnAdminCreateUser(value: CreateUserType) {
  const user = await auth.api.createUser({
    body: {
      ...value,
      data: { emailVerified: value.emailVerified },
    },
  });
  revalidateTag('users');
  revalidateTag('users-role-count');
  return user;
}

export async function fnAdminUpdateUsersRoles(values: UpdateUsersRolesType) {
  const result = await checkUserIdsExist(values.id);
  if (!result.exists) {
    throw new SystemError('Some IDs were not found in the database');
  }
  const resultCount = await updateUsersRoles(values);
  revalidateTag('users');
  revalidateTag('users-role-count');
  return resultCount;
}

export async function fnAdminDeleteUsers(values: DeleteUseresType) {
  const result = await checkUserIdsExist(values);
  if (!result.exists) {
    throw new SystemError('Some IDs were not found in the database');
  }
  const resultCount = await deleteUsers(values);
  revalidateTag('users');
  revalidateTag('users-role-count');
  return resultCount;
}
