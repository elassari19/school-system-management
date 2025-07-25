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

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Invalid email address'),
  fullname: z.string(),
  phone: z.string(),
  password: z.string().optional(),
  role: z.enum(['ADMIN', 'TEACHER', 'PARENT', 'STUDENT']).default('PARENT'),
  age: z.number().optional(),
  gender: z.string().optional(),
  image: z.string().optional(),
  address: z.string().optional(),
  salary: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const parentSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const teacherSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  subjectId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const studentSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  parentId: z.string(),
  classId: z.string(),
  attendence: z.number().default(92.5),
  status: z.string().default('Active'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const classSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  userId: z.array(z.string()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const subjectSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  userId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const courseSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  instructor: z.string(),
  duration: z.number().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  tags: z.array(z.string()),
  thumbnail: z.string(),
  subjectId: z.string(),
  userId: z.string(),
  price: z.number().default(0),
});

export const chapterSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  duration: z.number().optional(),
  courseId: z.string(),
});

export const contentSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['video', 'text', 'quiz', 'image']),
  title: z.string(),
  data: z.any(),
  chapterId: z.string(),
});

export const examSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  dueDate: z.date(),
  courseId: z.string(),
});

export const gradeSchema = z.object({
  id: z.string().optional(),
  score: z.number(),
  studentId: z.string(),
  courseId: z.string().optional(),
  examId: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  school: z.string(),
  degree: z.number(),
  image: z.string().optional(),
  field: z.string(),
  teacherId: z.string().optional(),
  from: z.date(),
  to: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string(),
  position: z.string(),
  certificate: z.string().optional(),
  teacherId: z.string().optional(),
  from: z.date(),
  to: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const groupSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  image: z.string().optional(),
  tags: z.array(z.string()),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const groupMembershipSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  groupId: z.string(),
  isAdmin: z.boolean(),
});

// Export types
export type UserType = z.infer<typeof userSchema>;
export type ParentType = z.infer<typeof parentSchema>;
export type TeacherType = z.infer<typeof teacherSchema>;
export type StudentType = z.infer<typeof studentSchema>;
export type ClassType = z.infer<typeof classSchema>;
export type SubjectType = z.infer<typeof subjectSchema>;
export type CourseType = z.infer<typeof courseSchema>;
export type ChapterType = z.infer<typeof chapterSchema>;
export type ContentType = z.infer<typeof contentSchema>;
export type ExamType = z.infer<typeof examSchema>;
export type GradeType = z.infer<typeof gradeSchema>;
export type EducationType = z.infer<typeof educationSchema>;
export type ExperienceType = z.infer<typeof experienceSchema>;
export type GroupType = z.infer<typeof groupSchema>;
export type GroupMembershipType = z.infer<typeof groupMembershipSchema>;

// form custome type
export const teacherFormSchema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  age: z.string().min(1, 'Age is required'),
  password: z
    .string()
    .optional()
    .or(z.string().min(6, 'Password must be at least 6 characters')),
  address: z.string().optional(),
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select a gender',
  }),
  subject: z.string().min(1, 'Subject is required'),
  classes: z.array(z.string().optional()).optional(),
  salary: z.string().min(1, 'Salary is required'),
  role: z.literal('TEACHER'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  image: z.string().optional(),
  education: z.array(
    z.object({
      school: z.string().min(1, 'School is required'),
      degree: z.string().min(1, 'Degree is required'),
      field: z.string().min(1, 'Field is required'),
      from: z.date(),
      to: z.date(),
    })
  ),
  experience: z.array(
    z.object({
      company: z.string().min(1, 'Company is required'),
      position: z.string().min(1, 'Position is required'),
      from: z.date(),
      to: z.date(),
    })
  ),
});
export type TeacherFormType = z.infer<typeof teacherFormSchema>;

export const studentFormSchema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  age: z.string().min(1, 'Age is required'),
  password: z
    .string()
    .optional()
    .or(z.string().min(6, 'Password must be at least 6 characters')),
  address: z.string().optional(),
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select a gender',
  }),
  parent: z.string().min(1, 'Parent is required'),
  _class: z.string().min(1, 'Class is required'),
  role: z.literal('STUDENT'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  image: z.string().optional(),
});
export type StudentFormType = z.infer<typeof studentFormSchema>;
