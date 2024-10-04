import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import LeftMenuNav from './left-menu-nav';

const ListMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="w-6 h-6" />
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-full md:max-w-sm">
        <LeftMenuNav />
      </SheetContent>
    </Sheet>
  );
};

export default ListMenu;
