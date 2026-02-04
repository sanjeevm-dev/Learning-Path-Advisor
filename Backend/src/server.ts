import express from "express";
import type { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import apis from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { globalRateLimiter } from "./middlewares/rateLimiter";
import helmet from "helmet";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 9000;

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(globalRateLimiter);
app.use(errorHandler);

app.use("/api", apis);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.sendStatus(200).json({ status: "OK" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
