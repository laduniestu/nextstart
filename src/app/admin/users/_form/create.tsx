'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { CircleQuestionMarkIcon, UserIcon } from 'lucide-react';
import { DEFAULT_SERVER_ERROR_MESSAGE } from 'next-safe-action';
import { useState } from 'react';
import { toast } from 'sonner';
import { FormButton } from '@/components/form/form-button';
import { FormCheckbox } from '@/components/form/form-checkbox';
import { FormError } from '@/components/form/form-error';
import { FormInput } from '@/components/form/form-input';
import { FormPasswordCustom } from '@/components/form/form-password-custom';
import { FormSelect } from '@/components/form/form-select';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { Separator } from '@/components/ui/separator';
import { actionAdminCreateUser } from '@/core/action/user';
import { CreateUserSchema, type CreateUserType } from '@/core/validation/user';
import { UserRoleEnum } from '@/db/types/user';

export default function CreateUserPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<{
    message: string;
  } | null>(null);

  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(actionAdminCreateUser, zodResolver(CreateUserSchema), {
      actionProps: {
        onExecute() {
          setError(null);
          setPending(true);
        },
        onSettled() {
          setPending(false);
        },
        onSuccess(ctx) {
          setIsOpen(false);
          toast.success(`Success creating user ${ctx.data.user.user.name}`);
          resetFormAndAction();
        },
        onError(ctx) {
          if (ctx.error.serverError) {
            setError({
              message: ctx.error.serverError ?? DEFAULT_SERVER_ERROR_MESSAGE,
            });
          }
        },
      },
      formProps: {
        defaultValues: {
          name: '',
          email: '',
          password: '',
          role: 'user',
          emailVerified: false,
        },
        mode: 'onChange',
      },
      errorMapProps: {
        joinBy: '/n',
      },
    });

  return (
    <Modal onOpenChange={setIsOpen} open={isOpen}>
      <ModalTrigger asChild>
        <Button size="sm">
          <UserIcon aria-hidden="true" className="mr-2 size-4" />
          Create
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create User</ModalTitle>
          <ModalDescription>Fill this form below</ModalDescription>
        </ModalHeader>
        <Separator />
        <Form {...form}>
          <form className="space-y-4" onSubmit={handleSubmitWithAction}>
            <FormError error={error ?? undefined} />
            <FormSelect<CreateUserType>
              options={UserRoleEnum.map((role) => ({
                label: role.toLocaleUpperCase(),
                value: role,
              }))}
              placeholder="Select a role"
              schema="role"
              title="Role"
            />
            <FormInput<CreateUserType>
              placeholder="John Doe"
              schema="name"
              title="Name"
            />
            <FormInput<CreateUserType>
              placeholder="example@email.com"
              schema="email"
              title="Email"
            />
            <FormPasswordCustom<CreateUserType>
              schema="password"
              title="Password"
            />

            <div className="flex items-center space-x-2">
              <FormCheckbox<CreateUserType>
                schema="emailVerified"
                title="Auto verified email"
              />
              <HoverCard>
                <HoverCardTrigger>
                  <CircleQuestionMarkIcon className="h-4 w-4" />
                </HoverCardTrigger>
                <HoverCardContent>
                  Checking this will automatically <b>verify</b> the user.
                </HoverCardContent>
              </HoverCard>
            </div>

            <ModalFooter>
              <Button
                disabled={isPending || !form.formState.isDirty}
                onClick={() => form.reset()}
                type="button"
                variant="secondary"
              >
                Reset
              </Button>
              <FormButton isLoading={isPending}>Create</FormButton>
            </ModalFooter>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
}
