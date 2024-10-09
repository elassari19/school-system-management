import Joi from 'joi';

// Define the schema for creating new content
export const contentSchema = Joi.object({
  type: Joi.string().valid('video', 'text', 'quiz', 'image').required(),
  title: Joi.string().required().min(3).max(100),
  data: Joi.alternatives()
    .conditional('type', {
      is: 'video',
      then: Joi.object({
        url: Joi.string().uri().required(),
        duration: Joi.number().integer().min(1),
      }),
      otherwise: Joi.alternatives().conditional('type', {
        is: 'image',
        then: Joi.object({
          url: Joi.string().uri().required(),
        }),
        otherwise: Joi.any(),
      }),
    })
    .required(),
});
