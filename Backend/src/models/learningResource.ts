export type ResourceType = "Article" | "Video" | "Tutorial" | "Course";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface LearningResource {
  id: string;
  title: string;
  slug: string;
  description: string;
  resourceType: ResourceType;
  difficulty: Difficulty;
  tags: string[];
  estimatedMinutes: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
