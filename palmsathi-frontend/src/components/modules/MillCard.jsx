import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Clock } from "lucide-react";

export default function MillCard({ mill }) {
    const isPriceAboveMin = mill.todayOfferedPricePerKg >= mill.govtMinPricePerKg;
    const diff = (mill.todayOfferedPricePerKg - mill.govtMinPricePerKg).toFixed(1);

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-forest/10 rounded-lg flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-forest" />
                        </div>
                        <div>
                            <CardTitle className="text-base text-forest">{mill.name}</CardTitle>
                            <p className="text-xs text-muted-foreground font-body">{mill.dailyCapacityKg.toLocaleString()} kg/day</p>
                        </div>
                    </div>
                    <Badge variant={isPriceAboveMin ? "success" : "destructive"}>
                        {isPriceAboveMin ? "Fair price" : "Below min"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-xs font-body">
                        <span className="text-muted-foreground">Mill offering</span>
                        <span className="font-semibold text-forest">₹{mill.todayOfferedPricePerKg}/kg</span>
                    </div>
                    <div className="flex justify-between text-xs font-body">
                        <span className="text-muted-foreground">Govt minimum</span>
                        <span className="font-medium text-muted-foreground">₹{mill.govtMinPricePerKg}/kg</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xs font-body">
                        <span className="text-muted-foreground">Difference</span>
                        <span className={`font-bold ${isPriceAboveMin ? "text-green-600" : "text-red-600"}`}>
                            {isPriceAboveMin ? "+" : ""}₹{diff}/kg
                        </span>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-body text-muted-foreground uppercase tracking-wide mb-2">Available slots</p>
                    <div className="space-y-1.5">
                        {mill.slots.filter((s) => s.remainingKg > 0).length === 0 ? (
                            <p className="text-xs text-muted-foreground font-body">No slots available</p>
                        ) : (
                            mill.slots.filter((s) => s.remainingKg > 0).map((slot) => (
                                <div key={slot._id} className="flex justify-between items-center bg-muted/50 rounded-md px-3 py-1.5">
                                    <div className="flex items-center gap-1.5 text-xs font-body text-forest font-medium">
                                        <Clock className="h-3 w-3" />
                                        {new Date(slot.slotTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" })}
                                    </div>
                                    <span className="text-xs text-muted-foreground font-body">{slot.remainingKg} kg left</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}