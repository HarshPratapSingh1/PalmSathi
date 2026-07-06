import { useState } from "react";
import { getYieldEstimate } from "../api/mills";

export default function YieldEstimator({ plots, mills }) {
    const [plotId, setPlotId] = useState("");
    const [millId, setMillId] = useState("");
    const [season, setSeason] = useState("normal");
    const [estimate, setEstimate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleEstimate() {
        if (!plotId || !millId) {
            setError("Please select both a plot and a mill.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const res = await getYieldEstimate(plotId, millId, season);
            setEstimate(res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to estimate. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="ps-card">
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1B4332", fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                🌾 Yield & Payout Estimator
            </h3>
            <p style={{ fontFamily: "Inter, sans-serif", color: "#7C5C3E", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
                Estimate your FFB output and expected payout using the NMEO-OP price formula
            </p>

            {/* Controls */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.75rem", alignItems: "flex-end", marginBottom: "1rem" }}>
                <div>
                    <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                        Plot
                    </label>
                    <select
                        value={plotId}
                        onChange={(e) => setPlotId(e.target.value)}
                        style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", backgroundColor: "white", outline: "none" }}
                    >
                        <option value="">Select plot</option>
                        {plots.map((p) => (
                            <option key={p._id} value={p._id}>{p.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                        Mill
                    </label>
                    <select
                        value={millId}
                        onChange={(e) => setMillId(e.target.value)}
                        style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", backgroundColor: "white", outline: "none" }}
                    >
                        <option value="">Select mill</option>
                        {mills.map((m) => (
                            <option key={m._id} value={m._id}>{m.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                        Season
                    </label>
                    <select
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", backgroundColor: "white", outline: "none" }}
                    >
                        <option value="normal">Normal</option>
                        <option value="monsoon">Monsoon</option>
                        <option value="dry">Dry</option>
                    </select>
                </div>

                <button
                    onClick={handleEstimate}
                    disabled={loading}
                    style={{ backgroundColor: "#40916C", color: "white", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "0.875rem", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1, whiteSpace: "nowrap" }}
                >
                    {loading ? "Estimating..." : "Estimate"}
                </button>
            </div>

            {error && (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#dc2626", marginBottom: "0.75rem" }}>
                    {error}
                </p>
            )}

            {/* Results */}
            {estimate && (
                <div>
                    <div style={{ backgroundColor: "#1B4332", borderRadius: "0.75rem", padding: "1.25rem", marginBottom: "1rem", color: "white" }}>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#40916C", marginBottom: "0.25rem" }}>
                            {estimate.plotLabel} · {estimate.millName} · {estimate.season} season
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "0.75rem" }}>
                            <div>
                                <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.75rem", color: "white" }}>
                                    {estimate.totalFFBkg.toLocaleString()}
                                </p>
                                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#40916C" }}>kg expected FFB</p>
                            </div>
                            <div>
                                <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.75rem", color: "#4ade80" }}>
                                    ₹{estimate.totalExpectedPayout.toLocaleString()}
                                </p>
                                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#40916C" }}>total expected payout</p>
                            </div>
                            <div>
                                <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.75rem", color: "white" }}>
                                    {estimate.yieldPerPalmKg} kg
                                </p>
                                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#40916C" }}>per palm this round</p>
                            </div>
                        </div>
                    </div>

                    <div className="ps-info-box">
                        <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
                            Payout Breakdown
                        </p>
                        {[
                            ["Palms", estimate.palmCount],
                            ["Yield per palm", `${estimate.yieldPerPalmKg} kg`],
                            ["Total FFB", `${estimate.totalFFBkg.toLocaleString()} kg`],
                            ["Mill price", `₹${estimate.millPricePerKg}/kg`],
                            ["Govt minimum", `₹${estimate.govtMinPricePerKg}/kg`],
                            ["Mill payout", `₹${estimate.millPayout.toLocaleString()}`],
                            ["Govt guarantee", `₹${estimate.govtGuarantee.toLocaleString()}`],
                            estimate.vgfTopUp > 0
                                ? ["VGF top-up (govt)", `+₹${estimate.vgfTopUp.toLocaleString()}`]
                                : ["Above minimum by", `+₹${(estimate.millPayout - estimate.govtGuarantee).toLocaleString()}`],
                        ].map(([label, value]) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontFamily: "Inter, sans-serif", marginBottom: "0.375rem" }}>
                                <span style={{ color: "#7C5C3E" }}>{label}</span>
                                <span style={{ color: "#1B4332", fontWeight: 500 }}>{value}</span>
                            </div>
                        ))}

                        <div style={{ borderTop: "1px solid #e5e7eb", marginTop: "0.5rem", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>
                            <span style={{ color: "#1B4332", fontWeight: 600 }}>Total Expected Payout</span>
                            <span style={{ color: "#40916C", fontWeight: 700 }}>₹{estimate.totalExpectedPayout.toLocaleString()}</span>
                        </div>
                    </div>

                    {estimate.vgfTopUp > 0 && (
                        <div style={{ backgroundColor: "#fefce8", border: "1px solid #fef08a", borderRadius: "0.5rem", padding: "0.625rem 0.875rem", marginTop: "0.75rem", fontSize: "0.75rem", fontFamily: "Inter, sans-serif", color: "#854d0e" }}>
                            ⚠ Mill is offering below the government minimum. The government will top up ₹{estimate.vgfTopUp.toLocaleString()} via VGF under NMEO-OP.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}