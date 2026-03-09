import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "staff";
  fullName: string;
  profilePic?: string;
  status?: "active" | "inactive";
  assignedBranch?: string;
  createdAt: Date;
  lastLogin?: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "staff"], required: true },
  fullName: { type: String, required: true },
  profilePic: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  assignedBranch: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
},  { timestamps: true });

export const User = model<IUser>("users", userSchema);
