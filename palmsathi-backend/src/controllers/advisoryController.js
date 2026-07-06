import Plot from "../models/Plot.js";
import Advisory from "../models/Advisory.js";
import { getWeather } from "../services/weatherService.js";
import { generateAdvisory } from "../services/advisoryEngine.js";

export async function getAdvisoryForPlot(req, res) {
    try {
        const plot = await Plot.findById(req.params.plotId);
        if (!plot) return res.status(404).json({ error: "Plot not found." });

        const weather = await getWeather(plot.location.lat, plot.location.lng);
        const advisory = generateAdvisory(plot.toObject(), weather);

        // Save to DB for history
        await Advisory.create({
            plotId: plot._id,
            farmerId: plot.farmerId,
            ...advisory,
        });

        res.json(advisory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getAdvisoryHistory(req, res) {
    try {
        const history = await Advisory.find({ plotId: req.params.plotId })
            .sort({ generatedAt: -1 })
            .limit(5);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}