import { Router } from "express";
import { register, sendOTP, verifyOTP, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/profile", protect, getProfile); // protected - requires JWT

export default router;