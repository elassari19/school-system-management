'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import ChapterAiChat, { ChapterDraft, UiMessage } from './chapter-ai-chat';
import { ChapterRecord } from './types';
import { AiChapterContext } from '@/app/api/ai-course';
import { deleteChapterQuery, updateChapterQuery } from '@/app/api/academic';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  MessageSquare,
  Save,
  Sparkles,
  Trash2,
  Undo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useIntlTranslations from '@/hooks/use-intl-translations';
import toast from 'react-hot-toast';

interface Props {
  chapter: ChapterRecord;
  index: number;
  total: number;
  courseBasics: { title?: string; description?: string; level?: string };
  language: 'en' | 'ar';
  messages: UiMessage[];
  onMessagesChange: (chapterKey: string, messages: UiMessage[]) => void;
  defaultOpen: boolean;
  onMoved: (chapter: ChapterRecord, direction: -1 | 1) => void;
  onDeleted: (chapter: ChapterRecord) => void;
  onSaved: () => void;
}

const ChapterCard = ({
  chapter,
  index,
  total,
  courseBasics,
  language,
  messages,
  onMessagesChange,
  defaultOpen,
  onMoved,
  onDeleted,
  onSaved,
}: Props) => {
  const { g } = useIntlTranslations();
  const [open, setOpen] = React.useState(defaultOpen);
  const [title, setTitle] = React.useState(chapter.title ?? '');
  const [content, setContent] = React.useState(chapter.description ?? '');
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(defaultOpen);

  React.useEffect(() => {
    setTitle(chapter.title ?? '');
    setContent(chapter.description ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.id]);

  const dirty = title !== (chapter.title ?? '') || content !== (chapter.description ?? '');

  const chatContext: AiChapterContext = {
    courseTitle: courseBasics.title,
    courseDescription: courseBasics.description,
    level: courseBasics.level,
    language,
    chapterTitle: title,
    chapterContent: content,
  };

  const applyDraft = (draft: ChapterDraft) => {
    if (draft.title) setTitle(draft.title);
    setContent(draft.content);
  };

  const save = async () => {
    if (!title.trim()) {
      toast.error(`${g('Chapter Title')} ${g('is required')}`);
      return;
    }
    setSaving(true);
    try {
      const res = await updateChapterQuery(chapter.id, {
        title: title.trim(),
        description: content.trim() || undefined,
      });
      if (res?.error) throw new Error(String(res.error));
      toast.success(`${g('Chapter')} ${g('updated successfully')}`);
      onSaved();
    } catch {
      toast.error(`${g('Failed to save')} ${g('Chapter')}`);
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    setTitle(chapter.title ?? '');
    setContent(chapter.description ?? '');
  };

  const remove = async () => {
    setDeleting(true);
    try {
      const res = await deleteChapterQuery(chapter.id);
      if (res?.error) throw new Error(String(res.error));
      toast.success(`${g('Chapter')} ${g('deleted successfully')}`);
      onDeleted(chapter);
    } catch {
      toast.error(`${g('Failed to delete')} ${g('Chapter')}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        'rounded-lg border bg-white transition',
        dirty ? 'border-secondary/60' : 'border-primary',
        open && 'shadow-sm'
      )}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-3 p-3">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary"
            >
              {index + 1}
            </button>
          </CollapsibleTrigger>
          <CollapsibleTrigger asChild>
            <button type="button" className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
              <span className="flex items-center gap-2 font-semibold truncate max-w-full">
                {title.trim() || g('New Chapter')}
                {dirty && (
                  <Badge variant="outline" className="text-[10px] border-secondary text-secondary">
                    {g('Unsaved changes')}
                  </Badge>
                )}
              </span>
              {content.trim() ? (
                <span className="text-xs text-muted-foreground line-clamp-1">{content}</span>
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  {g('No content yet')}
                </span>
              )}
            </button>
          </CollapsibleTrigger>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={deleting}
              onClick={remove}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-red-500" />
              )}
            </Button>
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-t border-primary p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor={`chapter-title-${chapter.id}`}>{g('Chapter Title')}</Label>
                <Input
                  id={`chapter-title-${chapter.id}`}
                  value={title}
                  placeholder={g('Chapter Title')}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <Label htmlFor={`chapter-content-${chapter.id}`} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-secondary" />
                  {g('Chapter Content')}
                </Label>
                <Textarea
                  id={`chapter-content-${chapter.id}`}
                  rows={10}
                  className="flex-1 min-h-40"
                  value={content}
                  placeholder={`${g('Describe what this chapter covers')}...`}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" disabled={!dirty || saving} isLoading={saving} onClick={save}>
                  <Save className="h-4 w-4" />
                  {g('Save changes')}
                </Button>
                {dirty && (
                  <Button type="button" size="sm" variant="ghost" disabled={saving} onClick={discard}>
                    <Undo2 className="h-4 w-4" />
                    {g('Discard')}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setChatOpen((v) => !v)}
                className="flex items-center gap-2 text-sm font-semibold text-secondary"
              >
                {chatOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {messages.length > 0 ? (
                  <MessageSquare className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {g('Chat with AI')}
                {messages.length > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {messages.length}
                  </Badge>
                )}
              </button>
              {chatOpen && (
                <ChapterAiChat
                  chapterKey={chapter.id}
                  messages={messages}
                  onMessagesChange={onMessagesChange}
                  context={chatContext}
                  onApplyDraft={applyDraft}
                />
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ChapterCard;
