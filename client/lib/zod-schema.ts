import { z } from 'zod';

export const signUpSchema = z
  .object({
    role: z.enum(['student', 'parent', 'teacher'], {
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

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const studentSchema = z.object({
  userId: z.string().optional(),
  id: z.string().optional(),
  fullname: z.string().min(1, 'Fullname is required'),
  parent: z.string().min(1, 'Parent name is required'),
  age: z.string().min(2, 'Age is required').max(2, 'Age must be between 13 and 19'),
  email: z.string().email('Invalid email address'),
  password: z.union([z.string().min(8, 'Password must be at least 8 characters long'), z.null(), z.string().length(0)]).optional(),
  phone: z.string().min(8, 'Phone is required'),
  role: z.string().min(1, 'Role is required'),
  gender: z.string().min(1, 'Gender is required'),
  image: z.string().url('Invalid image URL'),
  address: z.string().min(1, 'Address is required'),
  _class: z.string().min(1, 'class is required'),
});

export type studentType = z.infer<typeof studentSchema>;
