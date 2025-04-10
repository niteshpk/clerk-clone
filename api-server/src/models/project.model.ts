import mongoose, { Document, Schema, Types } from "mongoose";
import { ApiResponseBuilder } from "../types/api-response";

export interface IProject extends Document {
  name: string;
  slug: string;
  created_by: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Indexes
ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ created_by: 1 });

export default mongoose.model<IProject>("Project", ProjectSchema);
