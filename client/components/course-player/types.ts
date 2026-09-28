export type LessonType = 'video' | 'text' | 'quiz' | 'image';

export interface StudentLesson {
  id: string;
  title: string;
  type: LessonType;
  data?: {
    url?: string;
    duration?: number;
    text?: string;
    questions?: QuizQuestion[];
  };
  order?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

export interface StudentChapter {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  order?: number;
  content?: StudentLesson[];
}

export interface StudentCourse {
  id: string;
  title?: string;
  description?: string;
  instructor?: string;
  level?: string;
  price?: number;
  thumbnail?: string | null;
  subject?: { id?: string; name?: string };
  chapters?: StudentChapter[];
}

export const byOrder = <T extends { order?: number }>(a: T, b: T) =>
  (a.order ?? 0) - (b.order ?? 0);

export const lessonContent = (course?: StudentCourse): StudentLesson[] =>
  (course?.chapters ?? []).flatMap((c) => c.content ?? []);

export const lessonCount = (course?: StudentCourse) =>
  (course?.chapters ?? []).reduce((total, c) => total + (c.content?.length ?? 0), 0);

export const totalDuration = (course?: StudentCourse) =>
  lessonContent(course).reduce((total, l) => total + (Number(l.data?.duration) || 0), 0);