import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { LOGIN_URL } from '@/config';
import { auth } from '../auth-server';

export const getServerSession = cache(async () => {
  console.log('getServerSession');
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
});

export const getServerSessionRedirect = cache(async () => {
  const session = await getServerSession()
  if (!session) {
    return redirect(LOGIN_URL);
  }
  return session;
});

export const getServerSessionAdminRedirect = cache(async () => {
  const session = await getServerSession()
  if (!session || session.user.role !== 'admin') {
    return redirect(LOGIN_URL);
  }
  return session;
});
