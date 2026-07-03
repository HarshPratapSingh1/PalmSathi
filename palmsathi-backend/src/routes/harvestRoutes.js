import { Router } from "express";
import { markHarvested, listPendingBatches } from "../controllers/harvestController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, markHarvested);
router.get("/pending", protect, listPendingBatches);

export default router;