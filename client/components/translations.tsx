'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Link } from '../i18n/routing';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Import icons

export default function SelectLanguage() {
  const t = useTranslations('');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-2">
      <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
        <DropdownMenuTrigger
          asChild
          className="outline-none ring-0 focus:ring-0"
        >
          <Button variant="outline" className="flex items-center gap-2">
            {t('language')}
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="/" locale="en">
              English
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/" locale="ar">
              العربية
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
