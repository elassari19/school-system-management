'use server';

import { z } from 'zod';
import { getSessionUser } from '@/lib/auth-helper';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiCourseContext {
  title?: string;
  description?: string;
  level?: string;
  instructor?: string;
  chapters: { title: string; lessons: { title: string; type: string }[] }[];
}

const lessonSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['video', 'text', 'image', 'quiz']),
  data: z
    .object({
      url: z.string().optional(),
      duration: z.number().optional(),
      text: z.string().optional(),
      questions: z
        .array(
          z.object({
            question: z.string().min(1),
            options: z.array(z.string().min(1)).min(2),
            answerIndex: z.number().int().min(0),
          })
        )
        .optional(),
    })
    .catch({}),
});

const aiReplySchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('message'), content: z.string() }),
  z.object({
    action: z.literal('basics'),
    basics: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      instructor: z.string().optional(),
      level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
      duration: z.number().optional(),
      tags: z.array(z.string()).optional(),
    }),
  }),
  z.object({
    action: z.literal('outline'),
    chapters: z
      .array(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
        })
      )
      .min(1),
  }),
  z.object({
    action: z.literal('chapter'),
    chapter: z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      duration: z.number().optional(),
      lessons: z.array(lessonSchema).min(1),
    }),
  }),
]);

export type AiReply = z.infer<typeof aiReplySchema>;

const chapterDraftSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().optional(),
  lessons: z.array(lessonSchema).min(1),
});

export type AiChapterDraft = z.infer<typeof chapterDraftSchema>;

const aiJsonAction = async (
  system: string,
  prompt: string
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> => {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
    return { ok: false, error: 'unauthorized' };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'missing_key' };
  }

  const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';

  try {
    const res = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'School System - Course Builder',
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 3000,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(90000),
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('OpenRouter error', res.status, text.slice(0, 300));
      return { ok: false, error: `provider_error_${res.status}` };
    }

    const data = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? '';
    if (!raw.trim()) return { ok: false, error: 'empty_response' };

    const jsonStr = extractJson(raw);
    if (!jsonStr) return { ok: false, error: 'invalid_json' };

    try {
      return { ok: true, data: JSON.parse(jsonStr) };
    } catch {
      return { ok: false, error: 'invalid_json' };
    }
  } catch (error) {
    console.error('AI action failed', error);
    return { ok: false, error: 'network_error' };
  }
};

// Drafts a single chapter (title, description, lessons) focused on one chapter at a time
export async function aiDraftChapterAction(
  chapterTitle: string,
  instruction: string,
  course?: { title?: string; description?: string; level?: string; language?: string }
): Promise<{ ok: true; draft: AiChapterDraft } | { ok: false; error: string }> {
  const system = `
You are an expert instructional designer drafting ONE chapter of a course inside a course builder UI.

Respond with a SINGLE JSON object only — no markdown fences, no extra text — matching exactly this shape:
{"title":"...","description":"...","duration":30,"lessons":[{"title":"...","type":"video|text|image|quiz","data":{...}}]}

Lesson "data" shapes:
- video: {"url":"","duration":10}
- text: {"text":"the full lesson content written clearly"}
- image: {"url":""}
- quiz: {"questions":[{"question":"...","options":["A","B","C"],"answerIndex":0}]}

Rules:
- Draft ONLY the requested chapter — never other chapters.
- 2 to 6 lessons per chapter, mixing video/text and optionally a quiz.
- Leave "url" empty unless a real URL is known.
${course?.language === 'ar' ? 'Write ALL user-facing text in Arabic.' : 'Write all user-facing text in the same language as the user instruction, defaulting to English.'}
`;
  const prompt = `Course context (JSON): ${JSON.stringify(course ?? {})}
Chapter requested: ${chapterTitle || '(choose a fitting title based on the course and instruction)'}
Teacher instruction: ${instruction}`;

  const result = await aiJsonAction(system, prompt);
  if (!result.ok) return result;
  const parsed = chapterDraftSchema.safeParse(result.data);
  if (!parsed.success) return { ok: false, error: 'invalid_json' };
  return { ok: true, draft: parsed.data };
}

export interface AiChapterContext {
  courseTitle?: string;
  courseDescription?: string;
  level?: string;
  language?: 'en' | 'ar';
  chapterTitle?: string;
  chapterContent?: string;
}

const aiChapterReplySchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('message'), content: z.string() }),
  z.object({
    action: z.literal('draft'),
    title: z.string().min(1).optional(),
    content: z.string().min(1),
  }),
]);

export type AiChapterReply = z.infer<typeof aiChapterReplySchema>;

// Chat scoped to a single chapter: discusses or proposes that chapter's draft (title + content)
export async function aiChapterChatAction(
  messages: AiChatMessage[],
  context: AiChapterContext
): Promise<{ ok: true; reply: AiChapterReply } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
    return { ok: false, error: 'unauthorized' };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'missing_key' };
  }

  const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';

  const system = `
You are an expert instructional designer helping a teacher write ONE chapter inside a course builder UI.

Respond with a SINGLE JSON object only — no markdown fences, no extra text — matching exactly one of these shapes:
1. {"action":"message","content":"..."} — to discuss, ask questions, give ideas, or explain.
2. {"action":"draft","title":"...","content":"..."} — to propose the chapter draft. "content" is the full chapter text students will read: well-structured, 150 to 400 words, plain text with short paragraphs separated by blank lines. Include "title" only when the chapter needs a new or improved title.

Rules:
- Focus ONLY on this chapter — never write other chapters or the whole course.
- Refine the draft based on the teacher's feedback, and always return the FULL updated text in "content".
${context.language === 'ar' ? 'Write ALL user-facing text in Arabic.' : 'Write in the same language as the teacher messages, defaulting to English.'}

Current chapter state (JSON): ${JSON.stringify(context)}
`;

  try {
    const res = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'School System - Course Builder',
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 2500,
        messages: [
          { role: 'system', content: system },
          ...messages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
      signal: AbortSignal.timeout(60000),
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('OpenRouter error', res.status, text.slice(0, 300));
      return { ok: false, error: `provider_error_${res.status}` };
    }

    const data = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? '';
    if (!raw.trim()) return { ok: false, error: 'empty_response' };

    const jsonStr = extractJson(raw);
    if (!jsonStr) {
      return { ok: true, reply: { action: 'message', content: raw } };
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(jsonStr);
    } catch {
      return { ok: true, reply: { action: 'message', content: raw } };
    }

    const parsed = aiChapterReplySchema.safeParse(parsedJson);
    if (!parsed.success) {
      return { ok: true, reply: { action: 'message', content: raw } };
    }

    return { ok: true, reply: parsed.data };
  } catch (error) {
    console.error('AI chapter chat failed', error);
    return { ok: false, error: 'network_error' };
  }
}

// Writes a concise chapter description focused on a single chapter
export async function aiWriteDescriptionAction(
  kind: 'chapter' | 'course',
  title: string,
  instruction: string,
  context?: { courseTitle?: string; courseDescription?: string; level?: string; language?: string }
): Promise<{ ok: true; description: string } | { ok: false; error: string }> {
  const system = `
You write short, engaging descriptions for a course builder UI.
${kind === 'chapter'
    ? 'Describe ONE chapter only, based on its title and the teacher instruction. 1 to 3 sentences.'
    : 'Describe the whole course in a compelling way. 2 to 4 sentences.'}
Respond with ONLY {"description":"..."} — no markdown, no extra text.
${context?.language === 'ar' ? 'Write in Arabic.' : 'Write in the same language as the teacher instruction, defaulting to English.'}
`;
  const prompt = `Context (JSON): ${JSON.stringify(context ?? {})}
${kind === 'chapter' ? 'Chapter' : 'Course'} title: ${title}
Teacher instruction: ${instruction}`;

  const result = await aiJsonAction(system, prompt);
  if (!result.ok) return result;
  const parsed = z.object({ description: z.string().min(1) }).safeParse(result.data);
  if (!parsed.success) return { ok: false, error: 'invalid_json' };
  return { ok: true, description: parsed.data.description };
}

const buildSystemPrompt = (context?: AiCourseContext) => `
You are an expert instructional designer helping a teacher build a course inside a course builder UI.

Respond with a SINGLE JSON object only — no markdown fences, no extra text — matching exactly one of these shapes:
1. {"action":"message","content":"..."} — to discuss, ask questions, or explain.
2. {"action":"basics","basics":{"title":"...","description":"...","instructor":"...","level":"beginner|intermediate|advanced","duration":120,"tags":["..."]}} — to propose the course basics (title, description, instructor, level, total duration in minutes, tags).
3. {"action":"outline","chapters":[{"title":"...","description":"..."}]} — to propose the chapter outline (titles only, no lessons).
4. {"action":"chapter","chapter":{"title":"...","description":"...","duration":30,"lessons":[{"title":"...","type":"video|text|image|quiz","data":{...}}]}} — to draft ONE complete chapter with its lessons.

Lesson "data" shapes:
- video: {"url":"https://...","duration":10}
- text: {"text":"the full lesson content written clearly"}
- image: {"url":"https://..."}
- quiz: {"questions":[{"question":"...","options":["A","B","C"],"answerIndex":0}]}

Work INCREMENTALLY, never all at once:
- When asked for an outline, reply only with the "outline" action (chapter titles).
- When asked to draft a chapter, reply only with a single "chapter" action containing that chapter's full lessons.
- After each draft, offer to draft the next chapter.

Current course state (JSON): ${JSON.stringify(context ?? {})}
Existing chapters are already saved — do not repeat them. "The next chapter" means the first outlined chapter that has no lessons yet (or the next one in the outline).

Write all user-facing text in the same language as the user's messages (English or Arabic).
`;

const extractJson = (raw: string): string | null => {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
};

export async function aiCourseChatAction(
  messages: AiChatMessage[],
  context?: AiCourseContext
): Promise<{ ok: true; reply: AiReply } | { ok: false; error: string }> {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
    return { ok: false, error: 'unauthorized' };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'missing_key' };
  }

  const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';

  try {
    const res = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'School System - Course Builder',
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 2000,
        messages: [
          { role: 'system', content: buildSystemPrompt(context) },
          ...messages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
      signal: AbortSignal.timeout(60000),
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('OpenRouter error', res.status, text.slice(0, 300));
      return { ok: false, error: `provider_error_${res.status}` };
    }

    const data = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? '';
    if (!raw.trim()) return { ok: false, error: 'empty_response' };

    const jsonStr = extractJson(raw);
    if (!jsonStr) {
      return { ok: true, reply: { action: 'message', content: raw } };
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(jsonStr);
    } catch {
      return { ok: true, reply: { action: 'message', content: raw } };
    }

    const parsed = aiReplySchema.safeParse(parsedJson);
    if (!parsed.success) {
      return { ok: true, reply: { action: 'message', content: raw } };
    }

    return { ok: true, reply: parsed.data };
  } catch (error) {
    console.error('AI course chat failed', error);
    return { ok: false, error: 'network_error' };
  }
}
