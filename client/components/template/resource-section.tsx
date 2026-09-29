'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ResourceTable, { ResourceColumn } from '@/components/tables/resource-table';
import useIntlTranslations from '@/hooks/use-intl-translations';

interface IProps<T extends object> {
  /** Section heading, rendered above the list. */
  title: string;
  /** Short explanation, also reused as the sheet description. */
  description?: string;
  /** Initial rows — the section keeps its own state once mounted. */
  data: T[];
  columns: ResourceColumn<T>[];
  searchKeys: readonly (keyof T & string)[];
  searchPlaceholder: string;
  /** Used to build the action labels: `Add {actionTarget}`. */
  actionTarget: string;
  pageSize?: number;
  /** Sheet form, called with the handler that appends the created row. */
  createForm: (onCreate: (row: T) => void) => React.ReactNode;
  /** Optional block rendered above the section (stats cards, filters ...). */
  renderOverview?: (rows: T[]) => React.ReactNode;
  className?: string;
}

const ResourceSection = <T extends object>({
  title,
  description,
  data,
  columns,
  searchKeys,
  searchPlaceholder,
  actionTarget,
  pageSize,
  createForm,
  renderOverview,
  className,
}: IProps<T>) => {
  const { g } = useIntlTranslations();
  const [rows, setRows] = React.useState<T[]>(data);
  const [open, setOpen] = React.useState(false);

  const handleCreate = (row: T) => {
    setRows((previous) => [row, ...previous]);
    setOpen(false);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {renderOverview?.(rows)}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {g('Add')} {g(actionTarget)}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md py-4">
            <SheetHeader>
              <SheetTitle>
                {g('Add')} {g(actionTarget)}
              </SheetTitle>
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>
            <div className="h-[90%] overflow-auto pr-1">{createForm(handleCreate)}</div>
          </SheetContent>
        </Sheet>
      </div>

      <ResourceTable<T>
        columns={columns}
        data={rows}
        searchKeys={searchKeys}
        searchPlaceholder={searchPlaceholder}
        pageSize={pageSize}
      />
    </div>
  );
};

export default ResourceSection;
