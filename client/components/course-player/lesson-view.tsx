'use client';

import React from 'react';
import { StudentLesson } from './types';
import QuizView from './quiz-view';
import useIntlTranslations from '@/hooks/use-intl-translations';

interface Props {
  lesson: StudentLesson;
}

const LessonView = ({ lesson }: Props) => {
  const { g } = useIntlTranslations();
  const data = lesson.data ?? {};

  if (lesson.type === 'video') {
    if (!data.url) {
      return <p className="text-sm text-muted-foreground">{g('No video provided')}</p>;
    }
    return <video src={data.url} controls className="w-full max-h-[65vh] rounded-lg bg-black" />;
  }

  if (lesson.type === 'image') {
    if (!data.url) {
      return <p className="text-sm text-muted-foreground">{g('No image provided')}</p>;
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={data.url} alt={lesson.title} className="max-h-[65vh] rounded-lg" />;
  }

  if (lesson.type === 'text') {
    return (
      <div className="max-w-3xl text-sm leading-7 whitespace-pre-wrap">
        {data.text || g('No content provided')}
      </div>
    );
  }

  if (lesson.type === 'quiz') {
    const questions = data.questions ?? [];
    if (questions.length === 0) {
      return <p className="text-sm text-muted-foreground">{g('No questions provided')}</p>;
    }
    return <QuizView questions={questions} />;
  }

  return null;
};

export default LessonView;