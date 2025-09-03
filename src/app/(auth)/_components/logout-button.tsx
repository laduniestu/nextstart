'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';

export default function LogoutButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  return <Button onClick={handleLogout}>{children}</Button>;
}
