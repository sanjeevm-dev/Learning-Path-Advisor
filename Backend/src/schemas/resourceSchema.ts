import Joi, { ObjectSchema } from "joi";
import {
  LearningResource,
  ResourceType,
  Difficulty,
} from "../models/learningResource";

export interface ResourceIdParam {
  id: string;
}

export type CreateResourceDTO = Omit<
  LearningResource,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateResourceDTO = Partial<CreateResourceDTO>;

// Accept both UUID (for in-memory mode) and Mongo ObjectId (24-hex string)
export const resourceIdSchema: ObjectSchema<ResourceIdParam> = Joi.object({
  id: Joi.alternatives()
    .try(Joi.string().uuid(), Joi.string().length(24).hex())
    .required(),
});

//CreateResourceSchema for creating validation
export const createResourceSchema: ObjectSchema<CreateResourceDTO> =
  Joi.object<CreateResourceDTO>({
    title: Joi.string().min(3).max(200).required(),
    slug: Joi.string()
      .pattern(/^[a-z0-9-]+$/)
      .required(),
    description: Joi.string().min(10).required(),
    resourceType: Joi.string()
      .valid("Article", "Video", "Tutorial", "Course")
      .required(),
    difficulty: Joi.string()
      .valid("Beginner", "Intermediate", "Advanced")
      .required(),
    tags: Joi.array().items(Joi.string()).min(1).required(),
    estimatedMinutes: Joi.number().positive().required(),
  });

//UpdateResourceSchema for updating validation
export const updateResourceSchema: ObjectSchema<UpdateResourceDTO> =
  Joi.object<UpdateResourceDTO>({
    title: Joi.string().min(3).max(200),
    slug: Joi.string().pattern(/^[a-z0-9-]+$/),
    description: Joi.string().min(10),
    resourceType: Joi.string().valid("Article", "Video", "Tutorial", "Course"),
    difficulty: Joi.string().valid("Beginner", "Intermediate", "Advanced"),
    tags: Joi.array().items(Joi.string()).min(1),
    estimatedMinutes: Joi.number().positive(),
  }).min(1);

//CreateResourceOrBulkSchema for creating or bulk validation
export const createResourceOrBulkSchema = Joi.alternatives().try(
  createResourceSchema,
  Joi.array().items(createResourceSchema).min(1),
);
