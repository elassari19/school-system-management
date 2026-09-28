'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import useIntlTranslations from '@/hooks/use-intl-translations';
import FormInput from '../inputs/form-input';
import { StaffFormType, staffFormSchema } from '@/lib/zod-schema';
import toast from 'react-hot-toast';
import { createStaffQuery, getStaffDetailsQuery, updateStaffQuery } from '@/app/api/administration';

interface Props {
  user?: string;
  actionLabel?: string;
  staffRole?: 'ADMIN' | 'PARENT';
}

interface StaffRecord {
  id?: string;
  fullname?: string;
  email?: string;
  phone?: string;
  role?: 'ADMIN' | 'PARENT' | 'TEACHER' | 'STUDENT';
  age?: number | string;
  gender?: string;
  address?: string;
  salary?: number | string;
  image?: string;
}

export default function StaffForm({
  user,
  actionLabel = 'Staff',
  staffRole = 'ADMIN',
}: Props) {
  const { g } = useIntlTranslations();
  const [staff, setStaff] = React.useState<StaffRecord>();

  const getFormData = async () => {
    try {
      if (user) {
        const staffData = await getStaffDetailsQuery(user);
        setStaff(staffData);
      }
    } catch (error) {
      toast.error(g('Failed to load form data'));
    }
  };

  React.useEffect(() => {
    getFormData();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormType>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      role: staffRole,
    },
  });

  React.useEffect(() => {
    if (staff) {
      setValue('fullname', staff.fullname || '');
      setValue('email', staff.email || '');
      setValue('phone', staff.phone || '');
      setValue('password', '');
      setValue('role', (staff.role === 'PARENT' ? 'PARENT' : staffRole) as 'ADMIN' | 'PARENT');
      setValue('age', staff.age?.toString() || '');
      setValue('gender', (staff.gender || '').toLowerCase() as 'male' | 'female');
      setValue('address', staff.address || '');
      setValue('salary', staff.salary?.toString() || '');
    }
  }, [staff, setValue, staffRole]);

  const onSubmit = async (data: StaffFormType) => {
    if (!user && !data.password) {
      toast.error(`${g('Password')} ${g('is required')}`);
      return;
    }

    try {
      const res = user ? await updateStaffQuery(data, user) : await createStaffQuery(data);

      if (res?.error) throw new Error(res.error);

      toast.success(
        `${g(actionLabel)} ${data.fullname} ${
          staff ? g('updated successfully') : g('created successfully')
        }`
      );

      if (!user) reset();
    } catch (error) {
      toast.error(
        `${g(actionLabel)} ${data.fullname} ${
          user ? g('updated failed') : g('created failed')
        }`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 h-full">
      <FormInput
        label={g('Full Name')}
        error={errors?.fullname?.message || ''}
        type="text"
        {...register('fullname')}
        id="fullname"
      />

      <FormInput
        label={g('Email')}
        error={errors?.email?.message || ''}
        type="text"
        {...register('email')}
        id="email"
      />

      <FormInput
        label={g('Phone')}
        error={errors?.phone?.message || ''}
        type="tel"
        {...register('phone')}
        id="phone"
      />

      <FormInput
        label={g('Age')}
        error={errors?.age?.message || ''}
        type="text"
        {...register('age')}
        id="age"
      />

      {!user && (
        <FormInput
          label={g('Password')}
          error={errors?.password?.message || ''}
          type="password"
          {...register('password')}
          id="password"
        />
      )}

      <FormInput
        label={g('Address')}
        error={errors?.address?.message || ''}
        type="text"
        {...register('address')}
        id="address"
      />

      <FormInput
        label={g('Gender')}
        options={[
          { id: 'male', value: g('Male') },
          { id: 'female', value: g('Female') },
        ]}
        error={errors?.gender?.message || ''}
        {...register('gender')}
        id="gender"
      />

      <FormInput
        label={g('Salary')}
        error={errors?.salary?.message || ''}
        type="text"
        {...register('salary')}
        id="salary"
      />

      <div className="sticky bottom-0 right-0 bg-primary pt-4 flex gap-8 items-center justify-between">
        <Button type="submit" disabled={isSubmitting}>
          {user ? g('Update') : g('Add')} {g(actionLabel)}
        </Button>
        <DialogPrimitive.Close>
          <Button type="button" variant="secondary">
            {g('Cancel')}
          </Button>
        </DialogPrimitive.Close>
      </div>
    </form>
  );
}
