import React from 'react';
import { cn } from '@/lib/utils';
import OverviewCard from '../cards/overview-card';
import { getTranslations } from 'next-intl/server';
import SearchInput from '../inputs/search-input';
import PageTable from '../tables/page-table';
import { SheetDrawer } from '../ui/sheet';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  overviewData: any[];
  placeholder: string;
  actionTarget: string;
  modalForm: React.ReactNode;
  table: {
    headCell: string[];
    bodyCell: any[];
  };
  pages: number;
}

const PageTemplate = async ({
  children,
  className,
  overviewData,
  placeholder,
  modalForm,
  table,
  pages,
}: IProps) => {
  const g = await getTranslations('global');

  const overviewCards = overviewData.map(({ icon, title, currentValue, pastValue }) => (
    <OverviewCard
      key={title}
      icon={icon}
      title={title}
      currentValue={currentValue}
      pastValue={pastValue}
    />
  ));

  const pageTableProps = {
    headCell: table.headCell,
    bodyCell: table.bodyCell,
    pages,
  };

  return (
    <div className={cn('h-full overflow-auto flex flex-col gap-6', className)}>
      {/* Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {overviewCards}
      </section>

      {/* Action => search input, add button */}
      <section className="flex justify-between items-center">
        <SearchInput placeholder={placeholder} className="max-w-64 z-[1]" />

        <SheetDrawer
          sheetTrigger={`${g('Add')} ${g('Student')}`}
          sheetTitle={`${g('Add')} ${g('Student')}`}
          sheetContent={modalForm}
          className=""
        />
      </section>

      {/* Page table */}
      <PageTable {...pageTableProps} />

      {/* Grops card */}
      <section>{children}</section>
    </div>
  );
};

export default PageTemplate;
