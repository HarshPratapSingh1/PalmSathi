import { Router } from "express";
import { getYieldEstimate } from "../controllers/yieldController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/estimate", protect, getYieldEstimate);

export default router;