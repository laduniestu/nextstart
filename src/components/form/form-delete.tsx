'use client';

import { FormButton } from '@/components/form/form-button';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';

export function FormDelete({
  onConfirm,
  description,
  title,
  isOpen,
  setIsOpen,
  confirmText = 'Delete',
  isPending,
}: {
  onConfirm: () => void;
  description: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  confirmText?: string;
  isPending: boolean;
}) {
  return (
    <Modal onOpenChange={setIsOpen} open={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button
            disabled={isPending}
            onClick={() => setIsOpen(false)}
            type="button"
            variant="secondary"
          >
            Cancel
          </Button>
          <FormButton isLoading={isPending} onClick={onConfirm}>
            {confirmText}
          </FormButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
