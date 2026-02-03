import type { Resource } from "../redux/resourcesSlice";

export type RESOURCE_TYPES = "video" | "article" | "course" | "blog";

export type DIFFICULTIES = "beginner" | "intermediate" | "advanced";
export type RecommendationRequest = {
  goal: string;
  maxItems?: number;
};

export type RecommendationResponse = {
  data: Resource[];
  error?: string;
};

export interface InsertResource {
  title: string;
  description: string;
  resourceType: string;
  difficulty: string;
  estimatedMinutes: number;
  tags: string[];
}
