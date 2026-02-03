import { Router } from "express";
import asyncFunction from "express-async-handler";
import { ResourcesController } from "../controllers/resourcesController";

const resourcesApi = Router();

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
