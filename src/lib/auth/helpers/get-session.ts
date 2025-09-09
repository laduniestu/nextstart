import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { LOGIN_URL } from '@/config';
import { auth } from '../auth-server';

export const getServerSession = cache(async () => {
  console.log('getServerSession');
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return redirect(LOGIN_URL);
  }
  return session;
});

export const getServerSessionAdmin = cache(async () => {
  console.log('getServerSession');
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return redirect(LOGIN_URL);
  }
  if (session.user.role !== 'admin') {
    return redirect('/app');
  }
  return session;
});
