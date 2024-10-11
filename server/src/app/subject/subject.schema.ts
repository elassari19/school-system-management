import Joi from 'joi';

export const subjectSchema = Joi.object({
  name: Joi.string().required(),
});
