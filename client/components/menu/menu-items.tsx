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
              href={`/${t('locale')}/${item.title.toLocaleLowerCase()}`}
              className={cn(
                'group flex items-center justify-between gap-4 font-semibold',
                basePath === item.title.toLocaleLowerCase() ? 'text-secondary' : 'text-black'
              )}
            >
              <item.icon
                className={cn(
                  'rounded-full p-2 w-8 h-8 bg-white group-hover:bg-secondary group-hover:text-white',
                  basePath === item.title.toLocaleLowerCase()
                    ? 'bg-secondary text-white'
                    : 'text-black'
                )}
              />
              <span className="group-hover:text-secondary text-sm">{g(item.title)}</span>
            </Link>
          }
          accordionContent={item.list?.map((subItem) => (
            <Link
              key={subItem}
              href={`/${t(
                'locale'
              )}/${item.title.toLocaleLowerCase()}/${subItem.toLocaleLowerCase()}`}
              locale={t('locale')}
              className={cn(
                'hover:text-secondary/60 flex items-center gap-8 ml-4 text-sm font-semibold border-black/30',
                t('locale') == 'en' ? 'border-l-2' : 'border-r-2'
              )}
            >
              <div
                className={cn(
                  'w-3 border',
                  params === subItem.toLocaleLowerCase()
                    ? 'border-b-black'
                    : 'border-b-black/50'
                )}
              />
              <p
                className={cn(
                  'text-sm hover:text-secondary/60',
                  params === subItem.toLocaleLowerCase() ? 'text-primary' : 'text-black/50'
                )}
              >
                {g(subItem)}
              </p>
            </Link>
          ))}
          value={`/${t('locale')}/${item.title.toLocaleLowerCase()}`}
          key={item.title}
          active={basePath == item.title.toLocaleLowerCase()}
        />
      ))}
    </div>
  );
};

export default MenuTabs;
