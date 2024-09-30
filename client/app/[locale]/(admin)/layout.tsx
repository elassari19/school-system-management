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
    <main className="w-full grid grid-cols-10">
      {/* left side nav */}
      <div className="hidden md:block col-span-2 relative">
        <LeftMenuNav />
      </div>
      <div className="col-span-full md:col-span-8 relative">
        <div className="h-screen w-full flex flex-col">
          <TopMenuNav />
          <div className="md:mr-4 rounded-3xl flex-1 overflow-hidden bg-white">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
