'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import useIntlTranslations from '@/hooks/use-intl-translations';
import FormInput from '../inputs/form-input';
import { studentFormSchema, StudentFormType } from '@/lib/zod-schema';
import { getData, getFirstData, createData, updateData } from '@/app/api/services';
import toast from 'react-hot-toast';
import {
  createUserQuery,
  getClassesQuery,
  getParentsQuery,
  getUserQuery,
  updateUserQuery,
} from '@/app/api/academic';

interface Props {
  user?: string;
}

export default function StudentForm({ user }: Props) {
  const { g } = useIntlTranslations();
  const [classes, setClasses] = React.useState<any[]>([]);
  const [parents, setParents] = React.useState<any[]>([]);
  const [student, setStudent] = React.useState<any>();

  const getFormData = async () => {
    try {
      const [parentData, classesData, studentData] = await Promise.all([
        getParentsQuery(),
        getClassesQuery(),
        user ? getUserQuery(user) : null,
      ]);

      setParents(parentData);
      setClasses(classesData);
      if (studentData) setStudent(studentData);
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
  } = useForm<StudentFormType>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      role: 'STUDENT',
    },
  });

  React.useEffect(() => {
    if (student) {
      setValue('email', student.email || '');
      setValue('fullname', student.fullname || '');
      setValue('phone', student.phone || '');
      setValue('password', '');
      setValue('role', student.role || '');
      setValue('age', student.age?.toString() || '');
      setValue('gender', student.gender || '');
      setValue('address', student.address || '');
      setValue('image', student.image || '');
      setValue('parent', student.student[0].parent?.id || '');
      setValue('_class', student.student[0].class?.id || '');
    }
  }, [student, setValue]);

  const onSubmit = async (data: StudentFormType) => {
    try {
      let res;
      if (user) {
        res = await updateUserQuery(data, user, student.student[0].id);
      } else {
        res = await createUserQuery(data);
      }

      if (res.error) {
        throw new Error(res.error);
      }

      toast.success(
        `${g('Student')} ${data.fullname} ${
          student ? g('updated successfully') : g('created successfully')
        }`
      );

      if (!student) {
        reset();
      }
    } catch (error) {
      toast.error(
        `${g('Student')} ${data.fullname} ${
          student ? g('updated failed') : g('created failed')
        }`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <FormInput
        label={`${g('Full Name')}`}
        error={errors?.fullname?.message || ''}
        type="text"
        {...register('fullname')}
        id="fullname"
      />

      <FormInput
        label={`${g('Parents')} ${g('Name')}`}
        error={errors?.parent?.message || ''}
        options={parents?.map((p) => ({ id: p.parent[0].id, value: p.fullname })) || []}
        {...register('parent')}
        id="parentName"
      />

      <FormInput
        label={g('Age')}
        error={errors?.age?.message || ''}
        type="text"
        {...register('age')}
        id="age"
      />

      <FormInput
        label={g('Email')}
        error={errors?.email?.message || ''}
        type="text"
        {...register('email')}
        id="email"
      />

      <FormInput
        label={g('Password')}
        error={errors?.password?.message || ''}
        type="password"
        {...register('password')}
        id="password"
      />

      <FormInput
        label={g('Phone')}
        error={errors?.phone?.message || ''}
        type="phone"
        {...register('phone')}
        id="phone"
      />

      <FormInput
        label={g('Role')}
        error={errors?.role?.message || ''}
        type="text"
        value={'STUDENT'}
        {...register('role')}
        id="role"
      />

      <FormInput
        label={g('Gender')}
        error={errors?.gender?.message || ''}
        options={[
          { id: 'male', value: 'Male' },
          { id: 'female', value: 'Female' },
        ]}
        {...register('gender')}
        id="gender"
      />

      <FormInput
        label={g('Image')}
        error={errors?.image?.message || ''}
        type="url"
        {...register('image')}
        id="image"
      />

      <FormInput
        label={g('Address')}
        error={errors?.address?.message || ''}
        type="address"
        {...register('address')}
        id="address"
      />

      <FormInput
        label={g('Class')}
        error={errors?._class?.message || ''}
        options={classes?.map((c) => ({ id: c.id, value: c.name })) || []}
        {...register('_class')}
        id="_class"
      />

      <div className="sticky bottom-0 right-0 bg-primary pt-4 flex gap-8 items-center justify-between">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting || isLoading}
          isLoading={isLoading}
        >
          {g(user ? 'Update' : 'Add')} {g('Student')}
        </Button>
        <DialogPrimitive.Close>
          <Button disabled={isLoading}>{g('Cancel')}</Button>
        </DialogPrimitive.Close>
      </div>
    </form>
  );
}
