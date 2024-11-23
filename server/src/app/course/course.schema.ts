import Joi from "joi";

// Define the schema for creating new course
export const courseSchema = Joi.object({
  subjectId: Joi.string().required(),
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(1000),
  instructor: Joi.string().required(),
  duration: Joi.number().integer().min(1),
  level: Joi.string().valid("beginner", "intermediate", "advanced"),
  tags: Joi.array().items(Joi.string()),

  chapters: Joi.array().items(
    Joi.object({
      title: Joi.string().required().min(3).max(100),
      description: Joi.string().min(10).max(500),
      duration: Joi.number().integer().min(1),
      content: Joi.array().items(
        Joi.object({
          type: Joi.string().valid("video", "text", "quiz", "image").required(),
          title: Joi.string().required().min(3).max(100),
          data: Joi.alternatives()
            .conditional("type", {
              is: "video",
              then: Joi.object({
                url: Joi.string().uri().required(),
                duration: Joi.number().integer().min(1),
              }),
              otherwise: Joi.alternatives().conditional("type", {
                is: "image",
                then: Joi.object({
                  url: Joi.string().uri().required(),
                }),
                otherwise: Joi.any(),
              }),
            })
            .required(),
        })
      ),
    })
  ),

  thumbnail: Joi.string().uri().required(),
});

// Define the schema for updating course
export const updateCourseSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(1000),
  instructor: Joi.string().required(),
  duration: Joi.number().integer().min(1),
  level: Joi.string().valid("beginner", "intermediate", "advanced"),
  tags: Joi.array().items(Joi.string()),
});
