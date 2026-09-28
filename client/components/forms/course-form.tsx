'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import useIntlTranslations from '@/hooks/use-intl-translations';
import FormInput from '../inputs/form-input';
import { courseFormSchema, CourseFormType } from '@/lib/zod-schema';
import {
  createCourseQuery,
  getCourseQuery,
  getCourseSubjectsQuery,
  updateCourseQuery,
} from '@/app/api/academic';
import toast from 'react-hot-toast';

interface Props {
  user?: string;
  subjectId?: string;
}

interface CourseRecord {
  id?: string;
  title?: string;
  description?: string;
  instructor?: string;
  duration?: number;
  level?: CourseFormType['level'];
  tags?: string[];
  thumbnail?: string;
  price?: number;
  subjectId?: string;
}

export default function AddCourseForm({ user, subjectId }: Props) {
  const { g } = useIntlTranslations();
  const [course, setCourse] = React.useState<CourseRecord>();
  const [subjects, setSubjects] = React.useState<{ id: string; name: string }[]>([]);

  const getFormData = async () => {
    try {
      if (!subjectId) {
        const subjectData = await getCourseSubjectsQuery();
        if (Array.isArray(subjectData)) setSubjects(subjectData);
      }
      if (user) {
        const courseData = await getCourseQuery(user);
        if (courseData) setCourse(courseData);
      }
    } catch (error) {
      toast.error(g('Failed to load form data'));
    }
  };

  React.useEffect(() => {
    getFormData();
  }, [user, subjectId]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isLoading, isSubmitting, isValid },
  } = useForm<CourseFormType>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      instructor: '',
      duration: '',
      level: undefined,
      tags: '',
      thumbnail: '',
      subjectId: subjectId || '',
      price: '',
    },
  });

  React.useEffect(() => {
    setValue('subjectId', subjectId || course?.subjectId || '');
  }, [subjectId, course, setValue]);

  React.useEffect(() => {
    if (!user && !subjectId && subjects[0]?.id) {
      setValue('subjectId', subjects[0].id);
    }
  }, [user, subjectId, subjects, setValue]);

  React.useEffect(() => {
    if (course) {
      setValue('title', course.title || '');
      setValue('description', course.description || '');
      setValue('instructor', course.instructor || '');
      setValue('duration', course.duration ? String(course.duration) : '');
      setValue('level', course.level);
      setValue('tags', course.tags?.join(', ') || '');
      setValue('thumbnail', course.thumbnail || '');
      setValue('price', course.price ? String(course.price) : '');
    }
  }, [course, setValue]);

  const onSubmit = async (data: CourseFormType) => {
    try {
      let res;
      if (user) {
        res = await updateCourseQuery(data, user);
      } else {
        res = await createCourseQuery(data);
      }

      if (res.error) {
        throw new Error(res.error);
      }

      toast.success(
        `${g('Course')} ${data.title} ${
          course ? g('updated successfully') : g('created successfully')
        }`
      );

      if (!course) {
        reset({
          title: '',
          description: '',
          instructor: '',
          duration: '',
          level: undefined,
          tags: '',
          thumbnail: '',
          subjectId: subjectId || '',
          price: '',
        });
      }
    } catch (error) {
      toast.error(
        `${g('Course')} ${data.title} ${course ? g('updated failed') : g('created failed')}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <FormInput
        label={g('Course Title')}
        error={errors?.title?.message || ''}
        type="text"
        {...register('title')}
        id="title"
      />

      <FormInput
        label={g('Description')}
        error={errors?.description?.message || ''}
        type="text"
        {...register('description')}
        id="description"
      />

      <FormInput
        label={g('Instructor')}
        error={errors?.instructor?.message || ''}
        type="text"
        {...register('instructor')}
        id="instructor"
      />

      {!subjectId && (
        <FormInput
          label={g('Subject')}
          error={errors?.subjectId?.message || ''}
          options={subjects.map((subject) => ({ id: subject.id, value: subject.name }))}
          {...register('subjectId')}
          id="subjectId"
        />
      )}

      <FormInput
        label={g('Level')}
        error={errors?.level?.message || ''}
        options={[
          { id: 'beginner', value: g('Beginner') },
          { id: 'intermediate', value: g('Intermediate') },
          { id: 'advanced', value: g('Advanced') },
        ]}
        {...register('level')}
        id="level"
      />

      <FormInput
        label={g('Duration')}
        error={errors?.duration?.message || ''}
        type="number"
        {...register('duration')}
        id="duration"
      />

      <FormInput
        label={g('Price')}
        error={errors?.price?.message || ''}
        type="number"
        step="0.01"
        {...register('price')}
        id="price"
      />

      <FormInput
        label={g('Tags')}
        error={errors?.tags?.message || ''}
        type="text"
        {...register('tags')}
        id="tags"
      />

      <FormInput
        label={g('Thumbnail')}
        error={errors?.thumbnail?.message || ''}
        type="text"
        {...register('thumbnail')}
        id="thumbnail"
      />

      <div className="sticky bottom-0 right-0 bg-primary pt-4 flex gap-8 items-center justify-between">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting || isLoading}
          isLoading={isLoading}
        >
          {g(user ? 'Update' : 'Add')} {g('Course')}
        </Button>
        <DialogPrimitive.Close>
          <Button disabled={isLoading}>{g('Cancel')}</Button>
        </DialogPrimitive.Close>
      </div>
    </form>
  );
}