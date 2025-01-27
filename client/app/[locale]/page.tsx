import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { menuList } from '@/lib/constant';

export default async function Page() {
  const t = await getTranslations('');
  const g = await getTranslations('global');

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">{/* {t('welcome')} {t('language')}! */}</h1>
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold">
          {g('All')} {g('Pages')}
        </h2>
        <ul className="list-disc pl-6">
          {menuList.map((page) => (
            <li key={page.title} className="flex items-center gap-4 hover:text-secondary">
              {page.icon && <page.icon />}
              <Link
                className="block py-2 px-4 hover:bg-gray-100 font-bold text-xl"
                href={`/${t('locale')}/${page.title.toLocaleLowerCase()}`}
              >
                {g(page.title)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
