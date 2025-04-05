import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  slug: string;
  created_by: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const OrgSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
        if (ret.created_by) {
          ret.created_by = ret.created_by.toString();
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
        if (ret.created_by) {
          ret.created_by = ret.created_by.toString();
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

// Update the updated_at timestamp before saving
OrgSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

// Create a unique index on slug
OrgSchema.index({ slug: 1 }, { unique: true });

export default mongoose.model<IOrganization>("Organization", OrgSchema);
