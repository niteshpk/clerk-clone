import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  ownerId: Types.ObjectId;
  members: Types.ObjectId[];
}

const OrgSchema = new Schema<IOrganization>({
  name: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IOrganization>("Organization", OrgSchema);
