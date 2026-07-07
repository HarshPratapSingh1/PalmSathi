import { useState, useEffect } from "react";
import { getPlotRipeness } from "@/api/plots";
import { markHarvested } from "@/api/harvest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sprout, Calendar, Clock } from "lucide-react";

export default function PlotCard({ plot, onHarvested }) {
    const [ripeness, setRipeness] = useState(null);
    const [harvesting, setHarvesting] = useState(false);
    const [qty, setQty] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        getPlotRipeness(plot._id).then((res) => setRipeness(res.data));
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
        ? new Date() >= new Date(ripeness.windowStart) && new Date() <= new Date(ripeness.windowEnd)
        : false;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-leaf/10 rounded-lg flex items-center justify-center">
                            <Sprout className="h-4 w-4 text-leaf" />
                        </div>
                        <div>
                            <CardTitle className="text-base text-forest">{plot.label}</CardTitle>
                            <p className="text-xs text-muted-foreground font-body mt-0.5">
                                {plot.areaInHectares} ha · {plot.palmCount} palms · {plot.plantingYear}
                            </p>
                        </div>
                    </div>
                    <Badge variant={isInWindow ? "success" : "outline"}>
                        {isInWindow ? "Ready" : "Not ready"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {ripeness && (
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs font-body">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                Expected harvest
                            </div>
                            <span className="font-medium text-forest">
                                {new Date(ripeness.expectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-body">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                Harvest window
                            </div>
                            <span className="font-medium text-forest">
                                {new Date(ripeness.windowStart).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} –{" "}
                                {new Date(ripeness.windowEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-body">
                            <span className="text-muted-foreground">Cycle</span>
                            <span className="font-medium text-forest">{ripeness.cycleDaysUsed} days</span>
                        </div>
                    </div>
                )}

                {!showForm ? (
                    <Button onClick={() => setShowForm(true)} className="w-full" size="sm">
                        Mark as harvested
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            placeholder="Qty in kg"
                            className="flex-1"
                        />
                        <Button onClick={handleHarvest} disabled={harvesting} size="sm">
                            {harvesting ? "..." : "Confirm"}
                        </Button>
                        <Button variant="outline" onClick={() => setShowForm(false)} size="sm">
                            Cancel
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}