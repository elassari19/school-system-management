'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import RootCard from '@/components/cards/root-card';
import { SubjectType, teacherFormSchema, TeacherFormType } from '../../lib/zod-schema';
import toast from 'react-hot-toast';
import {
  createTeacherQuery,
  getTeacherDetailsQuery,
  getTeacherSubjectsQuery,
  updateTeacherQuery,
} from '../../app/api/academic';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useIntlTranslations from '../../hooks/use-intl-translations';
import FormInput from '../inputs/form-input';

interface IProps {
  user: string;
}

const DetailsForm = ({ user }: IProps) => {
  const { g } = useIntlTranslations();
  const [subjects, setSubjects] = React.useState<SubjectType[]>([]);
  const [teacher, setTeacher] = React.useState<any>();

  const getFormData = async () => {
    try {
      const [subjectData, teacherData] = await Promise.all([
        getTeacherSubjectsQuery(),
        user ? getTeacherDetailsQuery(user) : null,
      ]);

      setSubjects(subjectData);
      setTeacher(teacherData);
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
      setValue('password', '');
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
      <RootCard
        title="Teacher Details"
        description="Please fill full details about the teacher"
        cardContent={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormInput
                  label={`${g('Full Name')}`}
                  error={errors?.fullname?.message || ''}
                  type="text"
                  {...register('fullname')}
                  id="fullname"
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  label={`${g('Age')}`}
                  error={errors?.age?.message || ''}
                  type="text"
                  {...register('age')}
                  id="age"
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  label={`${g('Email')}`}
                  error={errors?.email?.message || ''}
                  type="text"
                  {...register('email')}
                  id="email"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Phone</label>
                <FormInput
                  label={`${g('Phone')}`}
                  error={errors?.phone?.message || ''}
                  type="text"
                  {...register('phone')}
                  id="phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Your Photo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="mb-3">
                  <img
                    src={teacher.image || '/images/placeholder-teacher.jpg'}
                    alt={teacher.fullname}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">
                    SVG, PNG, JPEG OR GIF (max 1080x1200px)
                  </p>
                </div>
                <input type="file" name="photo" className="hidden" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormInput
                  label={`${g('Role')}`}
                  error={errors?.role?.message || ''}
                  type="text"
                  {...register('role')}
                  id="role"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Subject</label>
                <FormInput
                  label={`${g('Subject')}`}
                  error={errors?.subject?.message || ''}
                  type="text"
                  {...register('subject')}
                  id="subject"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        }
      />
    </form>
  );
};

export default DetailsForm;
