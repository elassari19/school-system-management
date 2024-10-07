import Joi from 'joi';

export const createSubjectSchema = Joi.object({
  name: Joi.string().required(),
});

export const createManySubjectsSchema = Joi.object({
  subjects: Joi.array().items(Joi.string()).required(),
});

export const updateSubjectSchema = Joi.object({
  name: Joi.string().required(),
});
