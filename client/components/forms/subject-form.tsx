'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import useIntlTranslations from '@/hooks/use-intl-translations';
import FormInput from '../inputs/form-input';
import { subjectFormSchema, SubjectFormType } from '@/lib/zod-schema';
import { createSubjectQuery, getSubjectQuery, updateSubjectQuery } from '@/app/api/academic';
import toast from 'react-hot-toast';

interface Props {
  user?: string;
}

export default function AddSubjectForm({ user }: Props) {
  const { g } = useIntlTranslations();
  const [subject, setSubject] = React.useState<{ id?: string; name?: string }>();

  const getFormData = async () => {
    try {
      if (user) {
        const subjectData = await getSubjectQuery(user);
        if (subjectData) setSubject(subjectData);
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
  } = useForm<SubjectFormType>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: '',
    },
  });

  React.useEffect(() => {
    if (subject) {
      setValue('name', subject.name || '');
    }
  }, [subject, setValue]);

  const onSubmit = async (data: SubjectFormType) => {
    try {
      let res;
      if (user) {
        res = await updateSubjectQuery(data, user);
      } else {
        res = await createSubjectQuery(data);
      }

      if (res.error) {
        throw new Error(res.error);
      }

      toast.success(
        `${g('Subject')} ${data.name} ${
          subject ? g('updated successfully') : g('created successfully')
        }`
      );

      if (!subject) {
        reset();
      }
    } catch (error) {
      toast.error(
        `${g('Subject')} ${data.name} ${
          subject ? g('updated failed') : g('created failed')
        }`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <FormInput
        label={g('Subject Name')}
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
          {g(user ? 'Update' : 'Add')} {g('Subject')}
        </Button>
        <DialogPrimitive.Close>
          <Button disabled={isLoading}>{g('Cancel')}</Button>
        </DialogPrimitive.Close>
      </div>
    </form>
  );
}
