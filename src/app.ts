import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db";
import userRoutes from "./routers/userRoutes";
import guestRoutes from "./routers/guestRoutes";
import roomRoutes from "./routers/roomRoutes";
import reservationRoutes from "./routers/reservationRoutes";
import dashboardRoutes from "./routers/dashboardRoutes";

dotenv.config();
connectDB();

const app = express();

/**
 * ✅ CORS CONFIG (FIX)
 */
app.use(
  cors({
    origin: "https://avidturerhotels.vercel.app", // frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// routes



app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reservations", reservationRoutes);

app.use("/api/users", userRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/rooms", roomRoutes);






app.get("/", (_req, res) => {
  res.send("Hotel backend running with MongoDB Atlas!");
});

export default app;
