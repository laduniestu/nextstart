import { Suspense } from 'react';
import SettingSkeleton from '@/components/custom/skeleton-setting';
import ChangePasswordPage from './change-password';

export default function SecurityPage() {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<SettingSkeleton row={3} />}>
        <ChangePasswordPage />
      </Suspense>
    </div>
  );
}
