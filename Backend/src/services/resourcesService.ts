import { LearningResource } from "../models/learningResource";
import { resourceRepository } from "../data/resourceRepository";

export interface ResourceFilters {
  search?: string;
  resourceType?: string;
  difficulty?: string;
  tags?: string[];
}

export class ResourcesService {
  static getAll(filters?: ResourceFilters): LearningResource[] {
    let resources = resourceRepository.findAll();

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

  static getById(id: string): LearningResource {
    const resource = resourceRepository.findById(id);
    if (!resource) {
      throw new Error("RESOURCE_NOT_FOUND");
    }
    return resource;
  }

  static create(
    data: Omit<LearningResource, "id" | "createdAt" | "updatedAt">,
  ): LearningResource {
    return resourceRepository.create(data);
  }

  static update(
    id: string,
    data: Partial<Omit<LearningResource, "id" | "createdAt">>,
  ): LearningResource {
    const existing = resourceRepository.findById(id);
    if (!existing) {
      throw new Error("RESOURCE_NOT_FOUND");
    }

    const updated: LearningResource = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    resourceRepository.replace(id, updated);
    return updated;
  }

  static delete(id: string): void {
    const deleted = resourceRepository.delete(id);
    if (!deleted) {
      throw new Error("RESOURCE_NOT_FOUND");
    }
  }
}
