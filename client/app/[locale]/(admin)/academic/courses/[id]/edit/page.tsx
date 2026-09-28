import Builder, { CourseRecord } from '@/components/course-builder/builder';
import PageTemplate from '@/components/template/page-template';
import { getCourseBuilderQuery } from '@/app/api/academic';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface IProps {
  params: Promise<{ id: string }>;
}

export default async function page(props: IProps) {
  const { id } = await props.params;
  const [g, course] = await Promise.all([getTranslations('global'), getCourseBuilderQuery(id)]);

  if (!course) notFound();

  return (
    <PageTemplate>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{g('Course Builder')}</h1>
        <p className="text-sm text-muted-foreground">{g('Edit course content')}</p>
      </div>
      <Builder courseId={id} initialCourse={course as CourseRecord} />
    </PageTemplate>
  );
}