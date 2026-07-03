import { useEffect, useState } from "react";

function freshnessScore(harvestedAt) {
    const hours = (Date.now() - new Date(harvestedAt).getTime()) / 3600000;
    if (hours <= 12) return 100;
    if (hours <= 36) return Math.max(0, Math.round(100 - (hours - 12) * 3));
    return Math.max(0, Math.round(28 - (hours - 36) * 6));
}

function freshnessColor(score) {
    if (score >= 75) return "#16a34a";
    if (score >= 50) return "#ca8a04";
    return "#dc2626";
}

function freshnessBg(score) {
    if (score >= 75) return { backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" };
    if (score >= 50) return { backgroundColor: "#fefce8", border: "1px solid #fef08a" };
    return { backgroundColor: "#fef2f2", border: "1px solid #fecaca" };
}

function freshnessBarColor(score) {
    if (score >= 75) return "#22c55e";
    if (score >= 50) return "#eab308";
    return "#ef4444";
}

export default function BatchCard({ batch }) {
    const [score, setScore] = useState(freshnessScore(batch.harvestedAt));

    useEffect(() => {
        const interval = setInterval(() => {
            setScore(freshnessScore(batch.harvestedAt));
        }, 30000);
        return () => clearInterval(interval);
    }, [batch.harvestedAt]);

    const hoursAgo = ((Date.now() - new Date(batch.harvestedAt).getTime()) / 3600000).toFixed(1);

    return (
        <div className="ps-card" style={freshnessBg(score)}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div>
                    <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "1rem" }}>
                        {batch.plotId?.label || "Unknown Plot"}
                    </h3>
                    <p style={{ fontFamily: "Inter, sans-serif", color: "#7C5C3E", fontSize: "0.75rem", marginTop: "0.125rem" }}>
                        {batch.quantityKg} kg · harvested {hoursAgo}h ago
                    </p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.5rem", color: freshnessColor(score) }}>
                        {score}
                    </span>
                    <p style={{ fontSize: "0.75rem", color: "#7C5C3E", fontFamily: "Inter, sans-serif" }}>freshness</p>
                </div>
            </div>

            <div style={{ width: "100%", backgroundColor: "#e5e7eb", borderRadius: "9999px", height: "8px", marginBottom: "0.75rem" }}>
                <div style={{
                    height: "8px",
                    borderRadius: "9999px",
                    backgroundColor: freshnessBarColor(score),
                    width: `${score}%`,
                    transition: "width 1s ease",
                }} />
            </div>

            <p style={{ fontSize: "0.75rem", fontFamily: "Inter, sans-serif", color: "#7C5C3E" }}>
                {score >= 75
                    ? "✓ Good quality — book a mill slot soon"
                    : score >= 50
                        ? "⚠ Quality dropping — book immediately"
                        : "✗ Critical — value significantly reduced"}
            </p>
        </div>
    );
}