import { useState } from "react";
import { getAdvisory } from "../api/plots";

export default function AdvisoryCard({ plot }) {
    const [advisory, setAdvisory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    async function fetchAdvisory() {
        setLoading(true);
        try {
            const res = await getAdvisory(plot._id);
            setAdvisory(res.data);
            setOpen(true);
        } finally {
            setLoading(false);
        }
    }

    const stageColor = {
        immature: { bg: "#fefce8", border: "#fef08a", text: "#854d0e" },
        young_bearing: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534" },
        mature_bearing: { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
    };

    return (
        <div className="ps-card" style={{ marginTop: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "0.875rem" }}>
                        🌱 Advisory for {plot.label}
                    </h4>
                    <p style={{ fontFamily: "Inter, sans-serif", color: "#7C5C3E", fontSize: "0.75rem", marginTop: "0.125rem" }}>
                        Fertilizer + irrigation recommendations based on live weather
                    </p>
                </div>
                <button
                    onClick={fetchAdvisory}
                    disabled={loading}
                    style={{
                        backgroundColor: "#1B4332",
                        color: "white",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.75rem",
                        padding: "0.375rem 0.875rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        cursor: "pointer",
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    {loading ? "Fetching..." : "Get advice"}
                </button>
            </div>

            {open && advisory && (
                <div style={{ marginTop: "1rem" }}>

                    {/* Alerts */}
                    {advisory.alerts.length > 0 && (
                        <div style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "0.5rem", padding: "0.75rem", marginBottom: "0.75rem" }}>
                            {advisory.alerts.map((alert, i) => (
                                <p key={i} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#9a3412", marginBottom: i < advisory.alerts.length - 1 ? "0.25rem" : 0 }}>
                                    {alert}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Stage badge */}
                    <div style={{ marginBottom: "0.75rem" }}>
                        <span style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            padding: "0.25rem 0.625rem",
                            borderRadius: "9999px",
                            backgroundColor: stageColor[advisory.stage]?.bg,
                            border: `1px solid ${stageColor[advisory.stage]?.border}`,
                            color: stageColor[advisory.stage]?.text,
                        }}>
                            {advisory.stageLabel}
                        </span>
                    </div>

                    {/* Weather */}
                    <div className="ps-info-box" style={{ marginBottom: "0.75rem" }}>
                        <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                            🌤 Current Weather
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25rem" }}>
                            {[
                                ["Temperature", `${advisory.weather.tempC}°C`],
                                ["Humidity", `${advisory.weather.humidity}%`],
                                ["Condition", advisory.weather.condition],
                                ["Rainfall", `${advisory.weather.rainMm} mm/hr`],
                            ].map(([label, value]) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", fontFamily: "Inter, sans-serif" }}>
                                    <span style={{ color: "#7C5C3E" }}>{label}</span>
                                    <span style={{ color: "#1B4332", fontWeight: 500 }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Irrigation */}
                    <div className="ps-info-box" style={{ marginBottom: "0.75rem" }}>
                        <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                            💧 Irrigation
                        </p>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 600, marginBottom: "0.25rem" }}>
                            {advisory.irrigation.action}
                        </p>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#7C5C3E", marginBottom: "0.25rem" }}>
                            {advisory.irrigation.reason}
                        </p>
                        {advisory.irrigation.frequency && (
                            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#7C5C3E" }}>
                                Frequency: {advisory.irrigation.frequency}
                            </p>
                        )}
                    </div>

                    {/* Fertilizer */}
                    <div className="ps-info-box">
                        <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                            🌿 Fertilizer Schedule
                        </p>
                        {[
                            ["Nitrogen (Urea)", advisory.fertilizer.nitrogen],
                            ["Phosphorus (SSP)", advisory.fertilizer.phosphorus],
                            ["Potassium (MOP)", advisory.fertilizer.potassium],
                            ["Magnesium", advisory.fertilizer.magnesium],
                        ].map(([label, value]) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", fontFamily: "Inter, sans-serif", marginBottom: "0.25rem" }}>
                                <span style={{ color: "#7C5C3E" }}>{label}</span>
                                <span style={{ color: "#1B4332", fontWeight: 500, textAlign: "right", maxWidth: "55%" }}>{value}</span>
                            </div>
                        ))}
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#9a3412", marginTop: "0.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "0.5rem" }}>
                            💡 {advisory.fertilizer.note}
                        </p>
                    </div>

                </div>
            )}
        </div>
    );
}