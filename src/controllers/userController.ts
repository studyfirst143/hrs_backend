import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

/* ================= REGISTER ================= */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role, fullName, assignedBranch } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      fullName,
      assignedBranch,
    });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

/* ================= FETCH ALL USERS ================= */
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ================= UPDATE USER ================= */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, role, assignedBranch } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { fullName, role, assignedBranch },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

/* ================= DELETE USER ================= */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
