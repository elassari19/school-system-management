import Link from 'next/link';
import SignUp from '@/components/auth/sign-up';
import { getTranslations } from 'next-intl/server';
import { getCookie } from '@/lib/cookies-handler';
import { redirect } from 'next/navigation';
import { UserPlus, Mail, Lock, User, Shield, Sparkles, ArrowRight } from 'lucide-react';

export default async function page() {
  const g = await getTranslations('global');
  const au = await getTranslations('auth');
  const t = await getTranslations('');

  const auth = await getCookie('session');
  if (auth) {
    return redirect(`/${t('locale')}/dashboard`);
  }

  return (
    <div className="w-full">
      {/* Sign Up Card - Dark Luxury Glassmorphism */}
      <div className="relative bg-card/60 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(245,158,11,0.05),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden noise-overlay">
        {/* Top accent gradient bar */}
        <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-600 to-amber-500" />
        
        {/* Subtle corner highlights */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-teal-500/10 to-transparent rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-500/5 to-transparent rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-500/5 to-transparent rounded-br-2xl" />
        
        <div className="relative p-8 sm:p-10">

          {/* Sign Up Form */}
          <SignUp />

          {/* Footer link */}
          <div className="mt-8 flex items-center justify-center gap-2 animate-slide-up-fade delay-400">
            <p className="text-muted-foreground/60 text-sm">{au('Already have an account?')}</p>
            <Link
              href={`/${t('locale')}/sign-in`}
              className="group relative inline-flex items-center gap-1.5 text-sm font-semibold text-orange-300 hover:text-teal-300 transition-colors"
            >
              {g('SignIn')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-muted-foreground/40 animate-slide-up-fade delay-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Ambient glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-48 bg-gradient-to-t from-teal-500/5 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}