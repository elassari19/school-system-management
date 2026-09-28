import React from 'react';
import { getTranslations } from 'next-intl/server';
import PageTemplate, { OverviewSection } from '@/components/template/page-template';
import ResourceTable from '@/components/tables/resource-table';
import { libraryColumns, librarySearchKeys } from '@/lib/resources-columns';
import { LibraryBook, libraryData } from '@/lib/resources-data';
import { AlertTriangle, BookMarked, Files, Library } from 'lucide-react';

export default async function LibraryPage() {
  const g = await getTranslations('global');

  const totalCopies = libraryData.reduce((acc, book) => acc + book.copies, 0);
  const onLoan = libraryData.reduce((acc, book) => acc + (book.copies - book.available), 0);
  const overdue = libraryData.filter((book) => book.status === 'Overdue').length;
  const categories = new Set(libraryData.map((book) => book.category)).size;

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: Library,
            title: `${g('Total')} ${g('Books')}`,
            currentValue: `${libraryData.length}`,
            pastValue: `${totalCopies} ${g('Copies')} ${g('in catalog')}`,
          },
          {
            icon: Files,
            title: `${g('Category')}`,
            currentValue: `${categories}`,
            pastValue: `${g('in catalog')}`,
          },
          {
            icon: BookMarked,
            title: `${g('Lent')}`,
            currentValue: `${onLoan}`,
            pastValue: `${g('on loan now')}`,
          },
          {
            icon: AlertTriangle,
            title: `${g('Overdue')}`,
            currentValue: `${overdue}`,
            pastValue: `${g('past due date')}`,
          },
        ]}
      />

      <ResourceTable<LibraryBook>
        columns={libraryColumns}
        data={libraryData}
        searchKeys={librarySearchKeys}
        searchPlaceholder={`${g('Search')} ${g('Book')}...`}
      />
    </PageTemplate>
  );
}
