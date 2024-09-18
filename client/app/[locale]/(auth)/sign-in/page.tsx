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

type UserRole = 'Student' | 'Parent' | 'Teacher';

export default function SignIn() {
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
    try {
      // TODO: Implement sign-in logic here
      console.log('Sign in data:', { ...data, role: selectedRole });
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4 font-mono text-center">Sign In</h1>
      <div className="flex gap-1 mb-4 rounded-xl overflow-hidden">
        {['Student', 'Parent', 'Teacher'].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role as UserRole)}
            className={`flex-1 py-2 ${
              selectedRole === role
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded outline-primary"
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
            className="w-full px-3 py-2 border rounded outline-primary"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
        >
          Sign In
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
