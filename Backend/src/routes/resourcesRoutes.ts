import { Router } from "express";
import asyncFunction from "express-async-handler";
import { ResourcesController } from "../controllers/resourcesController";
import { AIController } from "../controllers/aiController";

const resourcesApi = Router();

resourcesApi.post("/recommend-path", AIController.recommendPath);

resourcesApi.get(
  "/getAllResources",
  asyncFunction(ResourcesController.getAllResources),
);
resourcesApi.get(
  "/getResourcesById/:id",
  asyncFunction(ResourcesController.getResourceById),
);
resourcesApi.post(
  "/createResource",
  asyncFunction(ResourcesController.createResource),
);
resourcesApi.put(
  "/updateResource/:id",
  asyncFunction(ResourcesController.updateResource),
);
resourcesApi.delete(
  "/deleteResource/:id",
  asyncFunction(ResourcesController.deleteResource),
);

export default resourcesApi;
