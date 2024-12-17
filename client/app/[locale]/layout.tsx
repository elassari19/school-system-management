import { Metadata } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import Providers from '@/components/app-providers';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
interface IProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'School Dashboard',
  description: 'School Dashboard App',
};

export default async function LocaleLayout(props: IProps) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  const messages = await getMessages();

  return (
    <html lang={locale} dir={`${locale == 'ar' ? 'rtl' : 'ltr'}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <main className="w-full flex justify-center items-center">
              {children}
            </main>{' '}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
