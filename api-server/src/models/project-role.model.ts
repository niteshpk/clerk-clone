import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProjectRole extends Document {
  name: string;
  description?: string;
  project: Types.ObjectId;
  permissions: string[];
  is_default: boolean;
  created_by: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectRoleSchema = new Schema<IProjectRole>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    permissions: [
      {
        type: String,
        required: true,
      },
    ],
    is_default: {
      type: Boolean,
      default: false,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes
projectRoleSchema.index({ project: 1 });
projectRoleSchema.index({ name: 1, project: 1 }, { unique: true });

export const ProjectRole = mongoose.model<IProjectRole>(
  "ProjectRole",
  projectRoleSchema
);
