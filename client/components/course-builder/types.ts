export interface LessonRecord {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'image';
  data?: Record<string, unknown>;
  order?: number;
}

export interface ChapterRecord {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  order?: number;
  content?: LessonRecord[];
}
