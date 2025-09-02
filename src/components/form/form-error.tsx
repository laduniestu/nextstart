import { ReactNode } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FormErrorProps = {
  error?: {
    code: string | number;
    message: string;
  };
  icon?: ReactNode;
};
export const FormError = ({ error, icon }: FormErrorProps) => {
  if (!error) return null;
  return (
    <Alert variant="destructive">
      {icon}
      <AlertTitle>{error.code}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
};
