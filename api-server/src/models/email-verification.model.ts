import mongoose, { Document, Schema, Types } from "mongoose";

export interface IEmailVerification extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  isVerified: boolean;
}

const EmailVerificationSchema = new Schema<IEmailVerification>(
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
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
EmailVerificationSchema.index({ token: 1 });
EmailVerificationSchema.index({ userId: 1 });

export default mongoose.model<IEmailVerification>(
  "EmailVerification",
  EmailVerificationSchema
);
