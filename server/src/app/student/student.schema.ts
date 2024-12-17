import Joi from "joi";

export const studentSchema = Joi.object({
  userId: Joi.string().required(),
  classId: Joi.string().required(),
  parentId: Joi.string().required(),
  attendence: Joi.number().min(80).max(100).default(92.5),
  status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  grade: Joi.array().items(
    Joi.object({
      subjectId: Joi.string().required(),
      score: Joi.number().min(0).max(100).required(),
    })
  ),
});
