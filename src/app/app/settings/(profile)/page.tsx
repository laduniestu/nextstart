import { Suspense } from 'react';
import SettingSkeleton from '@/components/custom/skeleton-setting';
import { getServerSessionRedirect } from '@/lib/auth/helpers/get-session';
import ChangeNamePage from './change-name';

export default async function ProfilePage() {
  const session = await getServerSessionRedirect();
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<SettingSkeleton />}>
        <ChangeNamePage name={session.user.name} />
      </Suspense>
    </div>
  );
}
