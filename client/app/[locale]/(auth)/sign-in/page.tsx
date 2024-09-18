'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      // TODO: Implement sign-in logic here
      console.log('Sign in data:', data);
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded"
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
            {...register('password')}
            type="password"
            id="password"
            className="w-full px-3 py-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
