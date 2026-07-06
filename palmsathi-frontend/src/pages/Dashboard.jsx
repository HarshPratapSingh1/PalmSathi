import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyPlots } from "../api/plots";
import { getPendingBatches } from "../api/harvest";
import { getMills, runMatching, getBookings } from "../api/mills";
import Navbar from "../components/Navbar";
import PlotCard from "../components/PlotCard";
import BatchCard from "../components/BatchCard";
import MillCard from "../components/MillCard";
import AdvisoryCard from "../components/AdvisoryCard";
import YieldEstimator from "../components/YieldEstimator";
import SubsidyTracker from "../components/SubsidyTracker";

export default function Dashboard() {
    const { farmer } = useAuth();
    const [plots, setPlots] = useState([]);
    const [batches, setBatches] = useState([]);
    const [mills, setMills] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [matching, setMatching] = useState(false);
    const [matchResult, setMatchResult] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        try {
            const [plotsRes, batchesRes, millsRes, bookingsRes] = await Promise.all([
                getMyPlots(farmer.id),
                getPendingBatches(),
                getMills(),
                getBookings(),
            ]);
            setPlots(plotsRes.data);
            setBatches(batchesRes.data);
            setMills(millsRes.data);
            setBookings(bookingsRes.data);
        } finally {
            setLoading(false);
        }
    }, [farmer.id]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    async function handleRunMatching() {
        setMatching(true);
        setMatchResult(null);
        try {
            const res = await runMatching();
            setMatchResult(res.data);
            fetchAll();
        } finally {
            setMatching(false);
        }
    }

    return (
        <div className="min-h-screen bg-offwhite">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-8">

                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "16rem" }}>
                        <p style={{ color: "#7C5C3E", fontFamily: "Inter, sans-serif" }}>Loading your farm data...</p>
                    </div>
                ) : (
                    <>
                        {/* Plots Section */}
                        <section style={{ marginBottom: "2.5rem" }}>
                            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#1B4332", marginBottom: "0.25rem" }}>
                                Your Plots
                            </h2>
                            <p style={{ color: "#7C5C3E", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", marginBottom: "1rem" }}>
                                Ripeness predictions and advisory based on planting year, last harvest and live weather
                            </p>

                            {plots.length === 0 ? (
                                <p style={{ color: "#9ca3af", fontSize: "0.875rem", fontFamily: "Inter, sans-serif" }}>
                                    No plots found.
                                </p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                    {plots.map((plot) => (
                                        <div
                                            key={plot._id}
                                            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
                                        >
                                            <PlotCard plot={plot} onHarvested={fetchAll} />
                                            <AdvisoryCard plot={plot} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Yield Estimator Section */}
                        <section style={{ marginBottom: "2.5rem" }}>
                            <YieldEstimator plots={plots} mills={mills} />
                        </section>

                        {/* Subsidy Tracker Section */}
                        <section style={{ marginBottom: "2.5rem" }}>
                            <SubsidyTracker plots={plots} />
                        </section>

                        {/* Pending Batches Section */}
                        {batches.length > 0 && (
                            <section style={{ marginBottom: "2.5rem" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                                    <div>
                                        <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#1B4332", marginBottom: "0.25rem" }}>
                                            Pending Batches
                                        </h2>
                                        <p style={{ color: "#7C5C3E", fontSize: "0.875rem", fontFamily: "Inter, sans-serif" }}>
                                            Live freshness scores — book a mill slot before quality drops
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleRunMatching}
                                        disabled={matching}
                                        style={{
                                            backgroundColor: "#1B4332",
                                            color: "white",
                                            fontFamily: "Poppins, sans-serif",
                                            fontWeight: 600,
                                            fontSize: "0.875rem",
                                            padding: "0.625rem 1.25rem",
                                            borderRadius: "0.5rem",
                                            border: "none",
                                            cursor: "pointer",
                                            opacity: matching ? 0.6 : 1,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {matching ? "Matching..." : "⚡ Run Matching Engine"}
                                    </button>
                                </div>

                                {matchResult && (
                                    <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.5rem", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", color: "#166534" }}>
                                        Matching complete — {matchResult.assignments.length} batch
                                        {matchResult.assignments.length !== 1 ? "es" : ""} assigned,{" "}
                                        {matchResult.unassigned.length} unassignable (too old).
                                    </div>
                                )}

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                                    {batches.map((batch) => (
                                        <BatchCard key={batch._id} batch={batch} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Mills Section */}
                        <section style={{ marginBottom: "2.5rem" }}>
                            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#1B4332", marginBottom: "0.25rem" }}>
                                Nearby Mills
                            </h2>
                            <p style={{ color: "#7C5C3E", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", marginBottom: "1rem" }}>
                                Today's prices vs government minimum (NMEO-OP) and available slots
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                {mills.map((mill) => (
                                    <MillCard key={mill._id} mill={mill} />
                                ))}
                            </div>
                        </section>

                        {/* Confirmed Bookings Section */}
                        {bookings.length > 0 && (
                            <section>
                                <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#1B4332", marginBottom: "0.25rem" }}>
                                    Confirmed Bookings
                                </h2>
                                <p style={{ color: "#7C5C3E", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", marginBottom: "1rem" }}>
                                    Your assigned mill slots
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    {bookings.map((b) => (
                                        <div
                                            key={b._id}
                                            className="ps-card"
                                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                        >
                                            <div>
                                                <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "0.875rem" }}>
                                                    {b.millId?.name || "Mill"}
                                                </p>
                                                <p style={{ fontFamily: "Inter, sans-serif", color: "#7C5C3E", fontSize: "0.75rem", marginTop: "0.125rem" }}>
                                                    {b.quantityKg} kg ·{" "}
                                                    {new Date(b.slotTime).toLocaleString("en-IN", {
                                                        day: "numeric", month: "short",
                                                        hour: "2-digit", minute: "2-digit", hour12: true,
                                                    })}
                                                </p>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <span style={{
                                                    fontSize: "0.75rem",
                                                    fontFamily: "Inter, sans-serif",
                                                    padding: "0.25rem 0.625rem",
                                                    borderRadius: "9999px",
                                                    backgroundColor: "#dcfce7",
                                                    color: "#166534",
                                                }}>
                                                    {b.status}
                                                </span>
                                                <p style={{ fontSize: "0.75rem", color: "#7C5C3E", fontFamily: "Inter, sans-serif", marginTop: "0.25rem" }}>
                                                    Freshness at booking: {b.freshnessAtAssignment}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}