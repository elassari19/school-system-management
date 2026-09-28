'use client';

import React from 'react';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import FormInput from '@/components/inputs/form-input';
import FileUpload from '@/components/inputs/file-upload';
import ChapterWorkbench from './chapter-workbench';
import { ChapterRecord } from './types';
import { courseFormSchema, CourseFormType } from '@/lib/zod-schema';
import {
  createCourseQuery,
  getCourseBuilderQuery,
  getCourseSubjectsQuery,
  publishCourseQuery,
  updateCourseBasicsQuery,
} from '@/app/api/academic';
import { aiWriteDescriptionAction } from '@/app/api/ai-course';
import {
  BookOpen,
  ExternalLink,
  Loader2,
  Rocket,
  Save,
  Sparkles,
} from 'lucide-react';
import useIntlTranslations from '@/hooks/use-intl-translations';
import toast from 'react-hot-toast';

export interface CourseRecord {
  id: string;
  title?: string;
  description?: string;
  instructor?: string;
  duration?: number | null;
  level?: CourseFormType['level'];
  tags?: string[];
  thumbnail?: string | null;
  price?: number;
  subjectId?: string;
  published?: boolean;
  chapters?: ChapterRecord[];
  subject?: { id: string; name: string };
}

interface Props {
  courseId?: string;
  initialCourse?: CourseRecord;
  basePath?: string;
}

const Builder = ({ courseId: initialId, initialCourse, basePath = '/academic/courses' }: Props) => {
  const { g } = useIntlTranslations();
  const router = useRouter();
  const locale = useLocale();
  const [courseId, setCourseId] = React.useState<string | undefined>(initialId);
  const [published, setPublished] = React.useState<boolean>(initialCourse?.published ?? false);
  const [chapters, setChapters] = React.useState<ChapterRecord[]>(
    initialCourse?.chapters ?? []
  );
  const [subjects, setSubjects] = React.useState<{ id: string; name: string }[]>([]);
  const [loadingCourse, setLoadingCourse] = React.useState(false);
  const [savingBasics, setSavingBasics] = React.useState(false);
  const [aiDescriptionBusy, setAiDescriptionBusy] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormType>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: initialCourse?.title ?? '',
      description: initialCourse?.description ?? '',
      instructor: initialCourse?.instructor ?? '',
      duration: initialCourse?.duration ? String(initialCourse.duration) : '',
      level: initialCourse?.level,
      tags: initialCourse?.tags?.join(', ') ?? '',
      thumbnail: initialCourse?.thumbnail ?? '',
      subjectId: initialCourse?.subjectId ?? '',
      price: initialCourse?.price ? String(initialCourse.price) : '',
    },
  });

  const thumbnail = watch('thumbnail');

  const watchedTitle = watch('title');
  const watchedDescription = watch('description');
  const watchedLevel = watch('level');

  const refresh = React.useCallback(
    async (id: string) => {
      setLoadingCourse(true);
      try {
        const data = (await getCourseBuilderQuery(id)) as CourseRecord | null;
        if (data) {
          setChapters(data.chapters ?? []);
          setPublished(data.published ?? false);
        }
      } catch {
        toast.error(g('Failed to load course'));
      } finally {
        setLoadingCourse(false);
      }
    },
    [g]
  );

  React.useEffect(() => {
    if (!courseId) {
      getCourseSubjectsQuery().then((data) => {
        if (Array.isArray(data)) setSubjects(data);
      });
    } else if (!initialCourse) {
      refresh(courseId);
    }
  }, [courseId, initialCourse, refresh]);

  const onSubmit = async (data: CourseFormType) => {
    setSavingBasics(true);
    try {
      if (courseId) {
        const res = await updateCourseBasicsQuery(courseId, data);
        if (res?.error) throw new Error(res.error);
        toast.success(`${g('Course')} ${g('updated successfully')}`);
        refresh(courseId);
      } else {
        const res = (await createCourseQuery(data)) as CourseRecord & { error?: string };
        if (res?.error) throw new Error(String(res.error));
        if (res?.id) {
          setCourseId(res.id);
          toast.success(`${g('Course')} ${g('created successfully')}`);
        }
      }
    } catch {
      toast.error(`${g('Failed to save')} ${g('Course')}`);
    } finally {
      setSavingBasics(false);
    }
  };

  const togglePublish = async (value: boolean) => {
    if (!courseId) return;
    setPublished(value);
    try {
      const res = await publishCourseQuery(courseId, value);
      if (res?.error) throw new Error(res.error);
      toast.success(value ? g('Course published') : g('Course unpublished'));
    } catch {
      setPublished(!value);
      toast.error(g('Failed to update'));
    }
  };

  const generateDescription = async () => {
    if (!watchedTitle?.trim()) {
      toast.error(`${g('Course Title')} ${g('is required')}`);
      return;
    }
    setAiDescriptionBusy(true);
    try {
      const instruction = watchedDescription?.trim()
        ? `Improve this description: ${watchedDescription}`
        : 'Write a course description from scratch';
      const res = await aiWriteDescriptionAction('course', watchedTitle, instruction, {
        level: watchedLevel,
        language: locale === 'ar' ? 'ar' : 'en',
      });
      if (!res.ok) {
        toast.error(
          res.error === 'missing_key'
            ? g('AI is not configured on this server')
            : res.error === 'unauthorized'
              ? g('You are not allowed to use the AI assistant')
              : g('The AI assistant is unavailable, please try again')
        );
        return;
      }
      setValue('description', res.description, { shouldValidate: true });
      toast.success(g('Description generated'));
    } finally {
      setAiDescriptionBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Course basics — full width */}
      <div className="rounded-lg border border-primary bg-white p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-bold">{g('Course Basics')}</h2>
          </div>
          {courseId && (
            <Badge variant={published ? 'default' : 'secondary'}>
              {published ? g('Published') : g('Draft')}
            </Badge>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormInput
            label={g('Course Title')}
            error={errors?.title?.message || ''}
            type="text"
            {...register('title')}
            id="title"
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>{g('Description')}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-secondary text-xs"
                disabled={aiDescriptionBusy}
                onClick={generateDescription}
              >
                {aiDescriptionBusy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {aiDescriptionBusy ? g('Thinking') : g('Write with AI')}
              </Button>
            </div>
            <textarea
              {...register('description')}
              rows={4}
              placeholder={`${g('Describe the course, its goals and who it is for')}...`}
              className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm outline-none"
            />
            {errors?.description?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput
              label={g('Instructor')}
              error={errors?.instructor?.message || ''}
              type="text"
              {...register('instructor')}
              id="instructor"
            />

            {!initialCourse?.subjectId && (
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
              label={g('Duration (minutes)')}
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

            <FileUpload
              endpoint="imageUploader"
              accept="image/*"
              label={g('Thumbnail')}
              value={thumbnail || ''}
              onChange={(url) => setValue('thumbnail', url)}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button type="submit" disabled={savingBasics || isSubmitting} isLoading={savingBasics}>
              <Save className="h-4 w-4" />
              {courseId ? g('Update Course') : g('Create Course')}
            </Button>

            {courseId && (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-primary px-3 py-1.5">
                  <Rocket className="h-4 w-4 text-secondary" />
                  <span className="text-sm">{published ? g('Visible to students') : g('Hidden from students')}</span>
                  <Switch checked={published} onCheckedChange={togglePublish} />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`${basePath}/${courseId}`)}
                >
                  <ExternalLink className="h-4 w-4" /> {g('View Course')}
                </Button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Chapters workbench — each chapter has its own AI chat */}
      {!courseId ? (
        <div className="rounded-lg border border-primary border-dashed min-h-64 flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
          <BookOpen className="h-8 w-8" />
          <p className="font-medium">{g('Save the course basics to start building the curriculum')}</p>
          <p className="text-sm">{g('Chapters unlock after the course is created')}</p>
        </div>
      ) : (
        <ChapterWorkbench
          courseId={courseId}
          chapters={chapters}
          courseBasics={{
            title: watchedTitle || undefined,
            description: watchedDescription || undefined,
            level: watchedLevel,
          }}
          language={locale === 'ar' ? 'ar' : 'en'}
          loading={loadingCourse}
          onChanged={() => refresh(courseId)}
        />
      )}
    </div>
  );
};

export default Builder;
