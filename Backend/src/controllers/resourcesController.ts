import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ResourcesService } from "../services/resourcesService";
import { validateJoiSchema } from "../utils/validateJoiSchema";
import {
  resourceIdSchema,
  updateResourceSchema,
  ResourceIdParam,
  CreateResourceDTO,
  UpdateResourceDTO,
  createResourceOrBulkSchema,
} from "../schemas/resourceSchema";
import { resourceQuerySchema } from "../schemas/resourceQuerySchema";

export class ResourcesController {
  static async getAllResources(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      validateJoiSchema({
        schema: resourceQuerySchema,
        data: req.query,
        options: { abortEarly: false },
      });

      const { q, resourceType, difficulty, tag } = req.query;

      const filters = {
        search: q?.toString(),
        resourceType: resourceType?.toString(),
        difficulty: difficulty?.toString(),
        tags: tag ? [tag.toString()] : undefined,
      };

      const resources = await ResourcesService.getAll(filters);

      res.status(200).json({ items: resources });
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
      validateJoiSchema({
        schema: resourceIdSchema,
        data: req.params,
      });

      const resource = await ResourcesService.getById(req.params.id);
      res.status(200).json(resource);
    } catch (err) {
      next(ResourcesController.mapError(err));
    }
  }

  static async createResource(
    req: Request<{}, {}, CreateResourceDTO | CreateResourceDTO[]>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      validateJoiSchema({
        schema: createResourceOrBulkSchema,
        data: req.body,
        options: { abortEarly: false },
      });

      const resources = Array.isArray(req.body) ? req.body : [req.body];

      const created = await Promise.all(
        resources.map((resource) => ResourcesService.create(resource)),
      );

      res.status(201).json(Array.isArray(req.body) ? created : created[0]);
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
      validateJoiSchema({
        schema: resourceIdSchema,
        data: req.params,
      });

      validateJoiSchema({
        schema: updateResourceSchema,
        data: req.body,
        options: { abortEarly: false },
      });

      const updated = await ResourcesService.update(
        req.params.id,
        req.body,
      );

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
      validateJoiSchema({
        schema: resourceIdSchema,
        data: req.params,
      });

      await ResourcesService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(ResourcesController.mapError(err));
    }
  }

  private static mapError(err: unknown) {
    if (err instanceof Error) {
      if (err.message === "RESOURCE_NOT_FOUND") {
        return createHttpError(404, "Resource not found");
      }
    }
    return err;
  }
}
