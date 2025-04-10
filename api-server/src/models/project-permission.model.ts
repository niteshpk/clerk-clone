import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProjectPermission extends Document {
  id: Types.ObjectId;
  project_id: Types.ObjectId;
  permission: string;
  created_by: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectPermissionSchema = new Schema<IProjectPermission>(
  {
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    permission: {
      type: String,
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
projectPermissionSchema.index({ project: 1 });
projectPermissionSchema.index({ permission: 1, project: 1 }, { unique: true });

export default mongoose.model<IProjectPermission>(
  "ProjectPermission",
  projectPermissionSchema
);
