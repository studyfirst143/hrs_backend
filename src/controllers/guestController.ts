import { Request, Response } from "express";
import { Guest } from "../models/Guest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// controllers/guestController.ts
export const registerGuest = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingGuest = await Guest.findOne({ email });
    if (existingGuest) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const guestID = `GUEST-${Date.now()}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const guest = new Guest({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      guestID,
    });

    await guest.save();

    res.status(201).json({
      message: "Guest registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};





export const loginGuest = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const guest = await Guest.findOne({ email });
    if (!guest || !guest.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, guest.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: guest._id.toString(),
        role: "guest",
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: Number(process.env.JWT_EXPIRES_IN),
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      guest: {
        _id: guest._id,
        fullName: guest.fullName,
        email: guest.email,
        role: "guest",
        phoneNumber: guest.phoneNumber,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};