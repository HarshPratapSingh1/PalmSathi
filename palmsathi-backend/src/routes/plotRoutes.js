import { Router } from "express";
import { createPlot, listPlots, getRipenessPrediction } from "../controllers/plotController.js";

const router = Router();

router.post("/", createPlot);
router.get("/", listPlots);
router.get("/:id/ripeness", getRipenessPrediction);

export default router;
