import { Router } from "express";
import { runMatchingPass, listBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/run-matching", protect, runMatchingPass);
router.get("/", protect, listBookings);

export default router;