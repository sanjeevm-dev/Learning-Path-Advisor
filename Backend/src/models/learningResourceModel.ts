// models/learningResourceModel.ts
import mongoose, { Schema, Document, model } from "mongoose";

export type ResourceType = "Article" | "Video" | "Tutorial" | "Course";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface ILearningResource extends Document {
  title: string;
  slug: string;
  description: string;
  resourceType: ResourceType;
  difficulty: Difficulty;
  tags: string[];
  estimatedMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const LearningResourceSchema: Schema<ILearningResource> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    resourceType: {
      type: String,
      required: true,
      enum: ["Article", "Video", "Tutorial", "Course"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "A resource must have at least one tag",
      },
    },
    estimatedMinutes: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }, // automatically adds createdAt and updatedAt
);

export const LearningResourceModel = model<ILearningResource>(
  "LearningResource",
  LearningResourceSchema,
);
