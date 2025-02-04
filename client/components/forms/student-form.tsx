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
      select: { id: true, fullname: true },
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
      getParents(); // Add this to fetch parents when editing
    } else {
      getParents();
      getClasses();
    }
  }, []);

  React.useEffect(() => {
    if (student && students) {
      setValue('fullname', students?.user.fullname || '');
      setValue('email', students?.user.email || '');
      setValue('age', students?.user.age || '');
      setValue('phone', students?.user.phone || '');
      setValue('gender', students?.user.gender || '');
      setValue('password', students?.user.password || '');
      setValue('role', students?.user.role || '');
      setValue('address', students?.user.address || '');
      setValue('parent', students?.parent.id || ''); // Change to use parent ID instead of fullname
      setValue('_class', students?.class.id || ''); // Change to use class ID instead of name
      setValue('image', students?.user.image || '');
      setValue('password', null); // Change this line
    }
  }, [students, student]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isLoading, isSubmitting, isValid },
  } = useForm<studentType>({
    resolver: zodResolver(studentSchema),
  });

  React.useEffect(() => {
    if (student) {
      setValue('fullname', students?.user.fullname || '');
      setValue('email', students?.user.email || '');
      setValue('age', '' + students?.user.age || '');
      setValue('phone', students?.user.phone || '');
      setValue('gender', students?.user.gender || '');
      setValue('password', '');
      setValue('role', students?.user.role || '');
      setValue('address', students?.user.address || '');
      setValue('parent', students?.parent.user.id || '');
      setValue('_class', students?.class.id || '');
      setValue('image', students?.user.image || '');
    }
  }, [students, student]);

  const onSubmit = async (data: studentType) => {
    // if recive student invoke update else invoke create function
    let res;
    if (student) {
      res = await updateStudent({ ...data, userId: students.userId, id: students.id });
    } else {
      res = await createStudent(data);
    }
    console.log('res', res);
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
        options={parents?.map((p) => ({ id: p.id, value: p.fullname })) || []}
        {...register('parent')}
        id="parentName"
        defaultValue={students?.parent.id} // Add this line
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
        option={[
          { id: 'male', value: 'male' },
          { id: 'female', value: 'female' },
        ]}
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

      <Button
        type="submit"
        disabled={!isValid || isSubmitting || isLoading}
        isLoading={isLoading}
      >
        {g('Add')} {g('Student')}
      </Button>
    </form>
  );
};

export default AddStudentForm;
