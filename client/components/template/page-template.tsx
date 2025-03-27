import React from 'react';
import { cn } from '@/lib/utils';
import OverviewCard from '../cards/overview-card';
import { getTranslations } from 'next-intl/server';
import SearchInput from '../inputs/search-input';
import { SheetDrawer } from '../ui/sheet';

interface OverviewProps {
  overviewData: {
    icon: React.JSXElementConstructor<any>;
    title: string;
    currentValue: string;
    pastValue: string;
  }[];
}
export function OverviewSection({ overviewData }: OverviewProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {overviewData.map(({ icon, title, currentValue, pastValue }) => (
        <OverviewCard
          key={title}
          icon={icon}
          title={title}
          currentValue={currentValue}
          pastValue={pastValue}
        />
      ))}
    </section>
  );
}

interface ActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder: string;
  actionTarget: string;
  ModalForm: React.FunctionComponent;
}
export async function ActionsSection({
  placeholder,
  actionTarget,
  ModalForm,
  className,
}: ActionsProps) {
  const g = await getTranslations('global');

  return (
    <section className="flex justify-between items-center">
      <SearchInput placeholder={placeholder} className="max-w-64 z-[1]" />

      <SheetDrawer
        sheetTrigger={`${g('Add')} ${g(actionTarget)}`}
        sheetTitle={`${g('Add')} ${g(actionTarget)}`}
        sheetContent={<ModalForm />}
        className={cn(className)}
      />
    </section>
  );
}

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
}
export const PageContent = ({ children, className }: PageSectionProps) => (
  <section className={cn('', className)}>{children}</section>
);

interface ChartProps {
  leftChart: React.ReactNode;
  rightChart: React.ReactNode;
}
export const ChartSection = ({ leftChart, rightChart }: ChartProps) => (
  <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {leftChart}
    {rightChart}
  </section>
);

interface IProps extends React.HTMLAttributes<HTMLDivElement> {}
const PageTemplate = async ({ children, className }: IProps) => {
  return (
    <div className={cn('h-full overflow-auto flex flex-col gap-6', className)}>{children}</div>
  );
};

export default PageTemplate;
