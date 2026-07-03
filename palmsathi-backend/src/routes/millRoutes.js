import { Router } from "express";
import { createMill, listMills, getMillSlots } from "../controllers/millController.js";

const router = Router();

router.post("/", createMill);
router.get("/", listMills);
router.get("/:id/slots", getMillSlots);

export default router;
