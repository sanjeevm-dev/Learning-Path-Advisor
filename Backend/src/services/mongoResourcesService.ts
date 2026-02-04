import { LearningResource } from "../models/learningResource";
import {
  ILearningResource,
  LearningResourceModel,
} from "../models/learningResourceModel";
import type { ResourceFilters } from "./resourcesService";

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

export class MongoResourcesService {
  // Get All with Filters using direct Mongo operations
  static async getAll(filters?: ResourceFilters): Promise<LearningResource[]> {
    const docs = await LearningResourceModel.find().exec();
    let resources = docs.map(mapDocToLearningResource);

    if (!filters) return resources;

    const { search, resourceType, difficulty, tags } = filters;

    if (search) {
      const term = search.toLowerCase();
      resources = resources.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term),
      );
    }

    if (resourceType) {
      resources = resources.filter(
        (r) => r.resourceType.toLowerCase() === resourceType.toLowerCase(),
      );
    }

    if (difficulty) {
      resources = resources.filter(
        (r) => r.difficulty.toLowerCase() === difficulty.toLowerCase(),
      );
    }

    if (tags && tags.length > 0) {
      resources = resources.filter((r) =>
        tags.every((tag) =>
          r.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
        ),
      );
    }

    return resources;
  }

  // Get by Id using Mongo
  static async getById(id: string): Promise<LearningResource> {
    const doc = await LearningResourceModel.findById(id).exec();
    if (!doc) {
      throw new Error("RESOURCE_NOT_FOUND");
    }
    return mapDocToLearningResource(doc);
  }

  // Create using Mongo
  static async create(
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

  // Update using Mongo
  static async update(
    id: string,
    data: Partial<Omit<LearningResource, "id" | "createdAt">>,
  ): Promise<LearningResource> {
    const doc = await LearningResourceModel.findById(id).exec();
    if (!doc) {
      throw new Error("RESOURCE_NOT_FOUND");
    }

    // Apply partial updates
    if (typeof data.title !== "undefined") doc.title = data.title;
    if (typeof data.slug !== "undefined") doc.slug = data.slug;
    if (typeof data.description !== "undefined")
      doc.description = data.description;
    if (typeof data.resourceType !== "undefined")
      doc.resourceType = data.resourceType;
    if (typeof data.difficulty !== "undefined")
      doc.difficulty = data.difficulty;
    if (typeof data.tags !== "undefined") doc.tags = data.tags;
    if (typeof data.estimatedMinutes !== "undefined")
      doc.estimatedMinutes = data.estimatedMinutes;

    await doc.save();

    return mapDocToLearningResource(doc);
  }

  // Delete using Mongo
  static async delete(id: string): Promise<void> {
    const res = await LearningResourceModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new Error("RESOURCE_NOT_FOUND");
    }
  }
}
