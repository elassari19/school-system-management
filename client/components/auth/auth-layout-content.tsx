'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Shield, Users, BookOpen, Sparkles } from 'lucide-react';

export default function AuthLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand header with staggered animation */}
        <div className="flex items-center justify-center gap-3 mb-10 animate-slide-up-fade">
          <Link href="/" className="flex items-center gap-3 group" aria-label="School Anoul Home">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] transition-shadow duration-500">
              <GraduationCap className="w-7 h-7 text-background" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 blur-[20px] opacity-50 -z-10" />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground tracking-tight bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300 bg-clip-text text-transparent">
                School Anoul
              </span>
              <p className="text-xs text-muted-foreground tracking-wider uppercase mt-0.5">Education Platform</p>
            </div>
          </Link>
        </div>


        {children}
      </div>
    </main>
  );
}