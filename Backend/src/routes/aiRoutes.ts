import { Router } from "express";
import { AIController } from "../controllers/aiController";

const aiApi = Router();

aiApi.post("/recommend-path", AIController.recommendPath);

export default aiApi;

