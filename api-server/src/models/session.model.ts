import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  ip_address: string;
  user_agent: string;
  created_at: Date;
  expires_at: Date;
  is_active: boolean;
}

const SessionSchema = new Schema<ISession>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  ip_address: { type: String, required: true },
  user_agent: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true },
  is_active: { type: Boolean, default: true },
});

// Index for faster queries
SessionSchema.index({ user: 1 });
SessionSchema.index({ expires_at: 1 });
SessionSchema.index({ is_active: 1 });

export default mongoose.model<ISession>("Session", SessionSchema);
