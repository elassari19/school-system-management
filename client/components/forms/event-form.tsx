'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import useIntlTranslations from '@/hooks/use-intl-translations';
import FormInput from '../inputs/form-input';
import { eventFormSchema, EventFormType } from '@/lib/zod-schema';
import { createEventQuery, getEventQuery, updateEventQuery } from '@/app/api/events';
import toast from 'react-hot-toast';

interface Props {
  user?: string;
}

const toDateTimeLocal = (value?: string | Date) => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  const pad = (n: number) => `${n}`.padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};

export default function AddEventForm({ user }: Props) {
  const { g } = useIntlTranslations();
  const [event, setEvent] = React.useState<{
    id?: string;
    name?: string;
    date?: string;
    location?: string;
    type?: EventFormType['type'];
    description?: string;
  }>();

  const getFormData = async () => {
    try {
      if (user) {
        const eventData = await getEventQuery(user);
        if (eventData) setEvent(eventData);
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
  } = useForm<EventFormType>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      date: '',
      location: '',
      type: 'School',
      description: '',
    },
  });

  React.useEffect(() => {
    if (event) {
      setValue('name', event.name || '');
      setValue('date', toDateTimeLocal(event.date));
      setValue('location', event.location || '');
      setValue('type', event.type || 'School');
      setValue('description', event.description || '');
    }
  }, [event, setValue]);

  const onSubmit = async (data: EventFormType) => {
    try {
      let res;
      if (user) {
        res = await updateEventQuery(data, user);
      } else {
        res = await createEventQuery(data);
      }

      if (res.error) {
        throw new Error(res.error);
      }

      toast.success(
        `${g('Event')} ${data.name} ${
          event ? g('updated successfully') : g('created successfully')
        }`
      );

      if (!event) {
        reset();
      }
    } catch (error) {
      toast.error(
        `${g('Event')} ${data.name} ${
          event ? g('updated failed') : g('created failed')
        }`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <FormInput
        label={g('Event Name')}
        error={errors?.name?.message || ''}
        type="text"
        {...register('name')}
        id="name"
      />

      <FormInput
        label={g('Date')}
        error={errors?.date?.message || ''}
        type="datetime-local"
        {...register('date')}
        id="date"
      />

      <FormInput
        label={g('Location')}
        error={errors?.location?.message || ''}
        type="text"
        {...register('location')}
        id="location"
      />

      <FormInput
        label={g('Type')}
        error={errors?.type?.message || ''}
        options={[
          { id: 'School', value: g('School') },
          { id: 'Holiday', value: g('Holiday') },
          { id: 'Exam', value: g('Exam') },
          { id: 'Meeting', value: g('Meeting') },
        ]}
        {...register('type')}
        id="type"
      />

      <FormInput
        label={g('Description')}
        error={errors?.description?.message || ''}
        type="text"
        {...register('description')}
        id="description"
      />

      <div className="sticky bottom-0 right-0 bg-primary pt-4 flex gap-8 items-center justify-between">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting || isLoading}
          isLoading={isLoading}
        >
          {g(user ? 'Update' : 'Add')} {g('Event')}
        </Button>
        <DialogPrimitive.Close>
          <Button disabled={isLoading}>{g('Cancel')}</Button>
        </DialogPrimitive.Close>
      </div>
    </form>
  );
}
