import Joi from 'joi';

// Define the schema for creating new course
export const courseSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(1000),
  instructor: Joi.string().required(),
  duration: Joi.number().integer().min(1),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  tags: Joi.array().items(Joi.string()),

  chapters: Joi.object({
    create: Joi.array().items(
      Joi.object({
        title: Joi.string().required().min(3).max(100),
        description: Joi.string().min(10).max(500),
        duration: Joi.number().integer().min(1),
        content: Joi.object({
          create: Joi.array().items(
            Joi.object({
              type: Joi.string()
                .valid('video', 'text', 'quiz', 'image')
                .required(),
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
                    otherwise: Joi.alternatives().conditional('type', {
                      is: 'quiz',
                      then: Joi.object({
                        questions: Joi.array().items(Joi.string()),
                      }),
                      otherwise: Joi.string(),
                    }),
                  }),
                })
                .required(),
            })
          ),
        }),
      })
    ),
  }),

  thumbnail: Joi.object({
    create: Joi.object({
      url: Joi.string().uri().required(),
    }),
  }),
});
