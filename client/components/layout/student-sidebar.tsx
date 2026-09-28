'use client';

import React from 'react';
import Image from 'next/image';
import logo from '@/app/public/assets/logo.png';
import { BookOpen, GraduationCap } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import SignOut from '@/components/auth/sign-out';
import useIntlTranslations from '@/hooks/use-intl-translations';
import { cn } from '@/lib/utils';

const StudentSidebar = () => {
  const { g } = useIntlTranslations();
  const pathname = usePathname();
  const active = pathname.includes('/courses');

  return (
    <nav className="w-full h-screen flex flex-col gap-3">
      <div className="w-full flex gap-4 items-center p-4 pt-6">
        <Image
          src={logo}
          alt="logo"
          className="w-10 h-10 border border-primary p-2 rounded-full"
          width={40}
          height={40}
        />
        <p className="font-bold font-serif">{g('School Anoul')}</p>
      </div>

      <div className="flex-1 px-6 pt-4 flex flex-col gap-2">
        <Link
          href="/courses"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 font-semibold text-sm transition',
            active ? 'bg-secondary text-white' : 'text-black hover:bg-secondary/10'
          )}
        >
          <BookOpen className="h-5 w-5" />
          {g('My Courses')}
        </Link>

        <div className="mt-auto rounded-lg border bg-white p-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs">{g('Student Portal')}</span>
          </div>
          <div className="pt-2">
            <SignOut />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentSidebar;