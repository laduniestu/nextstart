'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { FormButton } from '@/components/form/form-button';
import { FormInput } from '@/components/form/form-input';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth/auth-client';

const ChangeNameSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
});
type ChangeNameType = z.infer<typeof ChangeNameSchema>;

export default function ChangeNamePage({ name }: { name: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ChangeNameType>({
    resolver: zodResolver(ChangeNameSchema),
    defaultValues: { name },
  });
  const onSubmit = (values: z.infer<typeof ChangeNameSchema>) => {
    startTransition(async () => {
      await authClient.updateUser(values, {
        onError() {
          toast.error('Failed to update your name');
          form.reset();
        },
        onSuccess() {
          toast.success('Your name has been updated');
          router.refresh();
        },
      });
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 rounded-xl border p-5 shadow-none"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-3">
          <div className="flex flex-col">
            <b className="text-lg">Your Name</b>
            <p className="text-sm">This will be your display name</p>
          </div>
          <FormInput<ChangeNameType>
            placeholder="John Doe"
            schema="name"
            title=""
          />
        </div>

        <div className="flex justify-end">
          <FormButton disabled={!form.formState.isDirty} isLoading={isPending}>
            Save Changes
          </FormButton>
        </div>
      </form>
    </Form>
  );
}
