import { useState, useEffect } from "react";
import { fileClaim, getMyClaims } from "../api/mills";

const SCHEMES = [
    { value: "planting_material", label: "Planting Material Subsidy", max: 15000, description: "Subsidy on certified oil palm seedlings purchase under NMEO-OP" },
    { value: "drip_irrigation", label: "Drip Irrigation Subsidy", max: 50000, description: "Subsidy on drip irrigation system installation for oil palm plots" },
    { value: "intercropping_support", label: "Intercropping Support Subsidy", max: 10000, description: "Support for growing intercrops between oil palm rows" },
];

const STATUS_STEPS = ["applied", "verified", "disbursed"];

const STATUS_COLOR = {
    applied: { bg: "#fefce8", border: "#fef08a", text: "#854d0e", dot: "#eab308" },
    verified: { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af", dot: "#3b82f6" },
    disbursed: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", dot: "#22c55e" },
};

export default function SubsidyTracker({ plots }) {
    const [claims, setClaims] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({
        plotId: "",
        schemeType: "",
        claimedAmount: "",
        description: "",
    });

    async function fetchClaims() {
        setLoading(true);
        try {
            const res = await getMyClaims();
            setClaims(res.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchClaims(); }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit() {
        if (!form.plotId || !form.schemeType || !form.claimedAmount) {
            setError("Please fill in all required fields.");
            return;
        }
        setError("");
        setSubmitting(true);
        try {
            await fileClaim({
                ...form,
                claimedAmount: Number(form.claimedAmount),
            });
            setSuccess("Claim filed successfully!");
            setShowForm(false);
            setForm({ plotId: "", schemeType: "", claimedAmount: "", description: "" });
            fetchClaims();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to file claim.");
        } finally {
            setSubmitting(false);
        }
    }

    const selectedScheme = SCHEMES.find((s) => s.value === form.schemeType);

    return (
        <div className="ps-card">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                    <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1B4332", fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                        📋 Subsidy & DBT Tracker
                    </h3>
                    <p style={{ fontFamily: "Inter, sans-serif", color: "#7C5C3E", fontSize: "0.8rem" }}>
                        Track your NMEO-OP subsidy claims from application to disbursement
                    </p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setError(""); }}
                    style={{ backgroundColor: "#40916C", color: "white", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "0.8rem", padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                    {showForm ? "Cancel" : "+ File Claim"}
                </button>
            </div>

            {/* Claim Form */}
            {showForm && (
                <div style={{ backgroundColor: "#FAFAF7", borderRadius: "0.75rem", padding: "1rem", marginBottom: "1rem", border: "1px solid #e5e7eb" }}>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                        New Subsidy Claim
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <div>
                            <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                                Plot *
                            </label>
                            <select
                                name="plotId"
                                value={form.plotId}
                                onChange={handleChange}
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
                                Scheme *
                            </label>
                            <select
                                name="schemeType"
                                value={form.schemeType}
                                onChange={handleChange}
                                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", backgroundColor: "white", outline: "none" }}
                            >
                                <option value="">Select scheme</option>
                                {SCHEMES.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedScheme && (
                        <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "0.5rem", padding: "0.625rem 0.875rem", marginBottom: "0.75rem", fontSize: "0.75rem", fontFamily: "Inter, sans-serif", color: "#1e40af" }}>
                            {selectedScheme.description} · Max claimable: <strong>₹{selectedScheme.max.toLocaleString()}</strong>
                        </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <div>
                            <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                                Claimed Amount (₹) *
                            </label>
                            <input
                                type="number"
                                name="claimedAmount"
                                value={form.claimedAmount}
                                onChange={handleChange}
                                placeholder={selectedScheme ? `Max ₹${selectedScheme.max.toLocaleString()}` : "Enter amount"}
                                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", outline: "none" }}
                            />
                        </div>

                        <div>
                            <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                                Description (optional)
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="e.g. Purchased 50 seedlings"
                                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", outline: "none" }}
                            />
                        </div>
                    </div>

                    {error && (
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#dc2626", marginBottom: "0.5rem" }}>
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{ backgroundColor: "#1B4332", color: "white", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "0.875rem", padding: "0.5rem 1.5rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", opacity: submitting ? 0.6 : 1 }}
                    >
                        {submitting ? "Filing..." : "Submit Claim"}
                    </button>
                </div>
            )}

            {success && (
                <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.5rem", padding: "0.625rem 0.875rem", marginBottom: "1rem", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", color: "#166534" }}>
                    ✓ {success}
                </div>
            )}

            {/* Claims List */}
            {loading ? (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#9ca3af" }}>Loading claims...</p>
            ) : claims.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                    <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem" }}>No claims filed yet. Click "+ File Claim" to get started.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {claims.map((claim) => {
                        const color = STATUS_COLOR[claim.status];
                        const stepIndex = STATUS_STEPS.indexOf(claim.status);
                        return (
                            <div key={claim._id} style={{ border: "1px solid #f3f4f6", borderRadius: "0.75rem", padding: "1rem", backgroundColor: "white" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                                    <div>
                                        <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "0.875rem" }}>
                                            {claim.schemeLabel}
                                        </p>
                                        <p style={{ fontFamily: "Inter, sans-serif", color: "#7C5C3E", fontSize: "0.75rem", marginTop: "0.125rem" }}>
                                            {claim.plotId?.label} · Applied {new Date(claim.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1B4332", fontSize: "1rem" }}>
                                            ₹{claim.claimedAmount.toLocaleString()}
                                        </p>
                                        <span style={{ fontSize: "0.7rem", fontFamily: "Inter, sans-serif", padding: "0.2rem 0.5rem", borderRadius: "9999px", backgroundColor: color.bg, border: `1px solid ${color.border}`, color: color.text }}>
                                            {claim.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                                    {STATUS_STEPS.map((step, i) => {
                                        const isCompleted = i <= stepIndex;
                                        const isLast = i === STATUS_STEPS.length - 1;
                                        return (
                                            <div key={step} style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}>
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                                                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: isCompleted ? color.dot : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        {isCompleted && <span style={{ color: "white", fontSize: "0.6rem" }}>✓</span>}
                                                    </div>
                                                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", color: isCompleted ? color.text : "#9ca3af", whiteSpace: "nowrap", textTransform: "capitalize" }}>
                                                        {step}
                                                    </span>
                                                </div>
                                                {!isLast && (
                                                    <div style={{ flex: 1, height: "2px", backgroundColor: i < stepIndex ? color.dot : "#e5e7eb", margin: "0 0.25rem", marginBottom: "1rem" }} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {claim.description && (
                                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#7C5C3E", marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid #f3f4f6" }}>
                                        {claim.description}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}