import { Router } from "express";
import resourcesApi from "./resourcesRoutes";

const apis = Router();

apis.use("/v1", resourcesApi);

export default apis;
