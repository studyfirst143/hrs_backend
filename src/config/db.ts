import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URI = process.env.DATABASE || "";

export const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URI);
    console.log("✅ MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
