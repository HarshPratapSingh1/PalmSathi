import { Router } from "express";
import { fileClaim, getMyClaims, updateClaimStatus } from "../controllers/subsidyController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, fileClaim);
router.get("/my-claims", protect, getMyClaims);
router.patch("/:id/status", protect, updateClaimStatus); // admin in production

export default router;