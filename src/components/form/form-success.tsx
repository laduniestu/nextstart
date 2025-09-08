import { CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type FormSuccessProps = {
  success?: {
    message: string;
  };
  icon?: ReactNode;
};
export const FormSuccess = ({ success, icon }: FormSuccessProps) => {
  if (!success) return null;
  return (
    <Alert className="text-emerald-400" variant="default">
      {icon ?? <CheckCircle2 />}
      <AlertDescription className="text-emerald-400">
        {success.message}
      </AlertDescription>
    </Alert>
  );
};
