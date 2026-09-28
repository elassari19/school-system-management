import Builder, { CourseRecord } from '@/components/course-builder/builder';
import { requireAuth } from '@/lib/auth-helper';
import { getCourseBuilderQuery } from '@/app/api/academic';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Wand2 } from 'lucide-react';

interface IProps {
  params: Promise<{ id: string }>;
}

export default async function page(props: IProps) {
  const { id } = await props.params;
  const [g, user, course] = await Promise.all([
    getTranslations('global'),
    requireAuth(),
    getCourseBuilderQuery(id),
  ]);

  if (!user || !course) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-secondary/10 p-3">
          <Wand2 className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{g('Course Builder')}</h1>
          <p className="text-sm text-muted-foreground">{g('Edit course content')}</p>
        </div>
      </div>
      <Builder courseId={id} initialCourse={course as CourseRecord} basePath="/courses" />
    </div>
  );
}
