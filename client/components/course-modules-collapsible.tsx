'use client';

import React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronRight } from 'lucide-react';

export interface CourseModule {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
}

interface Props {
  modules: CourseModule[];
  labels: {
    description: string;
    duration: string;
    min: string;
  };
}

const ModulesCollapsible = ({ modules, labels }: Props) => {
  const [openIds, setOpenIds] = React.useState<Set<string>>(
    () => new Set(modules.slice(0, 1).map((m) => m.id))
  );

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex flex-col gap-2">
      {modules.map((module, index) => {
        const open = openIds.has(module.id);
        return (
          <Collapsible
            key={module.id}
            open={open}
            onOpenChange={() => toggle(module.id)}
            className="group/module overflow-hidden rounded-lg border bg-white"
          >
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-muted/50"
              >
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/module:rotate-90" />
                <Badge variant="secondary" className="shrink-0">
                  {index + 1}
                </Badge>
                <span className="line-clamp-1 font-medium">{module.title || '-'}</span>
                {!!module.duration && (
                  <span className="ms-auto flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {module.duration} {labels.min}
                  </span>
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-collapsible-down data-[state=closed]:animate-collapsible-up">
              <div className="flex flex-col gap-3 border-t px-4 py-3 ms-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {labels.description}
                  </span>
                  <span className="text-sm leading-6 whitespace-pre-wrap">
                    {module.description || '-'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {labels.duration}
                  </span>
                  <span className="text-sm font-semibold">
                    {module.duration ? `${module.duration} ${labels.min}` : '-'}
                  </span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default ModulesCollapsible;
