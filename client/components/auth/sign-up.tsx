'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useIntlTranslations from '@/hooks/use-intl-translations';
import { signUpAction } from '../../app/api/auth';
import toast from 'react-hot-toast';
import { type SignUpFormData, signUpSchema } from '@/lib/zod-schema';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

const roleOptions = [
  { value: 'student', label: 'Student', icon: GraduationCap, color: 'amber' },
  { value: 'parent', label: 'Parents', icon: Users, color: 'teal' },
  { value: 'teacher', label: 'Teachers', icon: Briefcase, color: 'blue' },
];

const colorMap = {
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400', hover: 'hover:bg-amber-500/30', iconBg: 'bg-amber-500/20', iconText: 'text-amber-400' },
  teal: { bg: 'bg-teal-500/20', border: 'border-teal-500/30', text: 'text-teal-400', hover: 'hover:bg-teal-500/30', iconBg: 'bg-teal-500/20', iconText: 'text-teal-400' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400', hover: 'hover:bg-blue-500/30', iconBg: 'bg-blue-500/20', iconText: 'text-blue-400' },
};

const SignUp = () => {
  const { g, au } = useIntlTranslations();
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hidePasswordLabel = g('Hide password');
  const showPasswordLabel = g('Show password');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role: 'student' },
  });

  const role = watch('role');

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signUpAction(data);
      if (response.faield) {
        return toast.error(au('Email or Password wrong'));
      }
      return toast.success(`${au('Successfully signed up')} ${response.fullname}`);
    } catch {
      toast.error(au('auth.failedToSignUp'));
      setError(au('auth.failedToSignUp'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Role Selector - Color-coded cards */}
      <div className="mb-4 animate-slide-up-fade">
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={g('Role')}>
          {roleOptions.map((roleOption, index) => {
            const colors = colorMap[roleOption.color as keyof typeof colorMap];
            return (
              <button
                key={roleOption.value}
                type="button"
                onClick={() => setSelectedRole(roleOption.value)}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                  'group',
                  selectedRole === roleOption.value
                    ? `${colors.border} ${colors.bg} ${colors.text} shadow-[0_0_30px_rgba(245,158,11,0.2)]`
                    : `border-border/30 bg-secondary/30 text-muted-foreground/60 hover:border-${roleOption.color}-500/40 hover:bg-${roleOption.color}-500/10 hover:text-${roleOption.color}-400`
                )}
                role="radio"
                aria-checked={selectedRole === roleOption.value}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110',
                  selectedRole === roleOption.value ? colors.iconBg : 'bg-background/50',
                  selectedRole === roleOption.value ? colors.iconText : 'text-muted-foreground/40'
                )}>
                  <roleOption.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold capitalize">{g(roleOption.label)}</span>
                {selectedRole === roleOption.value && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-current opacity-50" />
                )}
              </button>
            );
          })}
        </div>
        {errors.role && (
          <p className="text-destructive/80 text-sm mt-1.5 flex items-center gap-1.5" role="alert">
            <span className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true">⚠</span>
            {errors.role.message}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 animate-slide-up-fade delay-100" noValidate>
        {/* Full Name Field */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground/80 mb-1.5">
            {g('Full Name')}
          </label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-amber-400 transition-colors duration-200" aria-hidden="true" />
            <input
              id="fullName"
              placeholder={g('Full Name')}
              {...register('fullName')}
              autoComplete="name"
              className={cn(
                'w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background/50 backdrop-blur-sm transition-all duration-300',
                'placeholder:text-muted-foreground/30',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                errors.fullName
                  ? 'border-destructive/50 focus:ring-destructive/50 focus:border-destructive bg-destructive/5'
                  : 'border-border/30 hover:border-amber-500/30 focus:ring-amber-500/50 focus:border-amber-500'
              )}
              aria-invalid={errors.fullName ? 'true' : 'false'}
              aria-describedby={errors.fullName ? 'fullname-error' : undefined}
              disabled={isLoading}
            />
          </div>
          {errors.fullName && (
            <p id="fullname-error" className="text-destructive/80 text-sm mt-1 flex items-center gap-1.5" role="alert">
              <span className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true">⚠</span>
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1.5">
            {g('Email')}
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-amber-400 transition-colors duration-200" aria-hidden="true" />
            <input
              id="email"
              type="email"
              placeholder={g('Email')}
              {...register('email')}
              autoComplete="email"
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
              disabled={isLoading}
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
          <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-1.5">
            {g('Password')}
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-amber-400 transition-colors duration-200" aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={g('Password')}
              {...register('password')}
              autoComplete="new-password"
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
              disabled={isLoading}
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

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground/80 mb-1.5">
            {g('Confirm Password')}
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-amber-400 transition-colors duration-200" aria-hidden="true" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={g('Confirm Password')}
              {...register('confirmPassword')}
              autoComplete="new-password"
              className={cn(
                'w-full pl-10 pr-12 py-2.5 rounded-lg border bg-background/50 backdrop-blur-sm transition-all duration-300',
                'placeholder:text-muted-foreground/30',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                errors.confirmPassword
                  ? 'border-destructive/50 focus:ring-destructive/50 focus:border-destructive bg-destructive/5'
                  : 'border-border/30 hover:border-amber-500/30 focus:ring-amber-500/50 focus:border-amber-500'
              )}
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
              aria-label={showConfirmPassword ? hidePasswordLabel : showPasswordLabel}
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="text-destructive/80 text-sm mt-1 flex items-center gap-1.5" role="alert">
              <span className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true">⚠</span>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button - Premium gradient (amber for sign up to match sign in) */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'relative w-full py-2.5 px-6 rounded-lg font-semibold text-sm overflow-hidden transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-background',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isLoading
              ? 'bg-gradient-to-r from-amber-500/50 to-amber-600/50 cursor-wait'
              : 'group bg-gradient-to-r from-amber-500 to-amber-600 text-amber-900 hover:from-amber-400 hover:to-amber-500 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(245,158,11,0.5)] active:scale-[0.98]'
          )}
        >
          <span className="relative flex items-center justify-center gap-2 z-10">
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {g('SignUp')}...
              </>
            ) : (
              g('SignUp')
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

export default SignUp;