import Joi from 'joi';

// Define the schema for creating new chapter
export const chapterSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().min(10).max(500),
  duration: Joi.number().integer().min(1),
});
