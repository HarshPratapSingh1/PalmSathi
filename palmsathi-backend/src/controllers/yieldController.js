import Plot from "../models/Plot.js";
import Mill from "../models/Mill.js";
import { estimateYieldAndPayout } from "../services/yieldEstimator.js";

export async function getYieldEstimate(req, res) {
    try {
        const { plotId, millId, season } = req.query;

        const plot = await Plot.findById(plotId);
        if (!plot) return res.status(404).json({ error: "Plot not found." });

        const mill = await Mill.findById(millId);
        if (!mill) return res.status(404).json({ error: "Mill not found." });

        const estimate = estimateYieldAndPayout(
            { palmCount: plot.palmCount, ageInYears: plot.ageInYears },
            { todayOfferedPricePerKg: mill.todayOfferedPricePerKg, govtMinPricePerKg: mill.govtMinPricePerKg },
            season || "normal"
        );

        res.json({ plotLabel: plot.label, millName: mill.name, ...estimate });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}