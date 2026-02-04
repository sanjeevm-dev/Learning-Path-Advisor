import mongoose from "mongoose";

const MONGO_URI: string =
  process.env.MONGO_URI || "localhost:27017/learning-advisor";

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

let cachedConnection: typeof mongoose | null = null;

export async function connectDB() {
  if (cachedConnection) {
    return cachedConnection.connection;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      autoIndex: process.env.NODE_ENV !== "production",
    });

    cachedConnection = conn;

    return conn.connection;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}
