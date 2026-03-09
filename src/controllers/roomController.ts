import { Request, Response } from "express"; 
import { Room } from "../models/Room";
import fs from "fs";
import path from "path";

/**
 * CREATE ROOM
 */
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { roomNumber, roomType, capacity, pricePerNight, status } = req.body;

    const existing = await Room.findOne({ roomNumber });
    if (existing) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const room = new Room({
      roomNumber,
      roomType,
      capacity,
      pricePerNight,
      status,
      image: req.file ? `/uploads/rooms/${req.file.filename}` : undefined,
    });

    await room.save();

    res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * GET ALL ROOMS (Admin)
 */
export const getRooms = async (_req: Request, res: Response) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * VIEW ROOMS (Frontend)
 */
export const viewRooms = async (_req: Request, res: Response) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * GET SINGLE ROOM
 */
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * UPDATE ROOM
 */
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const updates: any = { ...req.body };

    if (req.file) {
      updates.image = `/uploads/rooms/${req.file.filename}`;
    }

    const room = await Room.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({ message: "Room updated successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * DELETE ROOM
 */
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // DELETE IMAGE FILE kung meron
    if (room.image) {
      const imagePath = path.join(__dirname, "../../uploads/rooms", path.basename(room.image));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await room.deleteOne();

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
