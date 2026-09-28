'use client';

import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from '@/i18n/routing';
import { UserRole } from '@/lib/types';
import { signInAction } from '../../app/api/auth';
import toast from 'react-hot-toast';
import useIntlTranslations from '@/hooks/use-intl-translations';
import { type SignInFormData, signInSchema } from '@/lib/zod-schema';
import { Mail, Lock, Eye, EyeOff, GraduationCap, Users, Briefcase, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const roleOptions: { value: UserRole; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'Student', label: 'Student', icon: GraduationCap, color: 'amber' },
  { value: 'Parent', label: 'Parents', icon: Users, color: 'teal' },
  { value: 'Teacher', label: 'Teachers', icon: Briefcase, color: 'blue' },
  { value: 'Admin', label: 'Admin', icon: Shield, color: 'purple' },
];

const colorMap = {
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400', hover: 'hover:bg-amber-500/30', iconBg: 'bg-amber-500/20', iconText: 'text-amber-400' },
  teal: { bg: 'bg-teal-500/20', border: 'border-teal-500/30', text: 'text-teal-400', hover: 'hover:bg-teal-500/30', iconBg: 'bg-teal-500/20', iconText: 'text-teal-400' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400', hover: 'hover:bg-blue-500/30', iconBg: 'bg-blue-500/20', iconText: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400', hover: 'hover:bg-purple-500/30', iconBg: 'bg-purple-500/20', iconText: 'text-purple-400' },
};

const SignIn = () => {
  const { g, au } = useIntlTranslations();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const hidePasswordLabel = au('Hide password');
  const showPasswordLabel = au('Show password');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    try {
      const response = await signInAction(data);
      if (response.failed) {
        return toast.error(au('Email or Password wrong'));
      }
      toast.success(`${au('Successfully signed in')} ${response.fullname}`);
      router.push(response.role === 'STUDENT' ? '/courses' : '/dashboard');
      router.refresh();
    } catch {
      toast.error(au('Failed to sign in Please try again'));
      setError(au('Failed to sign in Please try again'));
    }
  };

  return (
    <>
      {/* Role Selector - Color-coded cards */}
      <div className="mb-4 animate-slide-up-fade">
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={g('Role')}>
          {roleOptions.map((role, index) => {
            const colors = colorMap[role.color as keyof typeof colorMap];
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                  'group',
                  selectedRole === role.value
                    ? `${colors.border} ${colors.bg} ${colors.text} shadow-[0_0_30px_rgba(245,158,11,0.2)]`
                    : `border-border/30 bg-secondary/30 text-muted-foreground/60 hover:border-${role.color}-500/40 hover:bg-${role.color}-500/10 hover:text-${role.color}-400`
                )}
                role="radio"
                aria-checked={selectedRole === role.value}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110',
                  selectedRole === role.value ? colors.iconBg : 'bg-background/50',
                  selectedRole === role.value ? colors.iconText : 'text-muted-foreground/40'
                )}>
                  <role.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold">{g(role.label)}</span>
                {selectedRole === role.value && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-current opacity-50" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 animate-slide-up-fade delay-100" noValidate>
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1.5">
            {g('Email')}
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-amber-400 transition-colors duration-200" aria-hidden="true" />
            <input
              {...register('email')}
              type="email"
              id="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={cn(
                'w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background/50 backdrop-blur-sm transition-all duration-300',
                'placeholder:text-muted-foreground/30',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                errors.email
                  ? 'border-destructive/50 focus:ring-destructive/50 focus:border-destructive bg-destructive/5'
                  : 'border-border/30 hover:border-amber-500/30 focus:ring-amber-500/50 focus:border-amber-500'
              )}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="text-destructive/80 text-sm mt-1 flex items-center gap-1.5" role="alert">
              <span className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true">⚠</span>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-foreground/80">
              {g('Password')}
            </label>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-amber-400 transition-colors duration-200" aria-hidden="true" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={cn(
                'w-full pl-10 pr-12 py-2.5 rounded-lg border bg-background/50 backdrop-blur-sm transition-all duration-300',
                'placeholder:text-muted-foreground/30',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                errors.password
                  ? 'border-destructive/50 focus:ring-destructive/50 focus:border-destructive bg-destructive/5'
                  : 'border-border/30 hover:border-amber-500/30 focus:ring-amber-500/50 focus:border-amber-500'
              )}
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
              aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-destructive/80 text-sm mt-1 flex items-center gap-1.5" role="alert">
              <span className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true">⚠</span>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link
            href={`/forgot-password`}
            className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-1"
          >
            {au('Forgot password?')}
          </Link>
        </div>

        {/* Submit Button - Premium gradient */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'relative w-full py-2.5 px-6 rounded-lg font-semibold text-sm overflow-hidden transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-background',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isSubmitting
              ? 'bg-gradient-to-r from-amber-500/50 to-amber-600/50 cursor-wait'
              : 'group bg-gradient-to-r from-amber-500 to-amber-600 text-amber-900 hover:from-amber-400 hover:to-amber-500 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(245,158,11,0.5)] active:scale-[0.98]'
          )}
        >
          <span className="relative flex items-center justify-center gap-2 z-10">
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {g('SignIn')}...
              </>
            ) : (
              g('SignIn')
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </form>

      {error && (
        <div
          className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive/90 text-sm animate-slide-up-fade"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            {error}
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;