'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Link } from '../i18n/routing';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Import icons
import useUrlPath from '../hooks/use-urlPath';
import useIntlTranslations from '@/hooks/use-intl-translations';

export default function SelectLanguage() {
  const { t } = useIntlTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const { unLocalePath, pathname } = useUrlPath();

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
            <Link href={unLocalePath} locale="en">
              English
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={unLocalePath} locale="ar">
              العربية
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
