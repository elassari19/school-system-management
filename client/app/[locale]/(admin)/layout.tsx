import { Metadata } from 'next';
import { getMessages, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import TopMenuNav from '@/components/layout/top-menu-nav';
import LeftMenuNav from '@/components/layout/left-menu-nav';
import { requireAuth } from '@/lib/auth-helper';

interface IProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'School Dashboard',
  description: 'School Dashboard App',
};

export default async function LocaleLayout({ children }: IProps) {
  const messages = await getMessages();
  const user = await requireAuth();
  
  if (!user) {
    const t = await getTranslations('');
    redirect(`/${t('locale')}/sign-in`);
  }

  if (user.role === 'STUDENT') {
    const t = await getTranslations('');
    redirect(`/${t('locale')}/courses`);
  }

  return (
    <main className="w-full grid grid-cols-10">
      {/* left side nav */}
      <div className="hidden lg:block col-span-2 relative">
        <LeftMenuNav />
      </div>
      <div className="col-span-full lg:col-span-8 relative">
        <div className="h-screen w-full flex flex-col">
          <TopMenuNav />
          <div className="md:mr-4 p-6 rounded-3xl flex-1 overflow-hidden bg-white">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
