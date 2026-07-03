import Plot from "../models/Plot.js";
import { predictRipenessWindow } from "../utils/ripeness.js";

export async function createPlot(req, res) {
  try {
    const plot = await Plot.create(req.body);
    res.status(201).json(plot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function listPlots(req, res) {
  const filter = req.query.farmerId ? { farmerId: req.query.farmerId } : {};
  const plots = await Plot.find(filter);
  res.json(plots);
}

export async function getRipenessPrediction(req, res) {
  try {
    const plot = await Plot.findById(req.params.id);
    if (!plot) return res.status(404).json({ error: "Plot not found" });

    const season = req.query.season || "normal";
    const prediction = predictRipenessWindow(plot.lastHarvestDate, plot.ageInYears, season);

    res.json({
      plotId: plot._id,
      ageInYears: plot.ageInYears,
      lastHarvestDate: plot.lastHarvestDate,
      season,
      ...prediction,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
