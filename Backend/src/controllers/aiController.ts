import { Request, Response, NextFunction } from "express";
import { validateJoiSchema } from "../utils/validateJoiSchema";
import {
  aiRecommendSchema,
  AIRecommendRequest,
} from "../schemas/aiRecommendationSchema";
import { AIService } from "../services/aiService";

export class AIController {
  static async recommendPath(
    req: Request<{}, {}, AIRecommendRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      validateJoiSchema({
        schema: aiRecommendSchema,
        data: req.body,
        options: { abortEarly: false },
      });

      const result = AIService.recommendLearningPath(req.body);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
