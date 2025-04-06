import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPasswordReset extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
PasswordResetSchema.index({ token: 1 });
PasswordResetSchema.index({ userId: 1 });

export default mongoose.model<IPasswordReset>(
  "PasswordReset",
  PasswordResetSchema
);
