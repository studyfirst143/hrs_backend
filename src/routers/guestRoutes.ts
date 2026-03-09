import { Router } from "express";
import { registerGuest, loginGuest } from "../controllers/guestController";

const router = Router();

router.post("/register", registerGuest);
router.post("/login", loginGuest);

export default router;
