import dayjs from "dayjs";
import MaxHeap from "../utils/maxHeap.js";
import { computeUrgency, projectedFreshnessAtSlot } from "../utils/freshness.js";
import { estimateTravelMinutes } from "../utils/geo.js";

/**
 * Pure matching function - no DB access, fully testable.
 *
 * @param {Array} batches - [{ id, quantityKg, harvestedAt, plotLocation }]
 * @param {Array} mills - [{ id, location, slots: [{ id, slotTime, remainingKg }] }]
 * @param {Object} options - { minFreshnessThreshold, decayRateWeight, travelWeight }
 *
 * @returns {{ assignments: Array, unassigned: Array }}
 *   assignments: [{ batchId, millId, slotId, slotTime, quantityKg, freshnessAtAssignment }]
 *   unassigned: [{ batchId, reason }]
 */
export function runMatching(batches, mills, options = {}) {
  const {
    minFreshnessThreshold = 70,
    decayRateWeight = 1.5,
    travelWeight = 0.5,
  } = options;

  // Deep-ish clone of slot remaining capacity so we don't mutate caller's
  // objects mid-calculation - the caller persists the final state.
  const millState = mills.map((m) => ({
    id: m.id,
    location: m.location,
    slots: m.slots.map((s) => ({ id: s.id, slotTime: s.slotTime, remainingKg: s.remainingKg })),
  }));

  // Priority = urgency, but urgency depends on travel time to the NEAREST
  // mill, so we precompute nearest-mill distance once per batch.
  const enriched = batches.map((batch) => {
    const nearestMill = millState.reduce((closest, mill) => {
      const t = estimateTravelMinutes(batch.plotLocation, mill.location);
      return !closest || t < closest.travelTimeMinutes
        ? { mill, travelTimeMinutes: t }
        : closest;
    }, null);

    const travelTimeMinutes = nearestMill ? nearestMill.travelTimeMinutes : 0;
    const urgency = computeUrgency(batch, travelTimeMinutes, { decayRateWeight, travelWeight });

    return { ...batch, travelTimeMinutes, urgency };
  });

  const pq = new MaxHeap(enriched, (b) => b.urgency);
  const assignments = [];
  const unassigned = [];

  while (!pq.isEmpty()) {
    const batch = pq.pop();

    // Find every slot, across every mill, that can (a) physically fit the
    // quantity and (b) keep freshness above threshold at arrival time -
    // then pick the earliest such slot so the bunch doesn't keep waiting.
    const candidates = [];
    for (const mill of millState) {
      for (const slot of mill.slots) {
        if (slot.remainingKg < batch.quantityKg) continue;
        const projected = projectedFreshnessAtSlot(batch, slot.slotTime);
        if (projected < minFreshnessThreshold) continue;

        candidates.push({ mill, slot, projected });
      }
    }

    candidates.sort((a, b) => dayjs(a.slot.slotTime).diff(dayjs(b.slot.slotTime)));

    if (candidates.length === 0) {
      unassigned.push({
        batchId: batch.id,
        reason: "no_slot_within_freshness_threshold",
      });
      continue;
    }

    const { mill, slot, projected } = candidates[0];
    slot.remainingKg -= batch.quantityKg; // reserve capacity for subsequent iterations

    assignments.push({
      batchId: batch.id,
      millId: mill.id,
      slotId: slot.id,
      slotTime: slot.slotTime,
      quantityKg: batch.quantityKg,
      freshnessAtAssignment: Math.round(projected),
    });
  }

  return { assignments, unassigned };
}
