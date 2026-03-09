import { Schema, model, Document } from "mongoose";

export interface IGuest extends Document {
  fullName: string;
  email?: string;
  phoneNumber: string;
  password?: string;
  status?: "active" | "inactive";
  createdAt: Date;
  lastVisit?: Date;
  guestID?: string;
}

const guestSchema = new Schema<IGuest>({
  fullName: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String, required: true },
  password: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  lastVisit: { type: Date },
  guestID: { type: String, unique: true },
});

export const Guest = model<IGuest>("guests", guestSchema);
