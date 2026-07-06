import mongoose from "mongoose";

const subsidyClaimSchema = new mongoose.Schema(
    {
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
        plotId: { type: mongoose.Schema.Types.ObjectId, ref: "Plot", required: true },
        schemeType: {
            type: String,
            enum: ["planting_material", "drip_irrigation", "intercropping_support"],
            required: true,
        },
        schemeLabel: { type: String },
        claimedAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["applied", "verified", "disbursed"],
            default: "applied",
        },
        description: { type: String },
        appliedAt: { type: Date, default: Date.now },
        verifiedAt: { type: Date, default: null },
        disbursedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

export default mongoose.model("SubsidyClaim", subsidyClaimSchema);