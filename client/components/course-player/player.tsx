'use client';

import React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useIntlTranslations from '@/hooks/use-intl-translations';
import LessonView from './lesson-view';
import { StudentCourse, byOrder, lessonCount, totalDuration } from './types';
import { Link } from '@/i18n/routing';
import { ArrowLeft, ChevronRight, Layers } from 'lucide-react';

interface Props {
  course: StudentCourse;
}

const CoursePlayer = ({ course }: Props) => {
  const { g } = useIntlTranslations();
  const modules = React.useMemo(
    () => [...(course.chapters ?? [])].sort(byOrder),
    [course.chapters]
  );

  const firstLesson = modules.flatMap((m) => [...(m.content ?? [])].sort(byOrder))[0];
  const [activeId, setActiveId] = React.useState<string | null>(firstLesson?.id ?? null);

  const activeLesson = modules.flatMap((m) => m.content ?? []).find((l) => l.id === activeId);

  const totalLessons = lessonCount(course);
  const minutes = totalDuration(course);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link href="/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">{course.title}</h1>
          <p className="text-sm text-muted-foreground">
            {course.instructor} · {modules.length} {g('Modules')} · {totalLessons}{' '}
            {g('Lessons')} · {minutes} {g('min')}
          </p>
        </div>
      </div>

      {totalLessons === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          {g('No lessons available yet')}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-white p-3 lg:max-h-[70vh] overflow-auto flex flex-col gap-2">
            {modules.map((module, index) => {
              const lessons = [...(module.content ?? [])].sort(byOrder);
              return (
                <Collapsible
                  key={module.id}
                  defaultOpen={index === 0}
                  className="group/module rounded-md border data-[state=open]:bg-muted/30"
                >
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 p-2 text-start font-medium"
                    >
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/module:rotate-90" />
                      <Layers className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="line-clamp-1">{module.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {lessons.length} {g('Lessons')}
                      </span>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="animate-collapsible-down">
                    <div className="flex flex-col pb-1">
                      {lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => setActiveId(lesson.id)}
                          className={cn(
                            'flex items-center gap-2 px-2 py-1.5 ms-4 text-sm text-start rounded-md',
                            activeId === lesson.id
                              ? 'bg-secondary/10 text-secondary font-semibold'
                              : 'hover:bg-muted/50'
                          )}
                        >
                          <span className="line-clamp-1">{lesson.title}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {g(lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1))}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>

          <div className="lg:col-span-2 rounded-lg border bg-white p-4">
            {activeLesson ? (
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold">{activeLesson.title}</h2>
                <LessonView lesson={activeLesson} />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                {g('Select a lesson to start')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
