'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormActionErrorMapper } from '@next-safe-action/adapter-react-hook-form/hooks';
import { CircleQuestionMarkIcon, UserIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormButton } from '@/components/form/form-button';
import { FormCheckbox } from '@/components/form/form-checkbox';
import { FormHookError } from '@/components/form/form-hook-error';
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

  const action = useAction(actionAdminCreateUser, {
    onExecute() {
      setPending(true);
    },
    onSettled() {
      setPending(false);
    },
    onSuccess(ctx) {
      setIsOpen(false);
      form.reset();
      toast.success(`Success creating user ${ctx.data.user.user.name}`);
    },
  });

  const { hookFormValidationErrors } = useHookFormActionErrorMapper<
    typeof CreateUserSchema
  >(action.result.validationErrors, { joinBy: '\n' });

  const form = useForm<CreateUserType>({
    resolver: zodResolver(CreateUserSchema),
    errors: hookFormValidationErrors,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      emailVerified: false,
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
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(action.executeAsync)}
          >
            <FormHookError error={form.formState.errors.root} />
            {/* <div className="flex w-full items-center justify-center">
              <Image
                src={form.getValues('image') ?? ''}
                alt="Profile Image"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div> */}
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
              placeholder="hello@ppi.id"
              schema="email"
              title="Email"
            />
            {/* Custom password field with generate button */}

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
