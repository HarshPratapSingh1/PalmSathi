import HarvestBatch from "../models/HarvestBatch.js";
import Mill from "../models/Mill.js";
import Booking from "../models/Booking.js";
import { runMatching } from "../services/matchingEngine.js";
import { awardPoints } from "../services/walletService.js";

const ENGINE_OPTIONS = {
  minFreshnessThreshold: Number(process.env.MIN_FRESHNESS_THRESHOLD || 70),
  decayRateWeight: Number(process.env.DECAY_RATE_WEIGHT || 1.5),
  travelWeight: Number(process.env.TRAVEL_WEIGHT || 0.5),
};

export async function runMatchingPass(req, res) {
  try {
    const pendingBatches = await HarvestBatch.find({ status: "pending" }).populate("plotId");
    const validBatches = pendingBatches.filter(b => b.plotId !== null);
    const mills = await Mill.find();

    if (validBatches.length === 0) {
      return res.json({ assignments: [], unassigned: [], message: "No pending batches." });
    }

    const batchInput = validBatches.map((b) => ({
      id: b._id.toString(),
      quantityKg: b.quantityKg,
      harvestedAt: b.harvestedAt,
      plotLocation: b.plotId.location,
    }));

    const millInput = mills.map((m) => ({
      id: m._id.toString(),
      location: m.location,
      slots: m.slots
        .filter((s) => s.remainingKg > 0)
        .map((s) => ({ id: s._id.toString(), slotTime: s.slotTime, remainingKg: s.remainingKg })),
    }));

    const { assignments, unassigned } = runMatching(batchInput, millInput, ENGINE_OPTIONS);

    const savedBookings = [];
    for (const a of assignments) {
      const booking = await Booking.create({
        batchId: a.batchId,
        millId: a.millId,
        slotId: a.slotId,
        slotTime: a.slotTime,
        quantityKg: a.quantityKg,
        freshnessAtAssignment: a.freshnessAtAssignment,
      });
      savedBookings.push(booking);

      await HarvestBatch.findByIdAndUpdate(a.batchId, { status: "assigned" });

      await Mill.updateOne(
        { _id: a.millId, "slots._id": a.slotId },
        { $inc: { "slots.$.remainingKg": -a.quantityKg } }
      );

      if (a.freshnessAtAssignment >= 85) {
        const batch = await HarvestBatch.findById(a.batchId);
        if (batch) {
          await awardPoints(batch.farmerId.toString(), 30, "Booked mill slot with freshness above 85");
        }
      }
    }

    for (const u of unassigned) {
      await HarvestBatch.findByIdAndUpdate(u.batchId, { status: "unassigned_emergency" });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("matchingPassComplete", {
        assignmentsCount: savedBookings.length,
        unassignedCount: unassigned.length,
        bookings: savedBookings,
        unassigned,
      });
    }

    res.json({ assignments: savedBookings, unassigned });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listBookings(req, res) {
  const bookings = await Booking.find({})
    .populate({ path: "batchId", populate: { path: "plotId" } })
    .populate("millId");

  // Filter to only show bookings belonging to the logged-in farmer
  const myBookings = bookings.filter(b =>
    b.batchId?.farmerId?.toString() === req.farmer.id
  );

  res.json(myBookings);
}