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

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - instructor
 *         - duration
 *         - level
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         instructor:
 *           type: string
 *         duration:
 *           type: string
 *         level:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         chapters:
 *           type: array
 *           items:
 *             type: object
 *         thumbnail:
 *           type: string
 */
