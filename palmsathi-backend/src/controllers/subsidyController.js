import SubsidyClaim from "../models/SubsidyClaim.js";
import Plot from "../models/Plot.js";
import { awardPoints } from "../services/walletService.js";

const SCHEME_LABELS = {
    planting_material: "Planting Material Subsidy",
    drip_irrigation: "Drip Irrigation Subsidy",
    intercropping_support: "Intercropping Support Subsidy",
};

const SCHEME_MAX_AMOUNT = {
    planting_material: 15000,
    drip_irrigation: 50000,
    intercropping_support: 10000,
};

export async function fileClaim(req, res) {
    try {
        const { plotId, schemeType, claimedAmount, description } = req.body;
        const farmerId = req.farmer.id;

        const plot = await Plot.findById(plotId);
        if (!plot) return res.status(404).json({ error: "Plot not found." });

        if (plot.farmerId.toString() !== farmerId) {
            return res.status(403).json({ error: "This plot does not belong to you." });
        }

        const maxAmount = SCHEME_MAX_AMOUNT[schemeType];
        if (claimedAmount > maxAmount) {
            return res.status(400).json({ error: `Maximum claimable amount for this scheme is ₹${maxAmount}.` });
        }

        const existing = await SubsidyClaim.findOne({
            farmerId,
            plotId,
            schemeType,
            status: { $in: ["applied", "verified"] },
        });
        if (existing) {
            return res.status(400).json({ error: "You already have an active claim for this scheme on this plot." });
        }

        const claim = await SubsidyClaim.create({
            farmerId,
            plotId,
            schemeType,
            schemeLabel: SCHEME_LABELS[schemeType],
            claimedAmount,
            description,
        });

        await awardPoints(farmerId, 20, `Filed ${SCHEME_LABELS[schemeType]} claim`);

        res.status(201).json(claim);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getMyClaims(req, res) {
    try {
        const claims = await SubsidyClaim.find({ farmerId: req.farmer.id })
            .populate("plotId", "label")
            .sort({ appliedAt: -1 });
        res.json(claims);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateClaimStatus(req, res) {
    try {
        const { status } = req.body;
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