import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Layers, PlayCircle, User, Wand2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { StudentCourse, lessonCount, totalDuration } from './types';

interface Props {
  course: StudentCourse;
}

const CourseCard = async ({ course }: Props) => {
  const g = await getTranslations('global');
  const chapters = course.chapters ?? [];
  const lessons = lessonCount(course);
  const minutes = totalDuration(course);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-white transition hover:shadow-lg">
      <Link href={`/courses/${course.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-video w-full bg-muted/40">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title || 'course'}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/50" />
            </div>
          )}
          {course.level && (
            <span className="absolute right-2 top-2">
              <Badge variant="secondary">
                {g(course.level.charAt(0).toUpperCase() + course.level.slice(1))}
              </Badge>
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-1 font-semibold group-hover:text-secondary">{course.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5" /> {course.instructor || '-'}
          </div>

          <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" /> {chapters.length} {g('Chapters')} · {lessons}{' '}
              {g('Lessons')}
            </span>
            <span className="flex items-center gap-1">
              <PlayCircle className="h-3.5 w-3.5" /> {minutes} {g('min')}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Link href={`/courses/${course.id}/edit`} className="block">
          <Button variant="secondary" size="sm" className="w-full gap-2">
            <Wand2 className="h-4 w-4" /> {g('Explore')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
