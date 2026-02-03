import Joi from "joi";

export interface ResourceQuery {
  search?: string;
  resourceType?: string;
  difficulty?: string;
  tags?: string[];
}

export const resourceQuerySchema = Joi.object({
  search: Joi.string().trim().min(1).optional(),

  resourceType: Joi.string()
    .valid("video", "article", "course", "blog")
    .optional(),

  difficulty: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .optional(),

  tags: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),
});
