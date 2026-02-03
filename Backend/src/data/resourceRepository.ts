import { LearningResource } from "../models/learningResource";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

class ResourceRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, "resources.json");

    this.ensureFile();
    this.seedIfEmpty();
  }

  private ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  private seedIfEmpty() {
    const data = this.read();
    if (data.length > 0) return;

    const now = new Date().toISOString();

    const seedData: LearningResource[] = [
      {
        id: randomUUID(),
        title: "JavaScript Basics",
        slug: "javascript-basics",
        description: "Learn the fundamentals of JavaScript",
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
        description: "Deep dive into advanced React concepts",
        resourceType: "Video",
        difficulty: "Advanced",
        tags: ["react", "patterns"],
        estimatedMinutes: 90,
        createdAt: now,
        updatedAt: now,
      },
    ];

    this.write(seedData);
  }

  private read(): LearningResource[] {
    const raw = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(raw);
  }

  private write(data: LearningResource[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  findAll(): LearningResource[] {
    return this.read();
  }

  findById(id: string): LearningResource | undefined {
    return this.read().find((r) => r.id === id);
  }

  create(
    data: Omit<LearningResource, "id" | "createdAt" | "updatedAt">,
  ): LearningResource {
    const resources = this.read();
    const now = new Date().toISOString();

    const resource: LearningResource = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...data,
    };

    resources.push(resource);
    this.write(resources);

    return resource;
  }

  replace(id: string, resource: LearningResource): void {
    const resources = this.read();
    const index = resources.findIndex((r) => r.id === id);

    if (index !== -1) {
      resources[index] = resource;
      this.write(resources);
    }
  }

  delete(id: string): boolean {
    const resources = this.read();
    const filtered = resources.filter((r) => r.id !== id);

    if (filtered.length === resources.length) return false;

    this.write(filtered);
    return true;
  }
}

export const resourceRepository = new ResourceRepository();
