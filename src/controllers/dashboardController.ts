import { Request, Response } from "express";
import Reservation from "../models/Reservation";
import { Room } from "../models/Room";
import { User } from "../models/User";
import { Guest } from "../models/Guest";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    // ================= TODAY RANGE =================
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // ================= MONTH RANGE =================
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // ================= YEAR RANGE =================
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    // ================= SALES TODAY =================
    const salesToday = await Reservation.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: { $in: ["confirmed", "checked_out"] },
        },
      },
      {
        $group: { _id: null, total: { $sum: "$totalPrice" } },
      },
    ]);

    // ================= SALES MONTH =================
    const salesMonth = await Reservation.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ["confirmed", "checked_out"] },
        },
      },
      {
        $group: { _id: null, total: { $sum: "$totalPrice" } },
      },
    ]);

    // ================= SALES YEAR =================
    const salesYear = await Reservation.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear },
          status: { $in: ["confirmed", "checked_out"] },
        },
      },
      {
        $group: { _id: null, total: { $sum: "$totalPrice" } },
      },
    ]);

    // ================= USERS =================
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalStaff = await User.countDocuments({ role: "staff" });
    const totalGuests = await Guest.countDocuments();

    // ================= ROOMS =================
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: "occupied" });
    const availableRooms = await Room.countDocuments({ status: "available" });

    // ================= CHECK-IN / CHECK-OUT TODAY =================
    const checkInToday = await Reservation.countDocuments({
      status: "confirmed",
      checkInDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const checkOutToday = await Reservation.countDocuments({
      status: "checked_out",
      checkOutDate: { $gte: startOfDay, $lte: endOfDay },
    });

    // ================= RESPONSE =================
    res.json({
      salesToday: salesToday[0]?.total || 0,
      salesMonth: salesMonth[0]?.total || 0,
      salesYear: salesYear[0]?.total || 0,

      users: {
        admins: totalAdmins,
        staff: totalStaff,
        guests: totalGuests,
      },

      rooms: {
        total: totalRooms,
        occupied: occupiedRooms,
        available: availableRooms,
      },

      todayGuests: {
        checkIn: checkInToday,
        checkOut: checkOutToday,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
