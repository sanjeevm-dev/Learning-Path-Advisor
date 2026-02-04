import rateLimit from "express-rate-limit";
import createHttpError from "http-errors";
import { Request, Response } from "express";

// Global Rate Limiter
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, _res: Response, next) => {
    next(createHttpError(429, "Too many requests. Please try again later."));
  },
});

export const writeRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, _res: Response, next) => {
    next(createHttpError(429, "Too many write requests. Slow down."));
  },
});
