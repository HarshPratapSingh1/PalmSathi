import "dotenv/config";
import dns from "dns";
import mongoose from "mongoose";
import dayjs from "dayjs";
import { connectDB } from "../config/db.js";
import Mill from "../models/Mill.js";

if (process.env.NODE_ENV !== "production") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

async function seed() {
    await connectDB();

    console.log("[seed] clearing existing mills only (farmers/plots untouched)...");
    await Mill.deleteMany({});

    console.log("[seed] creating mills with today's slots...");
    const today = dayjs().hour(9).minute(0).second(0);
    await Mill.insertMany([
        {
            name: "Godavari Palm Oil Mill",
            location: { lat: 16.90, lng: 81.70 },
            dailyCapacityKg: 5000,
            todayOfferedPricePerKg: 18.5,
            govtMinPricePerKg: 17.8,
            slots: [
                { slotTime: today.add(1, "hour").toDate(), capacityKg: 1200, remainingKg: 1200 },
                { slotTime: today.add(3, "hour").toDate(), capacityKg: 1200, remainingKg: 1200 },
                { slotTime: today.add(5, "hour").toDate(), capacityKg: 1200, remainingKg: 1200 },
            ],
        },
        {
            name: "West Godavari Agro Processors",
            location: { lat: 16.78, lng: 81.60 },
            dailyCapacityKg: 4000,
            todayOfferedPricePerKg: 18.2,
            govtMinPricePerKg: 17.8,
            slots: [
                { slotTime: today.add(2, "hour").toDate(), capacityKg: 1000, remainingKg: 1000 },
                { slotTime: today.add(4, "hour").toDate(), capacityKg: 1000, remainingKg: 1000 },
            ],
        },
    ]);

    console.log("[seed] done. Mills created (farmers and plots left untouched).");
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error("[seed] failed:", err);
    process.exit(1);
});
