import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Palmtree, ShieldCheck, ChevronRight, RefreshCw, ArrowLeft } from "lucide-react";

const ADMIN_SECRET = "palmsathi_admin_2026";
const API = import.meta.env.VITE_API_URL;

const STATUS_ORDER = ["applied", "verified", "disbursed"];

const STATUS_COLORS = {
    applied: "warning",
    verified: "default",
    disbursed: "success",
};

const NEXT_STATUS = {
    applied: "verified",
    verified: "disbursed",
    disbursed: null,
};

const NEXT_LABEL = {
    applied: "Mark Verified",
    verified: "Mark Disbursed",
    disbursed: null,
};

export default function Admin() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(null);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");

    async function handleLogin() {
        if (password !== ADMIN_SECRET) {
            setError("Incorrect admin password.");
            return;
        }
        setAuthenticated(true);
        fetchClaims();
    }

    async function fetchClaims() {
        setLoading(true);
        try {
            const res = await fetch(`${API}/admin/claims?secret=${ADMIN_SECRET}`);
            const data = await res.json();
            setClaims(data);
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusUpdate(claimId, newStatus) {
        setUpdating(claimId);
        try {
            const res = await fetch(`${API}/admin/claims/${claimId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ secret: ADMIN_SECRET, status: newStatus }),
            });
            if (res.ok) await fetchClaims();
        } finally {
            setUpdating(null);
        }
    }

    const filtered = filter === "all"
        ? claims
        : claims.filter((c) => c.status === filter);

    const counts = {
        all: claims.length,
        applied: claims.filter((c) => c.status === "applied").length,
        verified: claims.filter((c) => c.status === "verified").length,
        disbursed: claims.filter((c) => c.status === "disbursed").length,
    };

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-8">
                <Card className="w-full max-w-sm">
                    <CardHeader className="text-center pb-2">
                        <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center mx-auto mb-3">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-forest">Admin Panel</CardTitle>
                        <p className="text-sm text-muted-foreground font-body mt-1">
                            PalmSathi · Government Officer Access
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 font-body">
                                {error}
                            </div>
                        )}
                        <Input
                            type="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        />
                        <Button className="w-full" onClick={handleLogin}>
                            Log in as Admin
                        </Button>

                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-forest transition-colors font-body mt-2"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to farmer login
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <div className="bg-forest text-white px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <Palmtree className="h-5 w-5 text-leaf" />
                    <span className="font-heading font-bold text-lg">PalmSathi</span>
                    <span className="text-white/40 mx-2">·</span>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-leaf" />
                        <span className="font-body text-sm text-white/80">Admin Panel</span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setAuthenticated(false)}
                >
                    Log out
                </Button>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-heading font-bold text-2xl text-forest">Subsidy Claims</h1>
                        <p className="font-body text-sm text-muted-foreground mt-0.5">
                            Review and process farmer subsidy applications
                        </p>
                    </div>
                    <Button variant="outline" onClick={fetchClaims} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        {loading ? "Refreshing..." : "Refresh"}
                    </Button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Claims", value: counts.all, color: "text-forest" },
                        { label: "Pending Review", value: counts.applied, color: "text-amber-600" },
                        { label: "Verified", value: counts.verified, color: "text-blue-600" },
                        { label: "Disbursed", value: counts.disbursed, color: "text-green-600" },
                    ].map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="p-4">
                                <p className={`font-heading font-bold text-2xl ${stat.color}`}>{stat.value}</p>
                                <p className="font-body text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2">
                    {["all", "applied", "verified", "disbursed"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors ${filter === f
                                ? "bg-forest text-white"
                                : "bg-white border border-border text-muted-foreground hover:text-forest hover:border-forest"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${filter === f
                                ? "bg-white/20 text-white"
                                : "bg-muted text-muted-foreground"
                                }`}>
                                {counts[f]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Claims list */}
                {loading ? (
                    <div className="text-center py-12 text-muted-foreground font-body">
                        Loading claims...
                    </div>
                ) : filtered.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="p-12 text-center">
                            <p className="font-body text-muted-foreground">No claims in this category.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((claim) => {
                            const nextStatus = NEXT_STATUS[claim.status];
                            const nextLabel = NEXT_LABEL[claim.status];
                            const stepIndex = STATUS_ORDER.indexOf(claim.status);

                            return (
                                <Card key={claim._id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-5">
                                        <div className="flex flex-col md:flex-row items-start justify-between gap-6">

                                            {/* Left: claim info */}
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-heading font-semibold text-forest text-base">
                                                            {claim.schemeLabel}
                                                        </p>
                                                        <Badge variant={STATUS_COLORS[claim.status]}>
                                                            {claim.status.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    <p className="font-body text-sm text-muted-foreground">
                                                        {claim.farmerId?.name} · {claim.farmerId?.phone}
                                                    </p>
                                                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                                                        {claim.farmerId?.village}, {claim.farmerId?.district} ·
                                                        Plot: {claim.plotId?.label} ({claim.plotId?.areaInHectares} ha)
                                                    </p>
                                                </div>

                                                {/* Progress tracker */}
                                                <div className="flex items-center">
                                                    {STATUS_ORDER.map((step, i) => {
                                                        const isCompleted = i <= stepIndex;
                                                        const isLast = i === STATUS_ORDER.length - 1;
                                                        return (
                                                            <div key={step} className="flex items-center" style={{ flex: isLast ? "0 0 auto" : 1 }}>
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${isCompleted
                                                                        ? "bg-leaf text-white"
                                                                        : "bg-muted text-muted-foreground"
                                                                        }`}>
                                                                        {isCompleted ? "✓" : i + 1}
                                                                    </div>
                                                                    <span className={`text-xs font-body capitalize whitespace-nowrap ${isCompleted ? "text-leaf font-medium" : "text-muted-foreground"
                                                                        }`}>
                                                                        {step}
                                                                    </span>
                                                                </div>
                                                                {!isLast && (
                                                                    <div className={`h-0.5 flex-1 mx-2 mb-4 rounded-full ${i < stepIndex ? "bg-leaf" : "bg-muted"
                                                                        }`} />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Timestamps */}
                                                <div className="flex gap-4 text-xs font-body text-muted-foreground">
                                                    <span>
                                                        Applied: {new Date(claim.appliedAt).toLocaleDateString("en-IN", {
                                                            day: "numeric", month: "short", year: "numeric"
                                                        })}
                                                    </span>
                                                    {claim.verifiedAt && (
                                                        <span>
                                                            Verified: {new Date(claim.verifiedAt).toLocaleDateString("en-IN", {
                                                                day: "numeric", month: "short", year: "numeric"
                                                            })}
                                                        </span>
                                                    )}
                                                    {claim.disbursedAt && (
                                                        <span>
                                                            Disbursed: {new Date(claim.disbursedAt).toLocaleDateString("en-IN", {
                                                                day: "numeric", month: "short", year: "numeric"
                                                            })}
                                                        </span>
                                                    )}
                                                </div>

                                                {claim.description && (
                                                    <p className="text-xs font-body text-muted-foreground italic border-l-2 border-muted pl-2">
                                                        "{claim.description}"
                                                    </p>
                                                )}
                                            </div>

                                            {/* Right: amount + action */}
                                            <div className="text-left md:text-right shrink-0 space-y-3 w-full md:w-auto">
                                                <div>
                                                    <p className="font-heading font-bold text-2xl text-forest">
                                                        ₹{claim.claimedAmount.toLocaleString()}
                                                    </p>
                                                    <p className="font-body text-xs text-muted-foreground">claimed amount</p>
                                                </div>

                                                {nextStatus ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleStatusUpdate(claim._id, nextStatus)}
                                                        disabled={updating === claim._id}
                                                        className="flex items-center gap-1.5"
                                                    >
                                                        {updating === claim._id ? "Updating..." : nextLabel}
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                    </Button>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-green-600 text-xs font-body font-medium justify-end">
                                                        <ShieldCheck className="h-3.5 w-3.5" />
                                                        Fully processed
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}