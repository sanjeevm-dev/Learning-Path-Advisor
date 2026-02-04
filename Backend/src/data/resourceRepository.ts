import { randomUUID } from "node:crypto";
import dotenv from "dotenv";
import { LearningResource } from "../models/learningResource";
import {
  ILearningResource,
  LearningResourceModel,
} from "../models/learningResourceModel";

dotenv.config();

export interface IResourceRepository {
  findAll(): Promise<LearningResource[]>;
  findById(id: string): Promise<LearningResource | undefined>;
  create(
    data: Omit<LearningResource, "id" | "createdAt" | "updatedAt">,
  ): Promise<LearningResource>;
  replace(id: string, resource: LearningResource): Promise<void>;
  delete(id: string): Promise<boolean>;
}

export class InMemoryResourceRepository implements IResourceRepository {
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

  async findAll(): Promise<LearningResource[]> {
    return [...this.resources];
  }

  async findById(id: string): Promise<LearningResource | undefined> {
    return this.resources.find((r) => r.id === id);
  }

  async create(
    data: Omit<LearningResource, "id" | "createdAt" | "updatedAt">,
  ): Promise<LearningResource> {
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

  async replace(id: string, resource: LearningResource): Promise<void> {
    const index = this.resources.findIndex((r) => r.id === id);

    if (index !== -1) {
      this.resources[index] = resource;
    }
  }

  async delete(id: string): Promise<boolean> {
    const before = this.resources.length;
    this.resources = this.resources.filter((r) => r.id !== id);
    return this.resources.length < before;
  }
}

function mapDocToLearningResource(doc: ILearningResource): LearningResource {
  return {
    id: (doc as any)._id.toString(),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    resourceType: doc.resourceType,
    difficulty: doc.difficulty,
    tags: doc.tags,
    estimatedMinutes: doc.estimatedMinutes,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export class MongoResourceRepository implements IResourceRepository {
  async findAll(): Promise<LearningResource[]> {
    const docs = await LearningResourceModel.find().exec();
    return docs.map(mapDocToLearningResource);
  }

  async findById(id: string): Promise<LearningResource | undefined> {
    const doc = await LearningResourceModel.findById(id).exec();
    return doc ? mapDocToLearningResource(doc) : undefined;
  }

  async create(
    data: Omit<LearningResource, "id" | "createdAt" | "updatedAt">,
  ): Promise<LearningResource> {
    const doc = await LearningResourceModel.create({
      title: data.title,
      slug: data.slug,
      description: data.description,
      resourceType: data.resourceType,
      difficulty: data.difficulty,
      tags: data.tags,
      estimatedMinutes: data.estimatedMinutes,
    });

    return mapDocToLearningResource(doc);
  }

  async replace(id: string, resource: LearningResource): Promise<void> {
    await LearningResourceModel.findByIdAndUpdate(
      id,
      {
        title: resource.title,
        slug: resource.slug,
        description: resource.description,
        resourceType: resource.resourceType,
        difficulty: resource.difficulty,
        tags: resource.tags,
        estimatedMinutes: resource.estimatedMinutes,
      },
      { new: false },
    ).exec();
  }

  async delete(id: string): Promise<boolean> {
    const res = await LearningResourceModel.findByIdAndDelete(id).exec();
    return !!res;
  }
}

const storageMode = (process.env.STORAGE_MODE || "memory").toLowerCase();

export const resourceRepository: IResourceRepository =
  storageMode === "mongo"
    ? new MongoResourceRepository()
    : new InMemoryResourceRepository();
