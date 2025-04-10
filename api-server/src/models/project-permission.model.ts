import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProjectPermission extends Document {
  user: Types.ObjectId;
  project: Types.ObjectId;
  role: Types.ObjectId;
  permissions: string[];
  created_by: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectPermissionSchema = new Schema<IProjectPermission>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "ProjectRole",
      required: true,
    },
    permissions: [
      {
        type: String,
        required: true,
      },
    ],
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes
projectPermissionSchema.index({ user: 1, project: 1 }, { unique: true });
projectPermissionSchema.index({ project: 1 });

export default mongoose.model<IProjectPermission>(
  "ProjectPermission",
  projectPermissionSchema
);
