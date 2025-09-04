import { Suspense } from 'react';
import VerifyEmailForm from './verify-email-form';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
