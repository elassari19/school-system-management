import React from 'react';
import logo from '@/app/public/assets/logo.png';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import MenuTabs from '@/components/menu/menu-items';
import SelectLanguage from '../translations';

const MenuNav: React.FC = () => {
  const t = useTranslations('');

  return (
    <nav className="w-full h-screen flex flex-col gap-3">
      {/* logo */}
      <div className="w-full flex gap-4 items-center p-4 pt-6">
        <div>
          <Image
            src={logo}
            alt="logo"
            className="w-10 h-10 border border-primary p-2 rounded-full"
            width={40}
            height={40}
          />
        </div>
        <p className="font-bold font-serif">{t('School Anoul')}</p>
        <div className="self-end">
          <SelectLanguage />
        </div>
      </div>
      <div className="flex-1 overflow-auto flex flex-col gap-4 justify-start items-start">
        <MenuTabs />
      </div>
    </nav>
  );
};

export default MenuNav;
