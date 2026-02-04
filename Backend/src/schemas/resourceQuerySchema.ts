import Joi from "joi";

export interface ResourceQuery {
  q?: string;
  resourceType?: string;
  difficulty?: string;
  tag?: string;
}

//resourceQuerySchema for query validation
export const resourceQuerySchema = Joi.object<ResourceQuery>({
  q: Joi.string().trim().min(1).optional(),

  resourceType: Joi.string()
    .valid("Article", "Video", "Tutorial", "Course")
    .insensitive()
    .optional(),

  difficulty: Joi.string()
    .valid("Beginner", "Intermediate", "Advanced")
    .insensitive()
    .optional(),

  tag: Joi.string().trim().optional(),
});
