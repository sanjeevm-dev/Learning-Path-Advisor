export const RESOURCE_TYPES = [
  "Article",
  "Video",
  "Tutorial",
  "Course",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  resourceType: ResourceType;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RecommendationRequest {
  goal: string;
  maxItems?: number;
}

export interface RecommendationResponse {
  summary: string;
  resources: Resource[];
  totalEstimatedMinutes: number;
  explanation: string;
}

export interface InsertResource {
  title: string;
  slug: string;
  description: string;
  resourceType: ResourceType;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tags: string[];
}
