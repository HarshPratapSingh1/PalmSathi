import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    points: { type: Number, required: true },
    reason: { type: String, required: true },
    type: { type: String, enum: ["earned", "redeemed"], default: "earned" },
    createdAt: { type: Date, default: Date.now },
});

const walletSchema = new mongoose.Schema(
    {
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true, unique: true },
        totalPoints: { type: Number, default: 0 },
        transactions: [transactionSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Wallet", walletSchema);