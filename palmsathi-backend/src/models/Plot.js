import mongoose from "mongoose";

const plotSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    label: { type: String, default: "Plot 1" },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    areaInHectares: { type: Number, required: true },
    palmCount: { type: Number, required: true },
    plantingYear: { type: Number, required: true },
    soilType: { type: String, default: "loamy" },
    lastHarvestDate: { type: Date, default: null }, // null = never harvested yet
  },
  { timestamps: true }
);

// Convenience virtual: plot age in years, used by the ripeness predictor
plotSchema.virtual("ageInYears").get(function () {
  return new Date().getFullYear() - this.plantingYear;
});

plotSchema.set("toJSON", { virtuals: true });
plotSchema.set("toObject", { virtuals: true });

export default mongoose.model("Plot", plotSchema);
