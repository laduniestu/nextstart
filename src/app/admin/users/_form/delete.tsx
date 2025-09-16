'use client';

import type { Row } from '@tanstack/react-table';
import { Loader, Trash } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { Dialog } from '@/components/ui/dialog';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { actionAdminDeleteUsers } from '@/core/action/user';
import type { UserType } from '@/db/types/user';
import { extractActionError } from '@/lib/safe-action/helper';

interface DeleteUsersDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  users: Row<UserType>['original'][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteUsersModal({
  users,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteUsersDialogProps) {
  const [readMore, setReadMore] = React.useState(false);
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  function onDelete() {
    startDeleteTransition(async () => {
      const res = await actionAdminDeleteUsers(users.map((user) => user.id));
      const error = extractActionError(res);
      if (error) {
        toast.error(error);
      } else {
        props.onOpenChange?.(false);
        const count = res.data!;
        toast.success(
          `Successfully deleted ${count} user${count > 1 ? 's' : ''}.`
        );
        onSuccess?.();
      }
    });
  }

  return (
    <Modal {...props}>
      {showTrigger ? (
        <ModalTrigger asChild>
          <Button size="sm" variant="outline">
            <Trash aria-hidden="true" className="mr-2 size-4" />
            Delete ({users.length})
          </Button>
        </ModalTrigger>
      ) : null}
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Are you absolutely sure?</ModalTitle>
          <ModalDescription>
            This action cannot be undone. This will permanently delete
            {users.length === 1 ? ' this user' : ' those users'} from our
            servers.
          </ModalDescription>
        </ModalHeader>
        <ul className="mt-2 font-medium text-foreground">
          {users.length <= 10 ? (
            users.map((user) => <li key={user.id}>{user.email}</li>)
          ) : (
            <Collapsible onOpenChange={setReadMore} open={readMore}>
              {users.slice(0, 8).map((user) => (
                <li key={user.id}>{user.email}</li>
              ))}

              <CollapsibleContent>
                {users.slice(8).map((user) => (
                  <li key={user.id}>{user.email}</li>
                ))}
              </CollapsibleContent>

              <CollapsibleTrigger asChild>
                <Button className="px-0" variant="link">
                  {readMore
                    ? 'Show less'
                    : `Show more (${users.length - 8} more)`}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          )}
        </ul>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">Cancel</Button>
          </ModalClose>
          <Button
            aria-label="Delete selected rows"
            disabled={isDeletePending}
            onClick={onDelete}
            variant="destructive"
          >
            {isDeletePending && (
              <Loader aria-hidden="true" className="mr-2 size-4 animate-spin" />
            )}
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
