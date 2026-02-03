import { LearningResource } from "../models/learningResource";
import { resourceRepository } from "../data/resourceRepository";

export class ResourcesService {
  static getAll(): LearningResource[] {
    return resourceRepository.findAll();
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
