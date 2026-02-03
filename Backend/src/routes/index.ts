import { Router } from "express";
import resourcesApi from "./resourcesRoutes";
import aiApi from "./aiRoutes";

const apis = Router();

// /api/resources
apis.use("/resources", resourcesApi);

// /api/ai/recommend-path
apis.use("/ai", aiApi);

export default apis;
