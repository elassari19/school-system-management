'use client';

import { cn } from '@/lib/utils';
import { menuList } from '@/lib/constant';
import Link from 'next/link';
import { AccordionMenu } from '../ui/accordion';
import useUrlPath from '@/hooks/use-urlPath';
import useIntlTranslations from '@/hooks/use-intl-translations';

const MenuTabs = () => {
  const { t, g } = useIntlTranslations();

  const { param, basePath } = useUrlPath();
  const params = param('tab');

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
                basePath === item.title.toLocaleLowerCase()
                  ? 'text-secondary'
                  : 'text-primary'
              )}
            >
              <item.icon
                className={cn(
                  'rounded-full p-2 w-8 h-8 bg-white group-hover:bg-secondary group-hover:text-white',
                  basePath === item.title.toLocaleLowerCase()
                    ? 'bg-secondary text-white'
                    : 'text-primary'
                )}
              />
              <span className="group-hover:text-secondary text-sm">
                {g(item.title)}
              </span>
            </Link>
          }
          accordionContent={item.list?.map((subItem) => (
            <Link
              key={subItem}
              href={`${basePath}/?tab=${subItem.toLocaleLowerCase()}`}
              locale={t('locale')}
              className={cn(
                'hover:text-secondary flex items-center gap-8 ml-4 text-sm font-semibold border-primary/30',
                t('locale') == 'en' ? 'border-l-2' : 'border-r-2'
              )}
            >
              <div
                className={cn(
                  'w-3 border',
                  params === subItem.toLocaleLowerCase()
                    ? 'border-b-primary'
                    : 'border-b-primary/50'
                )}
              />
              <p
                className={cn(
                  'text-sm',
                  params === subItem.toLocaleLowerCase()
                    ? 'text-primary'
                    : 'text-primary/50'
                )}
              >
                {g(subItem)}
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
