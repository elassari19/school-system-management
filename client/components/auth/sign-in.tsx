'use client';

import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { UserRole } from '@/lib/types';
import { signInAction } from '../../app/api/auth';
import toast from 'react-hot-toast';
import useIntlTranslations from '@/hooks/use-intl-translations';
import { type SignInFormData, signInSchema } from '@/lib/zod-schema';

const SignIn = () => {
  const { g, au } = useIntlTranslations();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');

  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    try {
      const response = await signInAction(data);
      if (response.faield) {
        return toast.error('Email or Password wrong.');
      }
      return toast.success('Successfully signed in' + response.fullname);
    } catch (err) {
      toast.error('Failed to sign in. Please try again.');
      setError('Failed to sign in. Please try again.');
    }
  };

  return (
    <>
      <div className="flex gap-1 mb-4 rounded-md overflow-hidden">
        {['Student', 'Parents', 'Teachers'].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role as UserRole)}
            className={`flex-1 py-2 ${
              selectedRole === role
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {g(role)}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            {g('Email')}
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
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
            {...register('password')}
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <Link href={'/forgot-password'} className="text-sm font-bold">
            {au('Forgot password?')}
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
        >
          {g('SignIn')}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </>
  );
};

export default SignIn;
