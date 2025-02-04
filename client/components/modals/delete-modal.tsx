'use client';

import { useTransition } from 'react';
import { Button } from '../ui/button';
import useIntlTranslations from '@/hooks/use-intl-translations';
import * as DialogPrimitive from '@radix-ui/react-dialog';

interface DeleteModalProps {
  itemName: string;
  handleSubmit: () => void;
}

const DeleteModal = ({ itemName, handleSubmit }: DeleteModalProps) => {
  const { g } = useIntlTranslations();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      handleSubmit();
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <p className="text-center">
        {g('Are you sure you want to delete')} {itemName}?
      </p>
      <div className="flex justify-end gap-2">
        <DialogPrimitive.Close>
          <Button variant="outline" disabled={isPending}>
            {g('Cancel')}
          </Button>
        </DialogPrimitive.Close>
        <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
          {g('Delete')}
        </Button>
      </div>
    </div>
  );
};

export default DeleteModal;
