import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
