import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { IoSearch } from 'react-icons/io5';
import DropDountMenu from '../menu/dropdown-menu';
import SignOut from '../auth/sign-out';
import { getCookie } from '@/lib/cookies-handler';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FaPlus } from 'react-icons/fa6';
import ListMenu from './list-menu';
import { Menu } from 'lucide-react';

const TopMenuNav = async () => {
  const t = await getTranslations();
  const auth = await getCookie('session');

  return (
    <div className="flex justify-between items-center p-4 py-2">
      <div className="flex items-center gap-2">
        {/* small screen menu */}
        <div className="flex lg:hidden">
          <ListMenu />
        </div>
        {/* <Search Input /> */}
        <div className="flex items-center bg-white rounded-full overflow-hidden">
          <Input
            type="text"
            placeholder={t("Try Searching 'insights'")}
            className="flex-1 mx-4 md:max-w-64 bg-white border-none"
          />
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer text-primary/40"
          >
            <IoSearch className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-8">
        {/* User Options */}
        <DropDountMenu
          menuContent={['null']}
          icon={
            <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1">
              <Menu className="w-6 h-6" />
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>{' '}
            </div>
          }
          title={t('Notification')}
        />
        {/* user account */}
        {auth ? (
          <div className="flex justify-center">
            <DropDountMenu
              menuContent={[<SignOut />]}
              icon={
                <div className="rounded-full bg-secondary w-10 h-10 flex justify-center items-center">
                  <FaPlus className="w-4 h-4 text-white" />
                </div>
              }
              title={t('User Account')}
              className="w-40 !self-end"
            />
          </div>
        ) : (
          <Link href="/en/sign-in" className="font-bold">
            SignIn
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopMenuNav;
