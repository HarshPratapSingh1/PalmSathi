import mongoose from "mongoose";

const advisorySchema = new mongoose.Schema(
    {
        plotId: { type: mongoose.Schema.Types.ObjectId, ref: "Plot", required: true },
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
        stage: { type: String },
        stageLabel: { type: String },
        weather: { type: Object },
        fertilizer: { type: Object },
        irrigation: { type: Object },
        alerts: [{ type: String }],
        generatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("Advisory", advisorySchema);