import { Metadata } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import LeftMenuNav from '@/components/layout/left-menu-nav';
import TopMenuNav from '@/components/layout/top-menu-nav';

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
  params: { locale: string };
}

export const metadata: Metadata = {
  title: 'GoodFood App',
  description: 'GoodFood Dashboard App',
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: IProps) {
  const messages = await getMessages();

  return (
    <html lang={locale} dir={`${locale == 'ar' ? 'rtl' : 'ltr'}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <main className="grid grid-cols-12">
            <TopMenuNav />
            {/* left side nav */}
            <div className="col-span-2 relative">
              <LeftMenuNav />
            </div>
            <div className="col-span-10 p-4 pt-16">{children}</div>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
