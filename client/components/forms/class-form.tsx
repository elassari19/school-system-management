'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import useIntlTranslations from '@/hooks/use-intl-translations';
import FormInput from '../inputs/form-input';
import { classFormSchema, ClassFormType } from '@/lib/zod-schema';
import { createClassQuery, getClassQuery, updateClassQuery } from '@/app/api/academic';
import toast from 'react-hot-toast';

interface Props {
  user?: string;
}

export default function AddClassForm({ user }: Props) {
  const { g } = useIntlTranslations();
  const [classItem, setClassItem] = React.useState<{ id?: string; name?: string }>();

  const getFormData = async () => {
    try {
      if (user) {
        const classData = await getClassQuery(user);
        if (classData) setClassItem(classData);
      }
    } catch (error) {
      toast.error(g('Failed to load form data'));
    }
  };

  React.useEffect(() => {
    getFormData();
  }, [user]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isLoading, isSubmitting, isValid },
  } = useForm<ClassFormType>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: '',
    },
  });

  React.useEffect(() => {
    if (classItem) {
      setValue('name', classItem.name || '');
    }
  }, [classItem, setValue]);

  const onSubmit = async (data: ClassFormType) => {
    try {
      let res;
      if (user) {
        res = await updateClassQuery(data, user);
      } else {
        res = await createClassQuery(data);
      }

      if (res.error) {
        throw new Error(res.error);
      }

      toast.success(
        `${g('Class')} ${data.name} ${
          classItem ? g('updated successfully') : g('created successfully')
        }`
      );

      if (!classItem) {
        reset();
      }
    } catch (error) {
      toast.error(
        `${g('Class')} ${data.name} ${
          classItem ? g('updated failed') : g('created failed')
        }`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <FormInput
        label={g('Class Name')}
        error={errors?.name?.message || ''}
        type="text"
        {...register('name')}
        id="name"
      />

      <div className="sticky bottom-0 right-0 bg-primary pt-4 flex gap-8 items-center justify-between">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting || isLoading}
          isLoading={isLoading}
        >
          {g(user ? 'Update' : 'Add')} {g('Class')}
        </Button>
        <DialogPrimitive.Close>
          <Button disabled={isLoading}>{g('Cancel')}</Button>
        </DialogPrimitive.Close>
      </div>
    </form>
  );
}
