'use client';

import { cn } from '@/lib/utils';
import { menuList } from '@/lib/constant';
import Link from 'next/link';
import { AccordionMenu } from '../ui/accordion';
import { usePathname } from 'next/navigation';

const MenuTabs = () => {
  const headersList = usePathname();
  const path = headersList.split('/').at(-1);
  console.log('path', headersList);

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
                {item.title}
              </span>
            </Link>
          }
          accordionContent={item.list?.map((subItem) => (
            <Link
              key={subItem.title}
              href={`${path}/${subItem.title.toLocaleLowerCase()}`}
              className="hover:text-secondary flex items-center justify-between ml-4 pl-10 text-sm font-semibold border-l-2 border-primary/30"
            >
              {subItem.title}
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
