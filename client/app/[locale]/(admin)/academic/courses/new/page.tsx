import Builder from '@/components/course-builder/builder';
import PageTemplate from '@/components/template/page-template';
import { getTranslations } from 'next-intl/server';

export default async function page() {
  const g = await getTranslations('global');

  return (
    <PageTemplate>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{g('Course Builder')}</h1>
        <p className="text-sm text-muted-foreground">{g('Create a new course')}</p>
      </div>
      <Builder />
    </PageTemplate>
  );
}