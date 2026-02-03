import { LearningResource } from "../models/learningResource";
import { randomUUID } from "node:crypto";

class ResourceRepository {
  private resources: LearningResource[] = [];

  constructor() {
    this.seedIfEmpty();
  }

  private seedIfEmpty() {
    if (this.resources.length > 0) return;

    const now = new Date().toISOString();

    this.resources = [
      {
        id: randomUUID(),
        title: "JavaScript Basics",
        slug: "javascript-basics",
        description: "Learn the fundamentals of JavaScript.",
        resourceType: "Article",
        difficulty: "Beginner",
        tags: ["javascript", "basics"],
        estimatedMinutes: 30,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: randomUUID(),
        title: "Advanced React Patterns",
        slug: "advanced-react-patterns",
        description: "Deep dive into advanced React concepts.",
        resourceType: "Video",
        difficulty: "Advanced",
        tags: ["react", "patterns"],
        estimatedMinutes: 90,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  findAll(): LearningResource[] {
    return [...this.resources];
  }

  findById(id: string): LearningResource | undefined {
    return this.resources.find((r) => r.id === id);
  }

  create(
    data: Omit<LearningResource, "id" | "createdAt" | "updatedAt">,
  ): LearningResource {
    const now = new Date().toISOString();

    const resource: LearningResource = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...data,
    };

    this.resources.push(resource);

    return resource;
  }

  replace(id: string, resource: LearningResource): void {
    const index = this.resources.findIndex((r) => r.id === id);

    if (index !== -1) {
      this.resources[index] = resource;
    }
  }

  delete(id: string): boolean {
    const before = this.resources.length;
    this.resources = this.resources.filter((r) => r.id !== id);
    return this.resources.length < before;
  }
}

export const resourceRepository = new ResourceRepository();
