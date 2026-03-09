import { Request, Response } from "express";
import Reservation from "../models/Reservation";
import { Room } from "../models/Room";

/* ======================================================
   CREATE RESERVATION (GUEST)
====================================================== */
export const createReservation = async (req: Request, res: Response) => {
  try {
    const {
      guestId,
      guestName,
      guestEmail,
      guestPhone,
      roomId,
      roomNumber,
      roomType,
      pricePerNight,
      checkInDate,
      checkOutDate,
      totalPrice,
    } = req.body;

    const paymentProof = req.file
      ? `/uploads/reservations/${req.file.filename}`
      : undefined;

    if (!guestId || !roomId || !checkInDate || !checkOutDate || !totalPrice || !paymentProof) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.status !== "available") return res.status(400).json({ message: "Room is not available" });

    const reservation = await Reservation.create({
      guestId,
      fullName: guestName,
      email: guestEmail,
      phoneNumber: guestPhone,
      roomId,
      roomNumber,
      roomType,
      pricePerNight,
      checkInDate,
      checkOutDate,
      totalPrice,
      paymentProof,
      status: "pending",
    });

    room.status = "occupied";
    await room.save();

    res.status(201).json({ message: "Reservation created", reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create reservation" });
  }
};

/* ======================================================
   GET GUEST RESERVATIONS
====================================================== */
export const getGuestReservations = async (req: Request, res: Response) => {
  try {
    const { guestId } = req.params;

    const reservations = await Reservation.find({ guestId })
      .populate("roomId")
      .sort({ createdAt: -1 });

    res.status(200).json({ reservations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
};

/* ======================================================
   GET ALL PENDING RESERVATIONS (ADMIN)
====================================================== */
export const getPendingReservations = async (_req: Request, res: Response) => {
  try {
    const reservations = await Reservation.find({ status: "pending" })
      .populate("roomId")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: reservations.length, reservations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending reservations" });
  }
};

/* ======================================================
   APPROVE RESERVATION (CONFIRM)
====================================================== */
export const approveReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    reservation.status = "confirmed";
    await reservation.save();

    res.status(200).json({ message: "Reservation approved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve reservation" });
  }
};

/* ======================================================
   DECLINE RESERVATION (CANCEL)
====================================================== */
export const declineReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    reservation.status = "cancelled";
    await reservation.save();

    res.status(200).json({ message: "Reservation declined" });
  } catch (error) {
    res.status(500).json({ message: "Failed to decline reservation" });
  }
};

/* ======================================================
   FRONT DESK – CHECKED-IN RECORDS
====================================================== */
export const getCheckedInReservations = async (_req: Request, res: Response) => {
  try {
    const records = await Reservation.find({ status: "confirmed" })
      .populate("roomId")
      .sort({ checkInDate: 1 });

    res.status(200).json({ records });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch checked-in records" });
  }
};

/* ======================================================
   CHECK-OUT
====================================================== */
export const checkoutReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    reservation.status = "checked_out";
    await reservation.save();

    await Room.findByIdAndUpdate(reservation.roomId, { status: "available" });

    res.status(200).json({ message: "Guest checked out" });
  } catch (error) {
    res.status(500).json({ message: "Checkout failed" });
  }
};

/* ======================================================
   DELETE RESERVATION
====================================================== */
export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete reservation", error });
  }
};


/*====================================================== */
export const getCheckedOutReservations = async (_req: Request, res: Response) => {
  try {
    const records = await Reservation.find({ status: "checked_out" })
      .populate("roomId")
      .sort({ checkOutDate: -1 }); // latest checkout first

    res.status(200).json({ records });
  } catch (error) {
    console.error("Failed to fetch checked-out records:", error);
    res.status(500).json({ message: "Failed to fetch checked-out records" });
  }
};
