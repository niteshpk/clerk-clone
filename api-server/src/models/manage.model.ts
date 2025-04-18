import mongoose, { Document, Schema, Types } from "mongoose";

export interface IManagePermission extends Document {
  id: Types.ObjectId;
  project_id: Types.ObjectId;
  role_id: Types.ObjectId;
  permission_id: Types.ObjectId;
  is_checked: boolean;
  created_by: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const managePermissionSchema = new Schema<IManagePermission>(
  {
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role_id: {
      type: Schema.Types.ObjectId,
      ref: "ProjectRole",
      required: true,
    },
    permission_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    is_checked: {
      type: Boolean,
      default: false,
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
managePermissionSchema.index({ project_id: 1 });
managePermissionSchema.index({ role_id: 1 });
managePermissionSchema.index({ permission_id: 1 });
managePermissionSchema.index(
  { project_id: 1, role_id: 1, permission_id: 1 },
  { unique: true }
);

export default mongoose.model<IManagePermission>(
  "ManagePermission",
  managePermissionSchema
);
