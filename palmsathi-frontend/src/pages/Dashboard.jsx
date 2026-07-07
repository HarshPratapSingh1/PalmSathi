import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyPlots } from "@/api/plots";
import { getPendingBatches } from "@/api/harvest";
import { getMills, runMatching, getBookings, getWallet } from "@/api/mills";
import Sidebar from "@/components/layout/Sidebar";
import PlotCard from "@/components/modules/PlotCard";
import AdvisoryCard from "@/components/modules/AdvisoryCard";
import BatchCard from "@/components/modules/BatchCard";
import MillCard from "@/components/modules/MillCard";
import AddPlotModal from "@/components/modules/AddPlotModal";
import HinglishChatbot from "@/components/HinglishChatbot";
import YieldEstimator from "@/components/YieldEstimator";
import SubsidyTracker from "@/components/SubsidyTracker";
import IncentiveWallet from "@/components/IncentiveWallet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Sprout, Building2, Zap, TrendingUp,
    Plus, CheckCircle, AlertCircle
} from "lucide-react";

export default function Dashboard() {
    const { farmer } = useAuth();
    const [plots, setPlots] = useState([]);
    const [batches, setBatches] = useState([]);
    const [mills, setMills] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [matching, setMatching] = useState(false);
    const [matchResult, setMatchResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddPlot, setShowAddPlot] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const fetchAll = useCallback(async () => {
        try {
            const [plotsRes, batchesRes, millsRes, bookingsRes, walletRes] = await Promise.all([
                getMyPlots(farmer.id),
                getPendingBatches(),
                getMills(),
                getBookings(),
                getWallet(),
            ]);
            setPlots(plotsRes.data);
            setBatches(batchesRes.data);
            setMills(millsRes.data);
            setBookings(bookingsRes.data);
            setWallet(walletRes.data);
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

    const stats = [
        { label: "My Plots", value: plots.length, icon: Sprout, color: "text-leaf", bg: "bg-leaf/10" },
        { label: "Pending Batches", value: batches.length, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Confirmed Bookings", value: bookings.length, icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Wallet Points", value: wallet?.totalPoints || 0, icon: TrendingUp, color: "text-yellow-600", bg: "bg-yellow-50" },
    ];

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} walletPoints={wallet?.totalPoints || 0} />

            <main className="ml-64 flex-1 p-8">
                {loading ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
                        </div>
                        <Skeleton className="h-64 rounded-xl" />
                        <Skeleton className="h-48 rounded-xl" />
                    </div>
                ) : (
                    <div className="space-y-8">

                        {/* Header */}
                        <div>
                            <h1 className="font-heading font-bold text-2xl text-forest">
                                Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {farmer?.name?.split(" ")[0]} 👋
                            </h1>
                            <p className="font-body text-muted-foreground text-sm mt-1">
                                Here's what's happening on your farm today.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <Card key={stat.label} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center`}>
                                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                                </div>
                                            </div>
                                            <p className="font-heading font-bold text-2xl text-forest">{stat.value}</p>
                                            <p className="font-body text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Pending batches alert */}
                                {batches.length > 0 && (
                                    <Card className="border-amber-200 bg-amber-50">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <AlertCircle className="h-5 w-5 text-amber-600" />
                                                    <div>
                                                        <p className="font-heading font-semibold text-amber-800 text-sm">
                                                            {batches.length} batch{batches.length > 1 ? "es" : ""} awaiting mill assignment
                                                        </p>
                                                        <p className="font-body text-xs text-amber-700">Run the matching engine to assign mill slots before freshness drops</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={handleRunMatching}
                                                    disabled={matching}
                                                    size="sm"
                                                    className="bg-amber-600 hover:bg-amber-700 shrink-0"
                                                >
                                                    <Zap className="h-3.5 w-3.5 mr-1.5" />
                                                    {matching ? "Matching..." : "Run Matching"}
                                                </Button>
                                            </div>
                                            {matchResult && (
                                                <div className="mt-3 pt-3 border-t border-amber-200 text-xs font-body text-amber-700">
                                                    ✓ {matchResult.assignments.length} assigned · {matchResult.unassigned.length} unassignable
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Recent bookings */}
                                {bookings.length > 0 && (
                                    <div>
                                        <h2 className="font-heading font-semibold text-forest mb-3">Recent Bookings</h2>
                                        <div className="space-y-2">
                                            {bookings.slice(0, 3).map((b) => (
                                                <Card key={b._id}>
                                                    <CardContent className="p-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-forest/10 rounded-lg flex items-center justify-center">
                                                                <Building2 className="h-4 w-4 text-forest" />
                                                            </div>
                                                            <div>
                                                                <p className="font-heading font-semibold text-forest text-sm">{b.millId?.name}</p>
                                                                <p className="font-body text-xs text-muted-foreground">
                                                                    {b.quantityKg} kg · {new Date(b.slotTime).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <Badge variant="success">{b.status}</Badge>
                                                            <p className="text-xs text-muted-foreground font-body mt-1">Freshness: {b.freshnessAtAssignment}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Plots Tab */}
                        {activeTab === "plots" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-heading font-bold text-xl text-forest">Your Plots</h2>
                                        <p className="font-body text-sm text-muted-foreground mt-0.5">Ripeness predictions and advisory</p>
                                    </div>
                                    <Button onClick={() => setShowAddPlot(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Plot
                                    </Button>
                                </div>

                                {plots.length === 0 ? (
                                    <Card className="border-dashed">
                                        <CardContent className="p-12 text-center">
                                            <Sprout className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                                            <h3 className="font-heading font-semibold text-forest mb-1">No plots yet</h3>
                                            <p className="font-body text-sm text-muted-foreground mb-4">Add your first oil palm plot to get started</p>
                                            <Button onClick={() => setShowAddPlot(true)}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Plot
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        {plots.map((plot) => (
                                            <div key={plot._id} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                <PlotCard plot={plot} onHarvested={fetchAll} />
                                                <AdvisoryCard plot={plot} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Harvest & Booking Tab */}
                        {activeTab === "harvest" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-heading font-bold text-xl text-forest">Harvest & Booking</h2>
                                        <p className="font-body text-sm text-muted-foreground mt-0.5">Live freshness scores and mill slot assignments</p>
                                    </div>
                                    {batches.length > 0 && (
                                        <Button onClick={handleRunMatching} disabled={matching}>
                                            <Zap className="h-4 w-4 mr-2" />
                                            {matching ? "Matching..." : "Run Matching Engine"}
                                        </Button>
                                    )}
                                </div>

                                {matchResult && (
                                    <Card className="border-green-200 bg-green-50">
                                        <CardContent className="p-4 text-sm font-body text-green-700">
                                            ✓ Matching complete — {matchResult.assignments.length} assigned, {matchResult.unassigned.length} unassignable
                                        </CardContent>
                                    </Card>
                                )}

                                {batches.length === 0 ? (
                                    <Card className="border-dashed">
                                        <CardContent className="p-12 text-center">
                                            <p className="font-body text-muted-foreground">No pending batches. Mark a plot as harvested to get started.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {batches.map((batch) => <BatchCard key={batch._id} batch={batch} />)}
                                    </div>
                                )}

                                {bookings.length > 0 && (
                                    <div>
                                        <h3 className="font-heading font-semibold text-forest mb-3">Confirmed Bookings</h3>
                                        <div className="space-y-2">
                                            {bookings.map((b) => (
                                                <Card key={b._id}>
                                                    <CardContent className="p-4 flex items-center justify-between">
                                                        <div>
                                                            <p className="font-heading font-semibold text-forest text-sm">{b.millId?.name}</p>
                                                            <p className="font-body text-xs text-muted-foreground">
                                                                {b.quantityKg} kg · {new Date(b.slotTime).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" })}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <Badge variant="success">{b.status}</Badge>
                                                            <p className="text-xs text-muted-foreground font-body mt-1">Freshness: {b.freshnessAtAssignment}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <YieldEstimator plots={plots} mills={mills} />
                            </div>
                        )}

                        {/* Mills Tab */}
                        {activeTab === "mills" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="font-heading font-bold text-xl text-forest">Nearby Mills</h2>
                                    <p className="font-body text-sm text-muted-foreground mt-0.5">Today's prices vs NMEO-OP minimum and available slots</p>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {mills.map((mill) => <MillCard key={mill._id} mill={mill} />)}
                                </div>
                            </div>
                        )}

                        {/* Subsidies Tab */}
                        {activeTab === "subsidies" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="font-heading font-bold text-xl text-forest">Subsidy & DBT Tracker</h2>
                                    <p className="font-body text-sm text-muted-foreground mt-0.5">Track your NMEO-OP claims from application to disbursement</p>
                                </div>
                                <SubsidyTracker plots={plots} />
                            </div>
                        )}

                        {/* Wallet Tab */}
                        {activeTab === "wallet" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="font-heading font-bold text-xl text-forest">Incentive Wallet</h2>
                                    <p className="font-body text-sm text-muted-foreground mt-0.5">Earn points for good practices and redeem for rewards</p>
                                </div>
                                <IncentiveWallet />
                            </div>
                        )}

                    </div>
                )}
            </main>

            <AddPlotModal
                open={showAddPlot}
                onClose={() => setShowAddPlot(false)}
                onPlotAdded={fetchAll}
            />

            <HinglishChatbot />
        </div>
    );
}