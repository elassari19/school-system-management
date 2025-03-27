import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  fullname: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  age: Joi.number().required(),
  gender: Joi.string().required(),
  image: Joi.string().optional(),
  address: Joi.string().optional(),
  salary: Joi.number().optional(),
  teacher: Joi.any(),
  student: Joi.any(),
  parent: Joi.any(),
});

export const userUpdateSchema = Joi.object({
  where: Joi.object({
    id: Joi.string().required(),
  }),
  data: Joi.object({
    email: Joi.string().allow('').email().optional(),
    fullname: Joi.string().allow('').optional(),
    phone: Joi.string().allow('').optional(),
    password: Joi.string().allow('').optional(),
    role: Joi.string().allow('').optional(),
    age: Joi.number().optional(),
    gender: Joi.string().allow('').optional(),
    image: Joi.string().allow('').optional(),
    address: Joi.string().allow('').optional(),
    salary: Joi.number().allow('').optional(),
    teacher: Joi.any(),
    student: Joi.any(),
    parent: Joi.any(),
  }),
  include: Joi.any(),
});
