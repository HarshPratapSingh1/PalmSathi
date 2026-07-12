import dayjs from "dayjs";
import Mill from "../models/Mill.js";

/**
 * Regenerates today's slots for all mills.
 * Runs daily at midnight — slots are anchored to the current day
 * so farmers always see fresh availability each morning.
 */
export async function refreshMillSlots() {
    const mills = await Mill.find();
    const today = dayjs().hour(9).minute(0).second(0);

    for (const mill of mills) {
        const isLargeMill = mill.dailyCapacityKg >= 5000;

        const newSlots = isLargeMill
            ? [
                { slotTime: today.add(1, "hour").toDate(), capacityKg: 1200, remainingKg: 1200 },
                { slotTime: today.add(3, "hour").toDate(), capacityKg: 1200, remainingKg: 1200 },
                { slotTime: today.add(5, "hour").toDate(), capacityKg: 1200, remainingKg: 1200 },
            ]
            : [
                { slotTime: today.add(2, "hour").toDate(), capacityKg: 1000, remainingKg: 1000 },
                { slotTime: today.add(4, "hour").toDate(), capacityKg: 1000, remainingKg: 1000 },
            ];

        mill.slots = newSlots;
        await mill.save();
    }

    console.log(`[slot-refresh] Mill slots refreshed for ${dayjs().format("YYYY-MM-DD")}`);
}