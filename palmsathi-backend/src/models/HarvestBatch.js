import mongoose from "mongoose";

const harvestBatchSchema = new mongoose.Schema(
  {
    plotId: { type: mongoose.Schema.Types.ObjectId, ref: "Plot", required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    quantityKg: { type: Number, required: true },
    harvestedAt: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "assigned", "completed", "unassigned_emergency"],
      default: "pending",
    },
    // last computed freshness score, refreshed by the periodic decay tick job
    lastFreshnessScore: { type: Number, default: 100 },
    lastScoredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("HarvestBatch", harvestBatchSchema);
