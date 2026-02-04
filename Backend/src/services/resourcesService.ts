import { LearningResource } from "../models/learningResource";
import { resourceRepository } from "../data/resourceRepository";

export interface ResourceFilters {
  search?: string;
  resourceType?: string;
  difficulty?: string;
  tags?: string[];
}

export class ResourcesService {
  // Get All with Filters
  static async getAll(
    filters?: ResourceFilters,
  ): Promise<LearningResource[]> {
    let resources = await resourceRepository.findAll();

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

  // Get by Id
  static async getById(id: string): Promise<LearningResource> {
    const resource = await resourceRepository.findById(id);
    if (!resource) {
      throw new Error("RESOURCE_NOT_FOUND");
    }
    return resource;
  }

  static async create(
    data: Omit<LearningResource, "id" | "createdAt" | "updatedAt">,
  ): Promise<LearningResource> {
    return resourceRepository.create(data);
  }

  // Update
  static async update(
    id: string,
    data: Partial<Omit<LearningResource, "id" | "createdAt">>,
  ): Promise<LearningResource> {
    const existing = await resourceRepository.findById(id);
    if (!existing) {
      throw new Error("RESOURCE_NOT_FOUND");
    }

    const updated: LearningResource = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await resourceRepository.replace(id, updated);
    return updated;
  }

  // Delete
  static async delete(id: string): Promise<void> {
    const deleted = await resourceRepository.delete(id);
    if (!deleted) {
      throw new Error("RESOURCE_NOT_FOUND");
    }
  }
}
