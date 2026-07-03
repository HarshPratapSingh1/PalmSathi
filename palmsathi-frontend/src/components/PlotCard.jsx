import { useState, useEffect } from "react";
import { getPlotRipeness } from "../api/plots";
import { markHarvested } from "../api/harvest";

export default function PlotCard({ plot, onHarvested }) {
    const [ripeness, setRipeness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [harvesting, setHarvesting] = useState(false);
    const [qty, setQty] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        getPlotRipeness(plot._id)
            .then((res) => setRipeness(res.data))
            .finally(() => setLoading(false));
    }, [plot._id]);

    async function handleHarvest() {
        if (!qty) return;
        setHarvesting(true);
        try {
            await markHarvested({ plotId: plot._id, quantityKg: Number(qty) });
            setShowForm(false);
            setQty("");
            onHarvested();
        } finally {
            setHarvesting(false);
        }
    }

    const isInWindow = ripeness
        ? new Date() >= new Date(ripeness.windowStart) &&
        new Date() <= new Date(ripeness.windowEnd)
        : false;

    return (
        <div className="ps-card">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div>
                    <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "1rem" }}>
                        {plot.label}
                    </h3>
                    <p style={{ fontFamily: "Inter, sans-serif", color: "#7C5C3E", fontSize: "0.75rem", marginTop: "0.125rem" }}>
                        {plot.areaInHectares} ha · {plot.palmCount} palms · planted {plot.plantingYear}
                    </p>
                </div>
                <span style={{
                    fontSize: "0.75rem",
                    fontFamily: "Inter, sans-serif",
                    padding: "0.25rem 0.625rem",
                    borderRadius: "9999px",
                    backgroundColor: isInWindow ? "#dcfce7" : "#f3f4f6",
                    color: isInWindow ? "#16a34a" : "#6b7280",
                }}>
                    {isInWindow ? "🌿 Ready to harvest" : "⏳ Not ready yet"}
                </span>
            </div>

            {loading ? (
                <p style={{ fontSize: "0.75rem", color: "#9ca3af", fontFamily: "Inter, sans-serif" }}>
                    Loading ripeness...
                </p>
            ) : ripeness ? (
                <div className="ps-info-box" style={{ marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ color: "#7C5C3E" }}>Expected harvest</span>
                        <span style={{ color: "#1B4332", fontWeight: 500 }}>
                            {new Date(ripeness.expectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ color: "#7C5C3E" }}>Harvest window</span>
                        <span style={{ color: "#1B4332", fontWeight: 500 }}>
                            {new Date(ripeness.windowStart).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} –{" "}
                            {new Date(ripeness.windowEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#7C5C3E" }}>Cycle days</span>
                        <span style={{ color: "#1B4332", fontWeight: 500 }}>{ripeness.cycleDaysUsed} days</span>
                    </div>
                </div>
            ) : null}

            {!showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    style={{
                        width: "100%",
                        backgroundColor: "#40916C",
                        color: "white",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.875rem",
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        cursor: "pointer",
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#1B4332"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#40916C"}
                >
                    Mark as harvested
                </button>
            ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        placeholder="Qty in kg"
                        style={{
                            flex: 1,
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 0.75rem",
                            fontSize: "0.875rem",
                            fontFamily: "Inter, sans-serif",
                            outline: "none",
                        }}
                    />
                    <button
                        onClick={handleHarvest}
                        disabled={harvesting}
                        style={{
                            backgroundColor: "#40916C",
                            color: "white",
                            fontSize: "0.875rem",
                            fontFamily: "Inter, sans-serif",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            cursor: "pointer",
                            opacity: harvesting ? 0.6 : 1,
                        }}
                    >
                        {harvesting ? "..." : "Confirm"}
                    </button>
                    <button
                        onClick={() => setShowForm(false)}
                        style={{
                            color: "#7C5C3E",
                            fontSize: "0.875rem",
                            fontFamily: "Inter, sans-serif",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}