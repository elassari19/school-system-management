import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { IoNotificationsOutline, IoSearch } from 'react-icons/io5';
import DropDountMenu from '../menu/dropdown-menu';
import { AiOutlineMessage } from 'react-icons/ai';

const TopMenuNav = () => {
  return (
    <div className="col-span-full grid grid-cols-12 sticky top-0 z-50">
      <div className="col-span-full bg-gray-100">
        <div className="flex justify-between items-center p-4">
          {/* <Translations /> */}
          <div className="flex items-center bg-white">
            <Input
              type="text"
              placeholder="Search..."
              className="w-64 bg-white outline-none border-none"
            />
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <IoSearch className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <DropDountMenu
              menuContent={['null']}
              icon={<AiOutlineMessage className="w-7 h-7" />}
              title="Messages"
            />
            <DropDountMenu
              menuContent={['null']}
              icon={<IoNotificationsOutline className="w-7 h-7" />}
              title="Notification"
            />
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="font-semibold">John Doe</span>
                <span className="text-sm text-gray-500">Student</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600 mr-2">
                JD
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMenuNav;
