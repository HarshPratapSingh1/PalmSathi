import { useState } from "react";
import { getAdvisory } from "@/api/plots";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Leaf, Droplets, Thermometer, AlertTriangle } from "lucide-react";

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

    const stageVariant = {
        immature: "warning",
        young_bearing: "success",
        mature_bearing: "default",
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Leaf className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-base text-forest">Advisory</CardTitle>
                            <CardDescription>Live weather-based recommendations</CardDescription>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchAdvisory} disabled={loading}>
                        {loading ? "Fetching..." : "Get advice"}
                    </Button>
                </div>
            </CardHeader>

            {open && advisory && (
                <CardContent className="space-y-4">
                    {advisory.alerts.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-1">
                            {advisory.alerts.map((alert, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-orange-700 font-body">
                                    <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                                    {alert}
                                </div>
                            ))}
                        </div>
                    )}

                    <Badge variant={stageVariant[advisory.stage] || "default"}>
                        {advisory.stageLabel}
                    </Badge>

                    <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Thermometer className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="text-xs font-heading font-semibold text-forest">Current Weather</p>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-xs font-body">
                            {[
                                ["Temperature", `${advisory.weather.tempC}°C`],
                                ["Humidity", `${advisory.weather.humidity}%`],
                                ["Condition", advisory.weather.condition],
                                ["Rainfall", `${advisory.weather.rainMm} mm/hr`],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between">
                                    <span className="text-muted-foreground">{label}</span>
                                    <span className="font-medium text-forest">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Droplets className="h-3.5 w-3.5 text-blue-600" />
                            <p className="text-xs font-heading font-semibold text-blue-700">Irrigation</p>
                        </div>
                        <p className="text-xs font-body text-blue-700 font-semibold">{advisory.irrigation.action}</p>
                        <p className="text-xs font-body text-blue-600/80 mt-0.5">{advisory.irrigation.reason}</p>
                        {advisory.irrigation.frequency && (
                            <p className="text-xs font-body text-blue-600/70 mt-0.5">Frequency: {advisory.irrigation.frequency}</p>
                        )}
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Leaf className="h-3.5 w-3.5 text-leaf" />
                            <p className="text-xs font-heading font-semibold text-forest">Fertilizer Schedule</p>
                        </div>
                        <div className="space-y-1.5 text-xs font-body">
                            {[
                                ["Nitrogen (Urea)", advisory.fertilizer.nitrogen],
                                ["Phosphorus (SSP)", advisory.fertilizer.phosphorus],
                                ["Potassium (MOP)", advisory.fertilizer.potassium],
                                ["Magnesium", advisory.fertilizer.magnesium],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between gap-2">
                                    <span className="text-muted-foreground shrink-0">{label}</span>
                                    <span className="font-medium text-forest text-right">{value}</span>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-2" />
                        <p className="text-xs font-body text-amber-700">💡 {advisory.fertilizer.note}</p>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}