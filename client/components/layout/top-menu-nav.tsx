import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { IoMenu, IoSearch } from 'react-icons/io5';
import DropDountMenu from '../menu/dropdown-menu';
import SignOut from '../auth/sign-out';
import { getCookie } from '@/lib/cookies-handler';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FaPlus } from 'react-icons/fa6';

const TopMenuNav = async () => {
  const auth = await getCookie('session');
  console.log('auth', auth);
  return (
    <div className="flex justify-between items-center p-4">
      {/* <Search Input /> */}
      <div className="flex items-center bg-white rounded-full overflow-hidden">
        <Input
          type="text"
          placeholder="Try Searching 'insights'"
          className="w-64 bg-white border-none"
        />
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer text-primary/40"
        >
          <IoSearch className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center gap-8">
        {/* User Options */}
        <DropDountMenu
          menuContent={['null']}
          icon={
            <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1">
              <IoMenu className="w-7 h-7" />
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>{' '}
            </div>
          }
          title="Notification"
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
              title="User Account"
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
