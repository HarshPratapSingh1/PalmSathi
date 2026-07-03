import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyPlots } from "../api/plots";
import { getPendingBatches } from "../api/harvest";
import { getMills, runMatching, getBookings } from "../api/mills";
import Navbar from "../components/Navbar";
import PlotCard from "../components/PlotCard";
import BatchCard from "../components/BatchCard";
import MillCard from "../components/MillCard";

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
            fetchAll(); // refresh everything after matching
        } finally {
            setMatching(false);
        }
    }

    return (
        <div className="min-h-screen bg-offwhite">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-8">

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-earth font-body">Loading your farm data...</p>
                    </div>
                ) : (
                    <>
                        {/* Plots Section */}
                        <section className="mb-10">
                            <h2 className="font-heading font-bold text-xl text-forest mb-1">Your Plots</h2>
                            <p className="text-earth text-sm font-body mb-4">
                                Ripeness predictions based on planting year and last harvest
                            </p>
                            {plots.length === 0 ? (
                                <p className="text-gray-400 text-sm font-body">No plots found.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {plots.map((plot) => (
                                        <PlotCard key={plot._id} plot={plot} onHarvested={fetchAll} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Pending Batches Section */}
                        {batches.length > 0 && (
                            <section className="mb-10">
                                <div className="flex items-center justify-between mb-1">
                                    <div>
                                        <h2 className="font-heading font-bold text-xl text-forest">Pending Batches</h2>
                                        <p className="text-earth text-sm font-body mt-0.5 mb-4">
                                            Live freshness scores — book a mill slot before quality drops
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleRunMatching}
                                        disabled={matching}
                                        className="bg-forest hover:bg-leaf text-white font-heading font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-60 text-sm"
                                    >
                                        {matching ? "Matching..." : "⚡ Run Matching Engine"}
                                    </button>
                                </div>

                                {matchResult && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4 text-sm font-body text-green-700">
                                        Matching complete — {matchResult.assignments.length} batch
                                        {matchResult.assignments.length !== 1 ? "es" : ""} assigned,{" "}
                                        {matchResult.unassigned.length} unassignable (too old).
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {batches.map((batch) => (
                                        <BatchCard key={batch._id} batch={batch} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Mills Section */}
                        <section className="mb-10">
                            <h2 className="font-heading font-bold text-xl text-forest mb-1">Nearby Mills</h2>
                            <p className="text-earth text-sm font-body mb-4">
                                Today's prices vs government minimum (NMEO-OP) and available slots
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mills.map((mill) => (
                                    <MillCard key={mill._id} mill={mill} />
                                ))}
                            </div>
                        </section>

                        {/* Confirmed Bookings Section */}
                        {bookings.length > 0 && (
                            <section>
                                <h2 className="font-heading font-bold text-xl text-forest mb-1">Confirmed Bookings</h2>
                                <p className="text-earth text-sm font-body mb-4">
                                    Your assigned mill slots
                                </p>
                                <div className="space-y-3">
                                    {bookings.map((b) => (
                                        <div
                                            key={b._id}
                                            className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="font-heading font-semibold text-forest text-sm">
                                                    {b.millId?.name || "Mill"}
                                                </p>
                                                <p className="text-earth text-xs font-body mt-0.5">
                                                    {b.quantityKg} kg ·{" "}
                                                    {new Date(b.slotTime).toLocaleString("en-IN", {
                                                        day: "numeric", month: "short",
                                                        hour: "2-digit", minute: "2-digit", hour12: true,
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs bg-green-100 text-green-700 font-body px-2 py-1 rounded-full">
                                                    {b.status}
                                                </span>
                                                <p className="text-xs text-earth font-body mt-1">
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