import { getTranslations } from 'next-intl/server';
import { getCourseForStudentQuery } from '@/app/api/academic';
import CoursePlayer from '@/components/course-player/player';
import { StudentCourse } from '@/components/course-player/types';
import { notFound } from 'next/navigation';

interface IProps {
  params: Promise<{ id: string }>;
}

export default async function page(props: IProps) {
  const { id } = await props.params;
  const [g, course] = await Promise.all([
    getTranslations('global'),
    getCourseForStudentQuery(id),
  ]);

  if (!course || !(course as { published?: boolean }).published) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <CoursePlayer course={course as StudentCourse} />
      <p className="text-xs text-muted-foreground">
        {g('Course content is owned by the instructor and provided for your studies only')}
      </p>
    </div>
  );
}