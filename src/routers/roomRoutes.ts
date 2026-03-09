import express from "express";
import {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  viewRooms, // ✅ import
} from "../controllers/roomController";
import { uploadRoomImage } from "../middlewares/upload";

const router = express.Router();

// Admin Routes
router.post("/", uploadRoomImage.single("image"), createRoom);
router.put("/:id", uploadRoomImage.single("image"), updateRoom);
router.get("/", getRooms);
router.delete("/:id", deleteRoom);

// Frontend Route
router.get("/viewrooms", viewRooms); // ✅ new

export default router;
