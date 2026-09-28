'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ChapterCard from './chapter-card';
import { UiMessage } from './chapter-ai-chat';
import { ChapterRecord } from './types';
import { createChapterQuery, updateChapterQuery } from '@/app/api/academic';
import { BookOpen, Loader2, Plus, Sparkles } from 'lucide-react';
import useIntlTranslations from '@/hooks/use-intl-translations';
import toast from 'react-hot-toast';

interface Props {
  courseId: string;
  chapters: ChapterRecord[];
  courseBasics: { title?: string; description?: string; level?: string };
  language: 'en' | 'ar';
  loading: boolean;
  onChanged: () => void;
}

const ChapterWorkbench = ({
  courseId,
  chapters,
  courseBasics,
  language,
  loading,
  onChanged,
}: Props) => {
  const { g } = useIntlTranslations();
  const sorted = React.useMemo(
    () => [...chapters].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [chapters]
  );

  const [chatState, setChatState] = React.useState<Record<string, UiMessage[]>>({});
  const [openNewId, setOpenNewId] = React.useState<string | null>(null);
  const [adding, setAdding] = React.useState(false);

  const setMessages = React.useCallback((chapterKey: string, messages: UiMessage[]) => {
    setChatState((prev) => ({ ...prev, [chapterKey]: messages }));
  }, []);

  const addChapter = async () => {
    setAdding(true);
    try {
      const res = (await createChapterQuery(courseId, {
        title: `${g('New Chapter')} ${sorted.length + 1}`,
        order: sorted.length,
      })) as { id?: string; error?: string };
      if (res?.error) throw new Error(String(res.error));
      if (!res?.id) throw new Error('missing chapter id');
      setOpenNewId(res.id);
      toast.success(`${g('Chapter')} ${g('created successfully')}`);
      onChanged();
    } catch {
      toast.error(`${g('Failed to save')} ${g('Chapter')}`);
    } finally {
      setAdding(false);
    }
  };

  const moveChapter = async (chapter: ChapterRecord, direction: -1 | 1) => {
    const index = sorted.findIndex((c) => c.id === chapter.id);
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const reordered = [...sorted];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    try {
      await Promise.all(reordered.map((c, i) => updateChapterQuery(c.id, { order: i })));
      onChanged();
    } catch {
      toast.error(g('Failed to reorder'));
    }
  };

  const deleteChapter = (chapter: ChapterRecord) => {
    setChatState((prev) => {
      const next = { ...prev };
      delete next[chapter.id];
      return next;
    });
    setOpenNewId((id) => (id === chapter.id ? null : id));
    onChanged();
  };

  const showInitialLoader = loading && sorted.length === 0;

  if (showInitialLoader) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-primary bg-white p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            {g('Chapters')}
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Sparkles className="h-4 w-4 text-secondary" />
            {g('Draft each chapter with its own AI assistant')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sorted.length > 0 && (
            <Badge variant="secondary">{sorted.length}</Badge>
          )}
          <Button type="button" onClick={addChapter} disabled={adding} isLoading={adding}>
            <Plus className="h-4 w-4" /> {g('Add Chapter')}
          </Button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <button
          type="button"
          onClick={addChapter}
          disabled={adding}
          className="rounded-lg border border-primary border-dashed p-8 text-center text-sm text-muted-foreground hover:border-secondary hover:text-secondary transition flex flex-col items-center gap-2"
        >
          <Plus className="h-6 w-6" />
          {g('No chapters yet')}
          <span className="text-xs">{g('Click to create your first chapter')}</span>
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              index={index}
              total={sorted.length}
              courseBasics={courseBasics}
              language={language}
              messages={chatState[chapter.id] ?? []}
              onMessagesChange={setMessages}
              defaultOpen={openNewId === chapter.id}
              onMoved={moveChapter}
              onDeleted={deleteChapter}
              onSaved={onChanged}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChapterWorkbench;
