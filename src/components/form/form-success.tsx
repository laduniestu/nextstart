import { ReactNode } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

export type FormSuccessProps = {
  success?: {
    code: string | number;
    message: string;
  };
};
export const FormSuccess = ({ success }: FormSuccessProps) => {
  if (!success) return null;
  return (
    <Alert variant="default" className="bg-emerald-500/20">
      <CheckCircle />
      <AlertTitle>{success.code}</AlertTitle>
      <AlertDescription>{success.message}</AlertDescription>
    </Alert>
  );
};
