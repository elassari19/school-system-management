import Link from 'next/link';
import SignUp from '@/components/auth/sign-up';
import { getTranslations } from 'next-intl/server';
import { getCookie } from '@/lib/cookies-handler';
import { redirect } from 'next/navigation';

export default async function page() {
  const g = await getTranslations('global');
  const au = await getTranslations('auth');
  const t = await getTranslations('');

  const auth = await getCookie('session');
  if (auth) {
    return redirect(`/${t('locale')}/dashboard`);
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full md:w-1/2 xl:w-1/3 px-8 flex flex-col gap-2 p-6 shadow-xl rounded-lg">
        <h1 className="text-2xl font-bold font-mono mb-4 text-center">
          {g('SignUp')}
        </h1>
        <SignUp />
        <div className="flex gap-2 items-center mt-2">
          <p>{au('Already have an account?')}</p>
          <Link href={'sign-in'} className="text-sm font-bold">
            {g('SignIn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
