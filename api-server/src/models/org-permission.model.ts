import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPermission extends Document {
  name: string;
  description?: string;
  organization_id: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const PermissionSchema = new Schema<IPermission>(
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
    organization_id: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        if (ret.organization_id) {
          ret.organization_id = ret.organization_id.toString();
        }
        if (ret.created_at) {
          ret.created_at = ret.created_at.toISOString();
        }
        if (ret.updated_at) {
          ret.updated_at = ret.updated_at.toISOString();
        }
        delete ret.__v;
        delete ret.$__;
        delete ret.$isNew;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        if (ret.organization_id) {
          ret.organization_id = ret.organization_id.toString();
        }
        if (ret.created_at) {
          ret.created_at = ret.created_at.toISOString();
        }
        if (ret.updated_at) {
          ret.updated_at = ret.updated_at.toISOString();
        }
        delete ret.__v;
        delete ret.$__;
        delete ret.$isNew;
        return ret;
      },
    },
  }
);

// Create a compound unique index on name and organization_id
PermissionSchema.index({ name: 1, organization_id: 1 }, { unique: true });

// Update the updated_at timestamp before saving
PermissionSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<IPermission>("Permission", PermissionSchema);
