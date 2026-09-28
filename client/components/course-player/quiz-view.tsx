'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import useIntlTranslations from '@/hooks/use-intl-translations';
import { cn } from '@/lib/utils';
import type { QuizQuestion } from './types';

interface Props {
  questions: QuizQuestion[];
}

const QuizView = ({ questions }: Props) => {
  const { g } = useIntlTranslations();
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const score = questions.reduce(
    (total, q, index) => total + (answers[index] === q.answerIndex ? 1 : 0),
    0
  );

  const unanswered = questions.length > 0 && Object.keys(answers).length < questions.length;

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, index) => (
        <Card key={index} className="p-4">
          <p className="font-semibold mb-3">
            {index + 1}. {q.question}
          </p>
          <div className="flex flex-col gap-2">
            {q.options.map((option, oIndex) => {
              const selected = answers[index] === oIndex;
              const correct = oIndex === q.answerIndex;
              return (
                <button
                  key={oIndex}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((prev) => ({ ...prev, [index]: oIndex }))}
                  className={cn(
                    'flex items-center gap-3 rounded-md border px-3 py-2 text-start text-sm transition',
                    selected && !submitted && 'border-secondary bg-secondary/10',
                    submitted && correct && 'border-green-500 bg-green-500/10',
                    submitted && selected && !correct && 'border-red-500 bg-red-500/10',
                    !submitted && 'hover:bg-muted/40'
                  )}
                >
                  {submitted ? (
                    correct ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    ) : selected ? (
                      <XCircle className="h-5 w-5 shrink-0 text-red-600" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )
                  ) : (
                    <Circle
                      className={cn(
                        'h-5 w-5 shrink-0',
                        selected ? 'text-secondary' : 'text-muted-foreground'
                      )}
                    />
                  )}
                  {option}
                </button>
              );
            })}
          </div>
        </Card>
      ))}

      {submitted ? (
        <div className="rounded-lg border bg-white p-4 flex flex-col gap-3">
          <p className="text-lg font-bold">
            {g('Your score')}: {score} / {questions.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {Math.round((score / Math.max(questions.length, 1)) * 100)}% ·{' '}
            {score === questions.length ? g('Perfect score') : g('Keep practicing')}
          </p>
          <Button
            variant="outline"
            className="w-fit"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            {g('Try again')}
          </Button>
        </div>
      ) : (
        <Button className="w-fit" disabled={unanswered} onClick={() => setSubmitted(true)}>
          {g('Submit')}
        </Button>
      )}
    </div>
  );
};

export default QuizView;