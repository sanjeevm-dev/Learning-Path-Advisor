import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import { ResourcesService } from "../services/resourcesService";
import { validateJoiSchema } from "../utils/validateJoiSchema";
import {
  resourceIdSchema,
  createResourceSchema,
  updateResourceSchema,
  ResourceIdParam,
  CreateResourceDTO,
  UpdateResourceDTO,
} from "../schemas/resourceSchema";

export class ResourcesController {
  static async getAllResources(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const resources = ResourcesService.getAll();
      res.status(200).json(resources);
    } catch (err) {
      next(err);
    }
  }

  static async getResourceById(
    req: Request<ResourceIdParam>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      validateJoiSchema<ResourceIdParam>({
        schema: resourceIdSchema,
        data: req.params,
      });

      const resource = ResourcesService.getById(req.params.id);
      res.status(200).json(resource);
    } catch (err) {
      next(ResourcesController.mapError(err));
    }
  }

  static async createResource(
    req: Request<{}, {}, CreateResourceDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      validateJoiSchema<CreateResourceDTO>({
        schema: createResourceSchema,
        data: req.body,
        options: { abortEarly: false },
      });

      const resource = ResourcesService.create(req.body);
      res.status(201).json(resource);
    } catch (err) {
      next(err);
    }
  }

  static async updateResource(
    req: Request<ResourceIdParam, {}, UpdateResourceDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      validateJoiSchema<ResourceIdParam>({
        schema: resourceIdSchema,
        data: req.params,
      });

      validateJoiSchema<UpdateResourceDTO>({
        schema: updateResourceSchema,
        data: req.body,
        options: { abortEarly: false },
      });

      const updated = ResourcesService.update(req.params.id, req.body);

      res.status(200).json(updated);
    } catch (err) {
      next(ResourcesController.mapError(err));
    }
  }

  static async deleteResource(
    req: Request<ResourceIdParam>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      validateJoiSchema<ResourceIdParam>({
        schema: resourceIdSchema,
        data: req.params,
      });

      ResourcesService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(ResourcesController.mapError(err));
    }
  }

  /**
   * Centralized error mapping
   */
  private static mapError(err: unknown) {
    if (err instanceof Error) {
      if (err.message === "RESOURCE_NOT_FOUND") {
        return createHttpError(404, "Resource not found");
      }
    }
    return err;
  }
}
