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
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button
            variant="secondary"
            disabled={isPending}
            type="button"
            onClick={() => setIsOpen(false)}
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
