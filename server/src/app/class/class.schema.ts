import Joi from 'joi';

export const classSchema = Joi.object({
  name: Joi.string().required(),
});
