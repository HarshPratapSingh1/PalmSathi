import "dotenv/config";
import mongoose from "mongoose";
import dayjs from "dayjs";
import { connectDB } from "../config/db.js";
import Farmer from "../models/Farmer.js";
import Plot from "../models/Plot.js";
import Mill from "../models/Mill.js";

async function seed() {
  await connectDB();

  console.log("[seed] clearing existing demo data...");
  await Promise.all([Farmer.deleteMany({}), Plot.deleteMany({}), Mill.deleteMany({})]);

  console.log("[seed] creating farmers...");
  const farmers = await Farmer.insertMany([
    { name: "Ramesh Naidu", phone: "9000000001", village: "Devarapalli", district: "East Godavari", state: "Andhra Pradesh" },
    { name: "Lakshmi Devi", phone: "9000000002", village: "Tanuku", district: "West Godavari", state: "Andhra Pradesh" },
    { name: "Suresh Reddy", phone: "9000000003", village: "Achanta", district: "West Godavari", state: "Andhra Pradesh" },
  ]);

  console.log("[seed] creating plots (varied ages so ripeness cycles differ)...");
  const plots = await Plot.insertMany([
    {
      farmerId: farmers[0]._id,
      label: "North Plot",
      location: { lat: 16.93, lng: 81.73 },
      areaInHectares: 2.5,
      palmCount: 320,
      plantingYear: 2010, // mature, 10-day cycle
      soilType: "alluvial",
      lastHarvestDate: dayjs().subtract(11, "day").toDate(),
    },
    {
      farmerId: farmers[1]._id,
      label: "River Side Plot",
      location: { lat: 16.75, lng: 81.68 },
      areaInHectares: 1.8,
      palmCount: 210,
      plantingYear: 2018, // maturing, 14-day cycle
      soilType: "loamy",
      lastHarvestDate: dayjs().subtract(13, "day").toDate(),
    },
    {
      farmerId: farmers[2]._id,
      label: "Home Plot",
      location: { lat: 16.80, lng: 81.55 },
      areaInHectares: 3.2,
      palmCount: 400,
      plantingYear: 2022, // young, 18-day cycle
      soilType: "clay",
      lastHarvestDate: null,
    },
  ]);

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

  console.log("[seed] done. Plots created:", plots.map((p) => p._id.toString()));
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
