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
});
