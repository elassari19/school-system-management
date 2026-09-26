import SignIn from '@/components/auth/sign-in';
import Link from 'next/link';
import { getCookie } from '@/lib/cookies-handler';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Lock, Mail, Eye, EyeOff, Globe, ArrowRight } from 'lucide-react';

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
      {/* Sign In Card - Dark Luxury Glassmorphism */}
      <div className="relative bg-card/60 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(245,158,11,0.05),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden noise-overlay">
        {/* Top accent gradient bar */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-600 to-teal-500" />
        
        {/* Subtle corner highlights */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-teal-500/5 to-transparent rounded-br-2xl" />
        
        <div className="relative p-8 sm:p-10">

          {/* Sign In Form */}
          <SignIn />

          {/* Divider with gradient */}
          <div className="relative my-4 animate-slide-up-fade delay-400">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card/50 backdrop-blur-sm text-muted-foreground/50 border border-border/20 rounded-full">
                {au('Or continue with')}
              </span>
            </div>
          </div>

          {/* Social login buttons - Elevated dark style */}
          <div className="mb-10 animate-slide-up-fade delay-500">
            <button
              type="button"
              className="group relative w-full flex items-center justify-center gap-3 px-5 py-3.5 border border-border/50 rounded-xl text-sm font-medium text-foreground bg-card/50 backdrop-blur-sm hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-background"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </button>
          </div>

          {/* Footer link - Styled as CTA */}
          <div className="flex items-center justify-center gap-2 animate-slide-up-fade delay-600">
            <p className="text-muted-foreground/60 text-sm">{au("Don't have account?")}</p>
            <Link
              href={`/${t('locale')}/sign-up`}
              className="group relative inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              {g('SignUp')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Ambient glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-48 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}