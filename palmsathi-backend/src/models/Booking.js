import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: "HarvestBatch", required: true },
    millId: { type: mongoose.Schema.Types.ObjectId, ref: "Mill", required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, required: true }, // sub-doc id within Mill.slots
    slotTime: { type: Date, required: true },
    quantityKg: { type: Number, required: true },
    freshnessAtAssignment: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "completed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
