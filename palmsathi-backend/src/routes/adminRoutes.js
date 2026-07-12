import { Router } from "express";
import { getAllClaims, updateClaimStatusAdmin } from "../controllers/adminController.js";
import { refreshMillSlots } from "../services/millSlotRefresher.js";

const router = Router();

router.get("/claims", getAllClaims);
router.patch("/claims/:id/status", updateClaimStatusAdmin);

router.post("/refresh-slots", async (req, res) => {
    try {
        const { secret } = req.body;
        if (secret !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ error: "Unauthorized." });
        }
        await refreshMillSlots();
        res.json({ message: "Mill slots refreshed for today." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;