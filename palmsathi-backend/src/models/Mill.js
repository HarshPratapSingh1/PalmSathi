import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    slotTime: { type: Date, required: true },
    capacityKg: { type: Number, required: true },
    remainingKg: { type: Number, required: true },
  },
  { _id: true }
);

const millSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    dailyCapacityKg: { type: Number, required: true },
    todayOfferedPricePerKg: { type: Number, required: true }, // what the mill is offering today
    govtMinPricePerKg: { type: Number, required: true }, // NMEO-OP linked minimum (14.3% of CPO price + VGF, simplified)
    slots: [slotSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Mill", millSchema);
