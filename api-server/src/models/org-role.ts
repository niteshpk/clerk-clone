import mongoose, { Document, Schema } from "mongoose";

export interface IOrganizationRole extends Document {
  organization_id: mongoose.Types.ObjectId;
  role: string;
  created_at: Date;
  updated_at: Date;
}

const organizationRoleSchema = new Schema<IOrganizationRole>({
  organization_id: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  role: {
    type: String,
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
});

// Update the updated_at timestamp before saving
organizationRoleSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const OrganizationRole = mongoose.model<IOrganizationRole>(
  "OrganizationRole",
  organizationRoleSchema
);
