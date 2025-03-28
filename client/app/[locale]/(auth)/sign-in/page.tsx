import SignIn from '@/components/auth/sign-in';
import Link from 'next/link';
import { getCookie } from '@/lib/cookies-handler';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

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
      <div className="w-full md:w-1/2 xl:w-1/3 px-8 flex flex-col gap-2 p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4 font-mono text-center">
          {g('SignIn')}
        </h1>
        <SignIn />
        <div className="flex gap-2 items-center mt-2">
          <p>{au("Don'g have account?")}</p>
          <Link href={'sign-up'} className="text-sm font-bold">
            {g('SignUp')}
          </Link>
        </div>
      </div>
    </div>
  );
}
