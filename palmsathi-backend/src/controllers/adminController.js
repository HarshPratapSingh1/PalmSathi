import SubsidyClaim from "../models/SubsidyClaim.js";
import { awardPoints } from "../services/walletService.js";

export async function getAllClaims(req, res) {
    try {
        const { secret } = req.query;
        if (secret !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ error: "Unauthorized." });
        }

        const claims = await SubsidyClaim.find()
            .populate("farmerId", "name phone village district")
            .populate("plotId", "label areaInHectares")
            .sort({ appliedAt: -1 });

        res.json(claims);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateClaimStatusAdmin(req, res) {
    try {
        const { secret, status } = req.body;
        if (secret !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ error: "Unauthorized." });
        }

        const claim = await SubsidyClaim.findById(req.params.id);
        if (!claim) return res.status(404).json({ error: "Claim not found." });

        claim.status = status;
        if (status === "verified") claim.verifiedAt = new Date();
        if (status === "disbursed") claim.disbursedAt = new Date();
        await claim.save();

        if (status === "disbursed") {
            await awardPoints(claim.farmerId.toString(), 50, "Subsidy claim disbursed");
        }

        res.json(claim);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}