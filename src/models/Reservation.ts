import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  guestId: mongoose.Types.ObjectId;

  fullName?: string;
  email?: string;
  phoneNumber?: string;

  roomId: mongoose.Types.ObjectId;
  roomNumber?: string;
  roomType?: string;
  pricePerNight?: number;

  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;

  paymentProof: string;

  status: "pending" | "confirmed" | "checked_out" | "cancelled";

  createdAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    guestId: {
      type: Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },

    /* SNAPSHOT GUEST DATA */
    fullName: String,
    email: String,
    phoneNumber: String,

    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    /* SNAPSHOT ROOM DATA */
    roomNumber: String,
    roomType: String,
    pricePerNight: Number,

    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },

    paymentProof: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "checked_out", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReservation>("Reservation", ReservationSchema);
