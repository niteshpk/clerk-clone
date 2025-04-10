import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProjectRole extends Document {
  role: string;
  project_id: Types.ObjectId;
  created_by: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectRoleSchema = new Schema<IProjectRole>(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Indexes
projectRoleSchema.index({ project: 1 });
projectRoleSchema.index({ role: 1, project: 1 }, { unique: true });

export const ProjectRole = mongoose.model<IProjectRole>(
  "ProjectRole",
  projectRoleSchema
);
