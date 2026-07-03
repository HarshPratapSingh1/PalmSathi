export default function MillCard({ mill }) {
    const isPriceAboveMin = mill.todayOfferedPricePerKg >= mill.govtMinPricePerKg;
    const diff = (mill.todayOfferedPricePerKg - mill.govtMinPricePerKg).toFixed(1);

    return (
        <div className="ps-card">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div>
                    <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1B4332", fontSize: "1rem" }}>
                        {mill.name}
                    </h3>
                    <p style={{ fontFamily: "Inter, sans-serif", color: "#7C5C3E", fontSize: "0.75rem", marginTop: "0.125rem" }}>
                        Daily capacity: {mill.dailyCapacityKg.toLocaleString()} kg
                    </p>
                </div>
                <span style={{
                    fontSize: "0.75rem",
                    fontFamily: "Inter, sans-serif",
                    padding: "0.25rem 0.625rem",
                    borderRadius: "9999px",
                    backgroundColor: isPriceAboveMin ? "#dcfce7" : "#fef2f2",
                    color: isPriceAboveMin ? "#16a34a" : "#dc2626",
                }}>
                    {isPriceAboveMin ? "✓ Fair price" : "⚠ Below minimum"}
                </span>
            </div>

            <div className="ps-info-box" style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                    <span style={{ color: "#7C5C3E" }}>Mill offering today</span>
                    <span style={{ color: "#1B4332", fontWeight: 600 }}>₹{mill.todayOfferedPricePerKg}/kg</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                    <span style={{ color: "#7C5C3E" }}>Govt minimum (NMEO-OP)</span>
                    <span style={{ color: "#7C5C3E", fontWeight: 600 }}>₹{mill.govtMinPricePerKg}/kg</span>
                </div>
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "0.5rem", marginTop: "0.25rem", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#7C5C3E" }}>Difference</span>
                    <span style={{ fontWeight: 600, color: isPriceAboveMin ? "#16a34a" : "#dc2626" }}>
                        {isPriceAboveMin ? "+" : ""}₹{diff}/kg
                    </span>
                </div>
            </div>

            <p style={{ fontSize: "0.75rem", fontFamily: "Inter, sans-serif", color: "#7C5C3E", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                Available slots today
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {mill.slots.filter((s) => s.remainingKg > 0).length === 0 ? (
                    <p style={{ fontSize: "0.75rem", color: "#9ca3af", fontFamily: "Inter, sans-serif" }}>
                        No slots available
                    </p>
                ) : (
                    mill.slots
                        .filter((s) => s.remainingKg > 0)
                        .map((slot) => (
                            <div key={slot._id} style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "#FAFAF7",
                                borderRadius: "0.5rem",
                                padding: "0.5rem 0.75rem",
                                fontSize: "0.75rem",
                                fontFamily: "Inter, sans-serif",
                            }}>
                                <span style={{ color: "#1B4332", fontWeight: 500 }}>
                                    {new Date(slot.slotTime).toLocaleTimeString("en-IN", {
                                        hour: "2-digit", minute: "2-digit", hour12: true,
                                    })}
                                </span>
                                <span style={{ color: "#7C5C3E" }}>{slot.remainingKg} kg remaining</span>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}