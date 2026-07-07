import { useState } from "react";
import API from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function AddPlotModal({ onClose, onPlotAdded }) {
    const { farmer } = useAuth();
    const [form, setForm] = useState({
        label: "",
        areaInHectares: "",
        palmCount: "",
        plantingYear: "",
        soilType: "loamy",
        lat: "",
        lng: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit() {
        if (!form.label || !form.areaInHectares || !form.palmCount || !form.plantingYear || !form.lat || !form.lng) {
            setError("Please fill in all required fields.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await API.post("/plots", {
                farmerId: farmer.id,
                label: form.label,
                areaInHectares: Number(form.areaInHectares),
                palmCount: Number(form.palmCount),
                plantingYear: Number(form.plantingYear),
                soilType: form.soilType,
                location: { lat: Number(form.lat), lng: Number(form.lng) },
            });
            onPlotAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create plot.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000,
        }}>
            <div style={{
                backgroundColor: "white", borderRadius: "1rem", padding: "1.5rem",
                width: "480px", maxWidth: "90vw", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1B4332", fontSize: "1.1rem", margin: 0 }}>
                        🌱 Add New Plot
                    </h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", color: "#7C5C3E" }}>✕</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                        <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                            Plot name *
                        </label>
                        <input
                            name="label" value={form.label} onChange={handleChange}
                            placeholder="e.g. North Plot"
                            style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                            <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                                Area (hectares) *
                            </label>
                            <input
                                name="areaInHectares" value={form.areaInHectares} onChange={handleChange}
                                type="number" placeholder="e.g. 2.5"
                                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
                            />
                        </div>
                        <div>
                            <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                                Palm count *
                            </label>
                            <input
                                name="palmCount" value={form.palmCount} onChange={handleChange}
                                type="number" placeholder="e.g. 300"
                                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                            <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                                Planting year *
                            </label>
                            <input
                                name="plantingYear" value={form.plantingYear} onChange={handleChange}
                                type="number" placeholder="e.g. 2012"
                                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
                            />
                        </div>
                        <div>
                            <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                                Soil type
                            </label>
                            <select
                                name="soilType" value={form.soilType} onChange={handleChange}
                                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", outline: "none", backgroundColor: "white", boxSizing: "border-box" }}
                            >
                                <option value="loamy">Loamy</option>
                                <option value="alluvial">Alluvial</option>
                                <option value="clay">Clay</option>
                                <option value="sandy">Sandy</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                            <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                                Latitude *
                            </label>
                            <input
                                name="lat" value={form.lat} onChange={handleChange}
                                type="number" placeholder="e.g. 16.85"
                                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
                            />
                        </div>
                        <div>
                            <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#1B4332", fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
                                Longitude *
                            </label>
                            <input
                                name="lng" value={form.lng} onChange={handleChange}
                                type="number" placeholder="e.g. 81.65"
                                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
                            />
                        </div>
                    </div>

                    {error && (
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#dc2626" }}>
                            {error}
                        </p>
                    )}

                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{ flex: 1, backgroundColor: "#40916C", color: "white", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "0.875rem", padding: "0.625rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
                        >
                            {loading ? "Creating..." : "Create Plot"}
                        </button>
                        <button
                            onClick={onClose}
                            style={{ flex: 1, backgroundColor: "#f3f4f6", color: "#7C5C3E", fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "0.875rem", padding: "0.625rem", borderRadius: "0.5rem", border: "none", cursor: "pointer" }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}