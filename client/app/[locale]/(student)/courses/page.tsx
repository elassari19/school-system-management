import { getTranslations } from 'next-intl/server';
import { requireAuth } from '@/lib/auth-helper';
import { getStudentCoursesQuery } from '@/app/api/academic';
import CourseCard from '@/components/course-player/course-card';
import { StudentCourse } from '@/components/course-player/types';
import { BookOpen } from 'lucide-react';

export default async function page() {
  const [g, user] = await Promise.all([getTranslations('global'), requireAuth()]);

  const courses = ((await getStudentCoursesQuery(user!.id)) ?? []) as StudentCourse[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-secondary/10 p-3">
          <BookOpen className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{g('My Courses')}</h1>
          <p className="text-sm text-muted-foreground">
            {courses.length} {g('Courses')}
          </p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{g('No courses available yet')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}