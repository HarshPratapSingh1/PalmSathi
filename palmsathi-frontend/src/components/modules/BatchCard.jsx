import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function freshnessScore(harvestedAt) {
    const hours = (Date.now() - new Date(harvestedAt).getTime()) / 3600000;
    if (hours <= 12) return 100;
    if (hours <= 36) return Math.max(0, Math.round(100 - (hours - 12) * 3));
    return Math.max(0, Math.round(28 - (hours - 36) * 6));
}

export default function BatchCard({ batch }) {
    const [score, setScore] = useState(freshnessScore(batch.harvestedAt));

    useEffect(() => {
        const interval = setInterval(() => setScore(freshnessScore(batch.harvestedAt)), 30000);
        return () => clearInterval(interval);
    }, [batch.harvestedAt]);

    const hoursAgo = ((Date.now() - new Date(batch.harvestedAt).getTime()) / 3600000).toFixed(1);
    const isGood = score >= 75;
    const isWarning = score >= 50 && score < 75;
    const isCritical = score < 50;

    return (
        <Card className={cn(
            "border-l-4 transition-all",
            isGood && "border-l-green-500",
            isWarning && "border-l-yellow-500",
            isCritical && "border-l-red-500"
        )}>
            <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-heading font-semibold text-forest text-sm">{batch.plotId?.label || "Unknown Plot"}</p>
                        <p className="text-xs text-muted-foreground font-body mt-0.5">{batch.quantityKg} kg · {hoursAgo}h ago</p>
                    </div>
                    <div className="text-right">
                        <p className={cn("font-heading font-bold text-2xl",
                            isGood && "text-green-600",
                            isWarning && "text-yellow-600",
                            isCritical && "text-red-600"
                        )}>
                            {score}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">freshness</p>
                    </div>
                </div>

                <Progress
                    value={score}
                    indicatorClassName={cn(
                        isGood && "bg-green-500",
                        isWarning && "bg-yellow-500",
                        isCritical && "bg-red-500"
                    )}
                />

                <p className={cn("text-xs font-body",
                    isGood && "text-green-600",
                    isWarning && "text-yellow-600",
                    isCritical && "text-red-600"
                )}>
                    {isGood ? "✓ Good quality — book a slot soon"
                        : isWarning ? "⚠ Quality dropping — book immediately"
                            : "✗ Critical — value significantly reduced"}
                </p>
            </CardContent>
        </Card>
    );
}