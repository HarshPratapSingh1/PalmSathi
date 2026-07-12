import cron from "node-cron";
import { refreshMillSlots } from "./millSlotRefresher.js";

export function startCronJobs() {
    // Refresh mill slots every day at midnight
    cron.schedule("0 0 * * *", async () => {
        console.log("[cron] Running daily mill slot refresh...");
        await refreshMillSlots();
    });

    console.log("[cron] Daily mill slot refresh scheduled at midnight");
}