'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  aiChapterChatAction,
  AiChatMessage,
  AiChapterContext,
  AiChapterReply,
} from '@/app/api/ai-course';
import { CheckCircle2, Loader2, Send, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import useIntlTranslations from '@/hooks/use-intl-translations';
import toast from 'react-hot-toast';

export interface ChapterDraft {
  title?: string;
  content: string;
}

interface Props {
  chapterKey: string;
  messages: UiMessage[];
  onMessagesChange: (chapterKey: string, messages: UiMessage[]) => void;
  context: AiChapterContext;
  onApplyDraft: (draft: ChapterDraft) => void;
}

export interface UiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reply?: AiChapterReply;
  applied?: boolean;
}

const uid = () => Math.random().toString(36).slice(2);

const ChapterAiChat = ({ chapterKey, messages, onMessagesChange, context, onApplyDraft }: Props) => {
  const { g } = useIntlTranslations();
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const userMsg: UiMessage = { id: uid(), role: 'user', content: trimmed };
    const history: AiChatMessage[] = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    onMessagesChange(chapterKey, [...messages, userMsg]);
    setInput('');
    setBusy(true);
    try {
      const result = await aiChapterChatAction(history, context);
      if (!result.ok) {
        const errorText =
          result.error === 'missing_key'
            ? g('AI is not configured on this server')
            : result.error === 'unauthorized'
              ? g('You are not allowed to use the AI assistant')
              : g('The AI assistant is unavailable, please try again');
        onMessagesChange(chapterKey, [
          ...messages,
          userMsg,
          { id: uid(), role: 'assistant', content: errorText },
        ]);
        toast.error(g('Failed to get a response'));
        return;
      }
      const reply = result.reply;
      const content =
        reply.action === 'message'
          ? reply.content
          : `${g('Proposed chapter draft')}${reply.title ? `: ${reply.title}` : ''}`;
      onMessagesChange(chapterKey, [
        ...messages,
        userMsg,
        { id: uid(), role: 'assistant', content, reply },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const applyDraft = (message: UiMessage) => {
    if (!message.reply || message.reply.action !== 'draft') return;
    onApplyDraft({ title: message.reply.title, content: message.reply.content });
    onMessagesChange(
      chapterKey,
      messages.map((m) => (m.id === message.id ? { ...m, applied: true } : m))
    );
    toast.success(g('Draft applied'));
  };

  const chips = [
    g('Draft this chapter'),
    g('Improve the content'),
    g('Make it shorter'),
    g('Add a recap'),
  ];

  return (
    <div className="rounded-lg border border-primary bg-secondary/5 flex flex-col min-h-[300px] max-h-[440px]">
      <div className="flex items-center gap-2 border-b border-primary px-3 py-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10">
          <Sparkles className="h-3 w-3 text-secondary" />
        </div>
        <span className="text-xs font-semibold text-secondary">{g('AI Assistant')}</span>
        <span className="text-[11px] text-muted-foreground">
          {g('The AI focuses on this chapter only')}
        </span>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="flex flex-col gap-2 py-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-1.5 py-6 text-center text-muted-foreground">
              <Wand2 className="h-5 w-5 text-secondary" />
              <p className="text-xs">{g('Ask the AI to draft or improve this chapter')}</p>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[92%] rounded-lg px-3 py-2 text-xs',
                  m.role === 'user' ? 'bg-secondary text-white' : 'bg-white border border-primary'
                )}
              >
                <p className="whitespace-pre-wrap break-words">{m.content}</p>

                {m.reply && m.reply.action === 'draft' && (
                  <div className="mt-2 border-t border-primary pt-2">
                    <div className="rounded-md border border-primary bg-muted/30 p-2 max-h-32 overflow-y-auto">
                      {m.reply.title ? (
                        <p className="font-semibold mb-1">{m.reply.title}</p>
                      ) : null}
                      <p className="whitespace-pre-wrap text-[11px] text-muted-foreground line-clamp-6">
                        {m.reply.content}
                      </p>
                    </div>
                    {m.applied ? (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-green-600">
                        <CheckCircle2 className="h-3 w-3" /> {g('Applied')}
                      </p>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="mt-1.5 h-7 text-xs"
                        disabled={busy}
                        onClick={() => applyDraft(m)}
                      >
                        <Wand2 className="h-3 w-3" /> {g('Apply')}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg border border-primary bg-white px-3 py-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-secondary" />
                {g('Thinking')}...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => send(chip)}
              disabled={busy}
              className="rounded-full border border-primary bg-white px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-secondary/10 hover:text-secondary disabled:opacity-50 transition"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-primary p-2">
        <Input
          value={input}
          placeholder={`${g('Ask the AI about this chapter')}...`}
          disabled={busy}
          className="h-8 text-xs"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          className="h-8 w-8 shrink-0"
          disabled={busy || !input.trim()}
          onClick={() => send(input)}
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default ChapterAiChat;
