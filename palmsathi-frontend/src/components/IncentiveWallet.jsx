import { useState, useEffect } from "react";
import { getWallet, redeemPoints } from "../api/mills";

const REDEMPTION_OPTIONS = [
    { label: "Discounted seedlings (50 pts)", points: 50, description: "10% discount on next seedling purchase" },
    { label: "Fertilizer voucher (100 pts)", points: 100, description: "₹500 off on fertilizer purchase" },
    { label: "Soil testing kit (150 pts)", points: 150, description: "Free soil testing kit for one plot" },
];

export default function IncentiveWallet() {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showHistory, setShowHistory] = useState(false);

    async function fetchWallet() {
        try {
            const res = await getWallet();
            setWallet(res.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchWallet(); }, []);

    async function handleRedeem(option) {
        setError("");
        setSuccess("");
        setRedeeming(true);
        try {
            const res = await redeemPoints(option.points, option.label);
            setWallet(res.data);
            setSuccess(`Redeemed: ${option.description}`);
            setTimeout(() => setSuccess(""), 4000);
        } catch (err) {
            setError(err.response?.data?.error || "Redemption failed.");
        } finally {
            setRedeeming(false);
        }
    }

    if (loading) return null;

    const earned = wallet?.transactions?.filter((t) => t.type === "earned") || [];
    const redeemed = wallet?.transactions?.filter((t) => t.type === "redeemed") || [];

    return (
        <div className="ps-card">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div>
                    <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1B4332", fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                        🪙 Incentive Wallet
                    </h3>
                    <p style={{ fontFamily: "Inter, sans-serif", color: "#7C5C3E", fontSize: "0.8rem" }}>
                        Earn points for good farming practices and redeem for rewards
                    </p>
                </div>

                {/* Points balance */}
                <div style={{ backgroundColor: "#1B4332", borderRadius: "0.75rem", padding: "0.75rem 1.25rem", textAlign: "center", minWidth: "100px" }}>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.75rem", color: "#4ade80", lineHeight: 1 }}>
                        {wallet?.totalPoints || 0}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#40916C", marginTop: "0.25rem" }}>
                        points
                    </p>
                </div>
            </div>

            {/* Points summary */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                {[
                    { label: "Total earned", value: earned.reduce((sum, t) => sum + t.points, 0), color: "#16a34a" },
                    { label: "Redeemed", value: Math.abs(redeemed.reduce((sum, t) => sum + t.points, 0)), color: "#7C5C3E" },
                    { label: "Available", value: wallet?.totalPoints || 0, color: "#1B4332" },
                ].map((stat) => (
                    <div key={stat.label} className="ps-info-box" style={{ textAlign: "center" }}>
                        <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.25rem", color: stat.color }}>
                            {stat.value}
                        </p>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#7C5C3E" }}>
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* How to earn points */}
            <div className="ps-info-box" style={{ marginBottom: "1.25rem" }}>
                <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                    How to earn points
                </p>
                {[
                    ["Mark plot as harvested", "50 pts"],
                    ["Book mill slot with freshness ≥ 85", "30 pts"],
                    ["File a subsidy claim", "20 pts"],
                    ["Subsidy claim disbursed", "50 pts"],
                ].map(([action, pts]) => (
                    <div key={action} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontFamily: "Inter, sans-serif", marginBottom: "0.25rem" }}>
                        <span style={{ color: "#7C5C3E" }}>• {action}</span>
                        <span style={{ color: "#16a34a", fontWeight: 600 }}>{pts}</span>
                    </div>
                ))}
            </div>

            {/* Redemption options */}
            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                Redeem Points
            </p>

            {error && (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#dc2626", marginBottom: "0.5rem" }}>
                    {error}
                </p>
            )}
            {success && (
                <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", marginBottom: "0.75rem", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", color: "#166534" }}>
                    ✓ {success}
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
                {REDEMPTION_OPTIONS.map((option) => {
                    const canRedeem = (wallet?.totalPoints || 0) >= option.points;
                    return (
                        <div key={option.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FAFAF7", borderRadius: "0.5rem", padding: "0.75rem 1rem" }}>
                            <div>
                                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#1B4332", fontWeight: 500 }}>
                                    {option.label}
                                </p>
                                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#7C5C3E" }}>
                                    {option.description}
                                </p>
                            </div>
                            <button
                                onClick={() => handleRedeem(option)}
                                disabled={!canRedeem || redeeming}
                                style={{
                                    backgroundColor: canRedeem ? "#40916C" : "#e5e7eb",
                                    color: canRedeem ? "white" : "#9ca3af",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    padding: "0.375rem 0.875rem",
                                    borderRadius: "0.5rem",
                                    border: "none",
                                    cursor: canRedeem ? "pointer" : "not-allowed",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Redeem
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Transaction history */}
            <button
                onClick={() => setShowHistory(!showHistory)}
                style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#40916C", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "0.75rem" }}
            >
                {showHistory ? "▲ Hide history" : "▼ Show transaction history"}
            </button>

            {showHistory && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    {wallet?.transactions?.length === 0 ? (
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#9ca3af" }}>No transactions yet.</p>
                    ) : (
                        [...(wallet?.transactions || [])].reverse().map((t, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", fontFamily: "Inter, sans-serif", padding: "0.375rem 0", borderBottom: "1px solid #f3f4f6" }}>
                                <span style={{ color: "#7C5C3E" }}>{t.reason}</span>
                                <span style={{ fontWeight: 600, color: t.type === "earned" ? "#16a34a" : "#dc2626" }}>
                                    {t.type === "earned" ? "+" : ""}{t.points} pts
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}