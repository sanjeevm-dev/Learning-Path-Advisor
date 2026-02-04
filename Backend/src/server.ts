import express from "express";
import type { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import apis from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { globalRateLimiter } from "./middlewares/rateLimiter";
import helmet from "helmet";
import { connectDB } from "./config/db";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 9000;
const storageMode = (process.env.STORAGE_MODE || "memory").toLowerCase();

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
app.use("/api", apis);
app.use(errorHandler);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.sendStatus(200).json({ status: "OK" });
});

async function startServer() {
  try {
    if (storageMode === "mongo") {
      await connectDB();
      console.log("Connected to MongoDB");
    } else {
      console.log("Using in-memory storage");
    }

    app.listen(port, () => {
      console.log(
        `Server is running on port ${port} (storage: ${storageMode})`,
      );
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

void startServer();

export default app;
