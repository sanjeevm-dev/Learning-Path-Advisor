import Joi from "joi";

export interface AIRecommendRequest {
  goal: string;
  maxItems?: number;
}

export const aiRecommendSchema = Joi.object<AIRecommendRequest>({
  goal: Joi.string().trim().min(5).required(),
  maxItems: Joi.number().integer().min(1).max(10).default(5),
});

export interface AIRecommendResponse {
  summary: string;
  resources: {
    id: string;
    title: string;
    difficulty: string;
    resourceType: string;
    estimatedMinutes: number;
  }[];
  totalEstimatedMinutes: number;
  explanation: string;
}
