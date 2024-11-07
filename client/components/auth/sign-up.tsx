'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useIntlTranslations from '@/hooks/use-intl-translations';
import { signUpAction } from '../../app/api/auth';
import toast from 'react-hot-toast';
import { type SignUpFormData, signUpSchema } from '@/lib/zod-schema';

const SignUp = () => {
  const { g } = useIntlTranslations();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    // @ts-ignore
    defaultValues: { role: g('Student') },
  });

  const role = watch('role');

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    // Handle sign-up logic
    setError(null);
    try {
      const response = await signUpAction(data);
      if (response.faield) {
        return toast.error('Email or Password wrong.');
      }
      return toast.success('Successfully signed in' + response.fullname);
    } catch (err) {
      toast.error('Failed to sign in. Please try again.');
      setError('Failed to sign in. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="flex gap-1 mb-4 rounded-md overflow-hidden">
        {['Student', 'Parents', 'Teachers'].map((type) => (
          <label key={type} className="flex-1">
            <input
              type="radio"
              value={g(type)}
              {...register('role')}
              className="sr-only"
            />
            <div
              className={`text-center py-2 cursor-pointer ${
                role === g(type)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {g(type).charAt(0).toUpperCase() + g(type).slice(1)}
            </div>
          </label>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block mb-1">
            {g('Full Name')}
          </label>
          <input
            id="fullName"
            placeholder={g('Full Name')}
            {...register('fullName')}
            className="w-full px-3 py-2 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            {g('Email')}
          </label>
          <input
            id="email"
            type="email"
            placeholder={g('Email')}
            {...register('email')}
            className="w-full px-3 py-2 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            {g('Password')}
          </label>
          <input
            id="password"
            type="password"
            placeholder={g('Password')}
            {...register('password')}
            className="w-full px-3 py-2 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">
            {g('Confirm Password')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder={g('Confirm Password')}
            {...register('confirmPassword')}
            className="w-full px-3 py-2 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? `${g('SignUp')}...` : g('SignUp')}
        </button>
      </form>
    </>
  );
};

export default SignUp;
