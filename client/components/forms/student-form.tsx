'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { studentSchema, studentType } from '@/lib/zod-schema';
import { Button } from '../ui/button';
import FormInput from '../inputs/form-input';
import { getUsers } from '@/app/api/dashboard';
import { createStudent, getAllStudent, updateStudent } from '@/app/api/academic';
import toast from 'react-hot-toast';
import useIntlTranslations from '@/hooks/use-intl-translations';
import * as DialogPrimitive from '@radix-ui/react-dialog';

interface Props {
  student?: string;
}

const AddStudentForm = ({ student }: Props) => {
  const { g } = useIntlTranslations();

  const [classes, setClassess] = React.useState<any[]>([]);
  const [parents, setParents] = React.useState<any[]>([]);
  const [students, setStudent] = React.useState<any>();

  const getParents = async () => {
    const result = await getUsers({
      where: { role: 'PARENT' },
      include: {
        parent: true,
      },
    });
    setParents(result);
  };

  const getClasses = async () => {
    const result = await getUsers(
      {
        select: { id: true, name: true },
      },
      'class'
    );
    setClassess(result);
  };

  const getStudent = async () => {
    const resp = await getAllStudent(1, student);
    setStudent(resp?.student[0]);
  };

  React.useEffect(() => {
    if (student) {
      getStudent();
      getClasses();
      getParents();
    } else {
      getParents();
      getClasses();
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isLoading, isSubmitting, isValid },
  } = useForm<studentType>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      role: 'STUDENT',
    },
  });

  React.useEffect(() => {
    if (student && students) {
      setValue('fullname', students?.user?.fullname || '');
      setValue('email', students?.user?.email || '');
      setValue('age', students?.user?.age?.toString() || '');
      setValue('phone', students?.user?.phone || '');
      setValue('gender', students?.user?.gender || '');
      setValue('role', 'STUDENT');
      setValue('address', students?.user?.address || '');
      setValue('parent', students?.parent?.id || '');
      setValue('_class', students?.class?.id || '');
      setValue('image', students?.user?.image || '');
    }
  }, [students, student, setValue]);

  React.useEffect(() => {
    if (student) {
      setValue('fullname', students?.user?.fullname || '');
      setValue('email', students?.user?.email || '');
      setValue('age', '' + students?.user?.age || '');
      setValue('phone', students?.user?.phone || '');
      setValue('gender', students?.user?.gender || '');
      setValue('password', '');
      setValue('role', students?.user?.role || '');
      setValue('address', students?.user?.address || '');
      setValue('parent', students?.parent?.id || '');
      setValue('_class', students?.class?.id || '');
      setValue('image', students?.user?.image || '');
    }
  }, [students, student]);

  console.log('parents', students, parents[0]);

  const onSubmit = async (data: studentType) => {
    // if recive student invoke update else invoke create function
    let res;
    if (student) {
      res = await updateStudent({ ...data, userId: students.userId, id: students.id });
    } else {
      res = await createStudent(data);
    }

    if (res.error) {
      toast.error(
        `${g('Student')} ${data.fullname} ${
          student ? g('updated failed') : g('created failed')
        }`
      );
      console.log('error', res.error);
      return;
    }
    toast.success(
      `${g('Student')} ${data.fullname} ${
        student ? g('updated successfully') : g('created successfully')
      }`
    );
    !student && reset();
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
        defaultValue={students?.parent?.id || ''} // Add this line
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
          {g(student ? 'Update' : 'Add')} {g('Student')}
        </Button>
        <DialogPrimitive.Close>
          <Button disabled={isLoading}>{g('Cancel')}</Button>
        </DialogPrimitive.Close>
      </div>
    </form>
  );
};

export default AddStudentForm;
