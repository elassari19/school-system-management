import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }: { locale: string }) => {
  try {
    // Validate that the incoming `locale` parameter is valid
    if (!routing.locales.includes(locale as 'ar' | 'en')) notFound();
    return {
      messages: (await import(`../messages/${locale}.json`)).default,
    };
  } catch (error) {
    console.error('Error in locale configuration:', error);
    notFound();
  }
});
