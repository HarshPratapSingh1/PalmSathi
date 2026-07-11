import { Router } from "express";
import { getAllClaims, updateClaimStatusAdmin } from "../controllers/adminController.js";

const router = Router();

router.get("/claims", getAllClaims);
router.patch("/claims/:id/status", updateClaimStatusAdmin);

export default router;