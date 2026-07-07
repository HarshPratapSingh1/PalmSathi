import { getWallet, redeemPoints } from "../services/walletService.js";

export async function getMyWallet(req, res) {
    try {
        const wallet = await getWallet(req.farmer.id);
        res.json(wallet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function redeem(req, res) {
    try {
        const { points, reason } = req.body;
        const wallet = await redeemPoints(req.farmer.id, points, reason);
        res.json(wallet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}