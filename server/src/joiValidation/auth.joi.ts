import Joi from 'joi';

// Validation schema for user sign-up
export const signUpSchema = Joi.object({
  fullname: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
  }),
  address: Joi.string().min(6),
  role: Joi.string()
    .valid('ADMIN', 'TEACHER', 'PARENT', 'STUDENT')
    .default('PARENT'),
});

// Validation schema for user sign-in
export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Validation schema for password reset
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Validation schema for updating user data
export const updateUserDataSchema = Joi.object({
  fullname: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  confirmPassword: Joi.any().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match',
  }),
}).or('fullname', 'email', 'password');
