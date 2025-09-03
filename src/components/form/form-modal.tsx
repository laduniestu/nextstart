'use client';

import {
  createContext,
  type MutableRefObject,
  type ReactNode,
  useRef,
} from 'react';

import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { Separator } from '@/components/ui/separator';

type ToggleContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  preventCloseRef: MutableRefObject<boolean>;
};

export const ToggleContext = createContext<ToggleContextType>({
  isOpen: false,
  setIsOpen: () => {
    // noop
  },
  preventCloseRef: { current: false },
});

export function FormModal({
  isOpen,
  setIsOpen,
  title,
  description,
  form,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  form: ReactNode;
  title: string;
  description?: string;
}) {
  const preventCloseRef = useRef(false);

  return (
    <ToggleContext.Provider
      value={{
        isOpen,
        setIsOpen,
        preventCloseRef,
      }}
    >
      <Modal
        onOpenChange={(value) => {
          if (preventCloseRef.current) return;
          setIsOpen(value);
        }}
        open={isOpen}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <ModalDescription>{description}</ModalDescription>
          </ModalHeader>
          <Separator />
          {form}
        </ModalContent>
      </Modal>
    </ToggleContext.Provider>
  );
}
