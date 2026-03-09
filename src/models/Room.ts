import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  roomNumber: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  status: "available" | "occupied" | "maintenance";
  image?: string;
  createdAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    image: {
      type: String, // image path
    },
  },
  { timestamps: true }
);

export const Room = mongoose.model<IRoom>("Room", RoomSchema);
