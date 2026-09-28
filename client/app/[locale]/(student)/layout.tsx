import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import StudentSidebar from '@/components/layout/student-sidebar';
import { requireAuth } from '@/lib/auth-helper';

interface IProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'School Anoul | My Courses',
  description: 'Student learning portal',
};

export default async function StudentLayout({ children }: IProps) {
  const user = await requireAuth();
  const t = await getTranslations('');

  if (!user) {
    redirect(`/${t('locale')}/sign-in`);
  }

  if (user.role !== 'STUDENT') {
    redirect(`/${t('locale')}/dashboard`);
  }

  return (
    <main className="w-full grid grid-cols-10">
      <div className="hidden lg:block col-span-2 relative">
        <StudentSidebar />
      </div>
      <div className="col-span-full lg:col-span-8 relative">
        <div className="h-screen w-full flex flex-col">
          <div className="md:mr-4 p-6 rounded-3xl flex-1 overflow-auto bg-white">{children}</div>
        </div>
      </div>
    </main>
  );
}