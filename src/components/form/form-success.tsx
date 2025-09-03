import { CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export type FormSuccessProps = {
  success?: {
    code: string | number;
    message: string;
  };
};
export const FormSuccess = ({ success }: FormSuccessProps) => {
  if (!success) return null;
  return (
    <Alert className="bg-emerald-500/20" variant="default">
      <CheckCircle />
      <AlertTitle>{success.code}</AlertTitle>
      <AlertDescription>{success.message}</AlertDescription>
    </Alert>
  );
};
