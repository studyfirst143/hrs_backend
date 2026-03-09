import express from "express";
import {
  createReservation,
  getGuestReservations,
  getPendingReservations,
  approveReservation,
  declineReservation,
  getCheckedInReservations,
  checkoutReservation,
  deleteReservation,
  getCheckedOutReservations,
} from "../controllers/reservationController";

import { uploadReservationProof } from "../middlewares/reservationUpload";

const router = express.Router();

// GUEST
router.post("/book", uploadReservationProof.single("paymentProof"), createReservation);
router.get("/guest/:guestId", getGuestReservations);
router.get("/pending", getPendingReservations);
router.put("/approve/:id", approveReservation);
router.put("/decline/:id", declineReservation);

// FRONT DESK
router.get("/checkedin", getCheckedInReservations);
router.put("/checkout/:id", checkoutReservation);
router.get("/checkedout", getCheckedOutReservations);
// DELETE
router.delete("/:id", deleteReservation);

export default router;
