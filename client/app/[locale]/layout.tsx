import { Metadata } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';

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
  title: 'School Dashboard',
  description: 'School Dashboard App',
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
          <main className="w-full h-screen flex justify-center items-center">
            {children}
          </main>{' '}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
