'use client';

import { cn } from '@/lib/utils';
import { menuList } from '@/lib/constant';
import Link from 'next/link';
import { AccordionMenu } from '../ui/accordion';
import { useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const MenuTabs = () => {
  const t = useTranslations();
  const headersList = usePathname();
  const params = useSearchParams().get('tab');
  const path = headersList.split('/').at(-1);
  console.log('path', headersList, params);

  return (
    <div className="flex-1 w-full px-6 flex flex-col gap-4 py-4">
      {menuList.map((item) => (
        <AccordionMenu
          accordionTrigger={
            <Link
              key={item.title}
              href={item.title.toLocaleLowerCase()}
              className={cn(
                'group flex items-center justify-between gap-4 font-semibold',
                path === item.title.toLocaleLowerCase()
                  ? 'text-secondary'
                  : 'text-primary'
              )}
            >
              <item.icon
                className={cn(
                  'rounded-full p-2 w-8 h-8 bg-white group-hover:bg-secondary group-hover:text-white',
                  path === item.title.toLocaleLowerCase()
                    ? 'bg-secondary text-white'
                    : 'text-primary'
                )}
              />
              <span className="group-hover:text-secondary text-sm">
                {t(item.title)}
              </span>
            </Link>
          }
          accordionContent={item.list?.map((subItem) => (
            <Link
              key={subItem.title}
              href={`${path}/?tab=${subItem.title.toLocaleLowerCase()}`}
              className={cn(
                'hover:text-secondary flex items-center gap-8 ml-4 text-sm font-semibold border-primary/30',
                t('loacle') == 'en' ? 'border-l-2' : 'border-r-2'
              )}
            >
              <div
                className={cn(
                  'w-3 border',
                  params === subItem.title.toLocaleLowerCase()
                    ? 'border-b-primary'
                    : 'border-b-primary/50'
                )}
              />
              <p
                className={cn(
                  'text-sm',
                  params === subItem.title.toLocaleLowerCase()
                    ? 'text-primary'
                    : 'text-primary/50'
                )}
              >
                {t(subItem.title)}
              </p>
            </Link>
          ))}
          value={item.title.toLocaleLowerCase()}
          key={item.title}
        />
      ))}
    </div>
  );
};

export default MenuTabs;
