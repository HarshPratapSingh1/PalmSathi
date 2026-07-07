import HarvestBatch from "../models/HarvestBatch.js";
import Plot from "../models/Plot.js";
import { freshnessScoreFromDate } from "../utils/freshness.js";
import { awardPoints } from "../services/walletService.js";

export async function markHarvested(req, res) {
  try {
    const { plotId, quantityKg, harvestedAt } = req.body;

    const plot = await Plot.findById(plotId);
    if (!plot) return res.status(404).json({ error: "Plot not found" });

    const batch = await HarvestBatch.create({
      plotId,
      farmerId: plot.farmerId,
      quantityKg,
      harvestedAt: harvestedAt || new Date(),
    });

    plot.lastHarvestDate = batch.harvestedAt;
    await plot.save();

    await awardPoints(plot.farmerId.toString(), 50, "Marked plot as harvested");

    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function listPendingBatches(req, res) {
  const batches = await HarvestBatch.find({ status: "pending" }).populate("plotId");
  const withFreshness = batches.map((b) => ({
    ...b.toObject(),
    currentFreshnessScore: Math.round(freshnessScoreFromDate(b.harvestedAt)),
  }));
  res.json(withFreshness);
}