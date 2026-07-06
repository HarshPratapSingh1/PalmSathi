import { Router } from "express";
import { getAdvisoryForPlot, getAdvisoryHistory } from "../controllers/advisoryController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/:plotId", protect, getAdvisoryForPlot);
router.get("/:plotId/history", protect, getAdvisoryHistory);

export default router;