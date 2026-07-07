import { Router } from "express";
import { getMyWallet, redeem } from "../controllers/walletController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, getMyWallet);
router.post("/redeem", protect, redeem);

export default router;