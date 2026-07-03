import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    aadhaarLast4: { type: String }, // mocked, never store full Aadhaar in real systems
    village: { type: String },
    district: { type: String },
    state: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Farmer", farmerSchema);
