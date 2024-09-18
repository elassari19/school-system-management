import { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import '../../globals.css';
import TopMenuNav from '@/components/layout/top-menu-nav';
import LeftMenuNav from '@/components/layout/left-menu-nav';

interface IProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'School Dashboard',
  description: 'School Dashboard App',
};

export default async function LocaleLayout({ children }: IProps) {
  const messages = await getMessages();

  return (
    <body>
      <main className="grid grid-cols-12">
        {/* left side nav */}
        <div className="col-span-2 relative">
          <LeftMenuNav />
        </div>
        <div className="col-span-10 relative">
          <TopMenuNav />
          <div className="col-span-12 p-4 pt-16">{children}</div>
        </div>
      </main>
    </body>
  );
}
