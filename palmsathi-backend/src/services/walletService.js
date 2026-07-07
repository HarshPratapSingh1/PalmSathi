import Wallet from "../models/Wallet.js";

/**
 * Award points to a farmer's wallet.
 * Creates the wallet if it doesn't exist yet.
 */
export async function awardPoints(farmerId, points, reason) {
    const wallet = await Wallet.findOneAndUpdate(
        { farmerId },
        {
            $inc: { totalPoints: points },
            $push: {
                transactions: {
                    points,
                    reason,
                    type: "earned",
                    createdAt: new Date(),
                },
            },
        },
        { upsert: true, new: true }
    );
    return wallet;
}

export async function getWallet(farmerId) {
    let wallet = await Wallet.findOne({ farmerId });
    if (!wallet) {
        wallet = await Wallet.create({ farmerId, totalPoints: 0, transactions: [] });
    }
    return wallet;
}

export async function redeemPoints(farmerId, points, reason) {
    const wallet = await Wallet.findOne({ farmerId });
    if (!wallet) throw new Error("Wallet not found.");
    if (wallet.totalPoints < points) throw new Error("Insufficient points.");

    wallet.totalPoints -= points;
    wallet.transactions.push({ points: -points, reason, type: "redeemed" });
    await wallet.save();
    return wallet;
}