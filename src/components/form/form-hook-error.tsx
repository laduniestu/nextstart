import { Alert, AlertDescription } from '@/components/ui/alert';

type FormErrorProps = {
  error?: { type?: string | number; message?: string };
};
export const FormHookError = ({ error }: FormErrorProps) => {
  if (!error?.message) return null;
  return (
    <Alert variant="destructive">
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
};
