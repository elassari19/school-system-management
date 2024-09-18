'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const signUpSchema = z
  .object({
    userType: z.enum(['student', 'parent', 'teacher'], {
      required_error: 'Please select a user type',
    }),
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { userType: 'student' },
  });

  const userType = watch('userType');

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    // Handle sign-up logic here
    console.log(data);
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <div className="flex gap-1 mb-4 rounded-xl overflow-hidden">
        {['student', 'parent', 'teacher'].map((type) => (
          <label key={type} className="flex-1">
            <input
              type="radio"
              value={type}
              {...register('userType')}
              className="sr-only"
            />
            <div
              className={`text-center py-2 cursor-pointer ${
                userType === type
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
          </label>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            {...register('fullName')}
            className="w-full px-3 py-2 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="w-full px-3 py-2 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
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
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
