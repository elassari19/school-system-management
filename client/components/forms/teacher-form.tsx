'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import useIntlTranslations from '@/hooks/use-intl-translations';
import FormInput from '../inputs/form-input';
import { SubjectType, teacherFormSchema, TeacherFormType } from '@/lib/zod-schema';
import toast from 'react-hot-toast';
import {
  createTeacherQuery,
  getTeacherDetailsQuery,
  getTeacherSubjectsQuery,
  updateTeacherQuery,
} from '@/app/api/academic';

interface Props {
  user?: string;
}

export default function TeacherForm({ user }: Props) {
  const { g } = useIntlTranslations();
  const [subjects, setSubjects] = React.useState<SubjectType[]>([]);
  const [teacher, setTeacher] = React.useState<any>();

  const getFormData = async () => {
    const subject = await getTeacherSubjectsQuery();
    if (subject) {
      setSubjects(subject);
    }
    const teacher = await getTeacherDetailsQuery(user!);
    if (teacher) setTeacher(teacher);
  };

  React.useEffect(() => {
    if (user) {
      getFormData();
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isLoading, isSubmitting, isValid },
  } = useForm<TeacherFormType>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      role: 'TEACHER',
    },
  });

  React.useEffect(() => {
    if (teacher) {
      setValue('email', teacher.email || '');
      setValue('fullname', teacher.fullname || '');
      setValue('phone', teacher.phone || '');
      setValue('password', teacher.password || '');
      setValue('role', teacher.role || '');
      setValue('age', teacher.age?.toString() || '');
      setValue('gender', teacher.gender || '');
      setValue('address', teacher.address || '');
      setValue('salary', teacher.salary?.toString() || '');
      setValue('subject', teacher.teacher[0].subject?.id || '');
    }
  }, [teacher, setValue]);

  const onSubmit = async (data: TeacherFormType) => {
    try {
      let res;
      if (user) {
        res = await updateTeacherQuery(data, user, teacher.teacher[0].id);
      } else {
        res = await createTeacherQuery(data);
      }

      if (res.error) {
        throw new Error(res.error);
      }

      toast.success(
        `${g('Teacher')} ${data.fullname} ${
          teacher ? g('updated successfully') : g('created successfully')
        }`
      );

      if (!teacher) {
        reset();
      }
    } catch (error) {
      toast.error(
        `${g('Teacher')} ${data.fullname} ${
          teacher ? g('updated failed') : g('created failed')
        }`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 h-full">
      <FormInput
        label={`${g('Full Name')}`}
        error={errors?.fullname?.message || ''}
        type="text"
        {...register('fullname')}
        id="fullname"
      />

      <FormInput
        label={`${g('Email')}`}
        error={errors?.email?.message || ''}
        type="text"
        {...register('email')}
      />

      <FormInput
        label={`${g('Phone')}`}
        error={errors?.phone?.message || ''}
        type="tel"
        {...register('phone')}
        id="phone"
      />

      <FormInput
        label={`${g('Age')}`}
        error={errors?.age?.message || ''}
        type="text"
        {...register('age')}
        id="age"
      />

      <FormInput
        label={`${g('Password')}`}
        error={errors?.password?.message || ''}
        type="text"
        {...register('password')}
        id="password"
      />

      <FormInput
        label={`${g('Address')}`}
        error={errors?.address?.message || ''}
        type="text"
        {...register('address')}
        id="address"
      />

      <FormInput
        label={`${g('Gender')}`}
        options={[
          { id: 'male', value: g('Male') },
          { id: 'female', value: g('Female') },
        ]}
        error={errors?.gender?.message || ''}
        type="text"
        {...register('gender')}
        id="gender"
      />

      <FormInput
        label={`${g('Subjects')}`}
        options={subjects?.map((p) => ({ id: p.id!, value: p.name! })) || []}
        error={errors?.subject?.message || ''}
        type="text"
        {...register('subject')}
        id="subject"
      />

      <FormInput
        label={`${g('Salary')}`}
        error={errors?.salary?.message || ''}
        type="text"
        {...register('salary')}
        id="salary"
      />

      <div className="sticky bottom-0 right-0 bg-primary pt-4 flex gap-8 items-center justify-between">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting || isLoading}
          isLoading={isLoading}
        >
          {user ? g('Update') : g('Add')} {g('Teacher')}
        </Button>
        <DialogPrimitive.Close>
          <Button disabled={isLoading}>{g('Cancel')}</Button>
        </DialogPrimitive.Close>
      </div>
    </form>
  );
}
