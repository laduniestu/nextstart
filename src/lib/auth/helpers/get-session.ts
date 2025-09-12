import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { LOGIN_URL } from '@/config';
import { auth } from '../auth-server';

export const getServerSession = cache(async () => {
  console.log('checking session');
  return await auth.api.getSession({ headers: await headers() });
});

export const getServerSessionRedirect = cache(async () => {
  const session = await getServerSession();
  if (!session) {
    return redirect(LOGIN_URL);
  }
  return session;
});

export const getServerSessionAdminRedirect = cache(async () => {
  const session = await getServerSessionRedirect();
  if (session.user.role !== 'admin') {
    return redirect('/app');
  }
  return session;
});
