import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  menuContent: React.ReactNode[];
  icon: React.ReactNode;
  title: string;
}

const DropDountMenu = ({ menuContent, icon, title, className }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {icon}
          <span className="sr-only">{title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className={cn('', className)}>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuContent.map((notify, index) => (
          <DropdownMenuItem key={index}>{notify}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDountMenu;
