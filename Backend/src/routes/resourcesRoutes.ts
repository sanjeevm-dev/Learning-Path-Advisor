import { Router } from "express";
import asyncFunction from "express-async-handler";
import { ResourcesController } from "../controllers/resourcesController";

const resourcesApi = Router();

resourcesApi.get(
  "/",
  asyncFunction(ResourcesController.getAllResources),
);

resourcesApi.get(
  "/:id",
  asyncFunction(ResourcesController.getResourceById),
);

resourcesApi.post(
  "/",
  asyncFunction(ResourcesController.createResource),
);

resourcesApi.put(
  "/:id",
  asyncFunction(ResourcesController.updateResource),
);

resourcesApi.delete(
  "/:id",
  asyncFunction(ResourcesController.deleteResource),
);

export default resourcesApi;
