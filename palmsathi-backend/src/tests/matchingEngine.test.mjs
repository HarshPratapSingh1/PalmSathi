import assert from "node:assert/strict";
import { runMatching } from "../services/matchingEngine.js";

const now = new Date();
const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000);
const hoursFromNow = (h) => new Date(now.getTime() + h * 60 * 60 * 1000);

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  PASS - ${name}`);
        passed++;
    } catch (err) {
        console.error(`  FAIL - ${name}`);
        console.error(`         ${err.message}`);
        failed++;
    }
}

console.log("\nmatchingEngine: runMatching\n");

test("prioritizes an older, farther batch over a fresher, closer one", () => {
    const batches = [
        { id: "fresh_close", quantityKg: 500, harvestedAt: hoursAgo(2), plotLocation: { lat: 16.90, lng: 81.70 } },
        { id: "old_far", quantityKg: 500, harvestedAt: hoursAgo(20), plotLocation: { lat: 16.70, lng: 81.40 } },
    ];
    const mills = [
        { id: "millX", location: { lat: 16.90, lng: 81.70 }, slots: [{ id: "slot1", slotTime: hoursFromNow(1), remainingKg: 500 }] },
    ];
    const { assignments } = runMatching(batches, mills, { minFreshnessThreshold: 70, decayRateWeight: 1.5, travelWeight: 0.5 });
    assert.equal(assignments.length, 1);
    assert.equal(assignments[0].batchId, "old_far");
});

test("rejects a batch that can't meet the freshness threshold at any slot", () => {
    const batches = [
        { id: "too_old", quantityKg: 300, harvestedAt: hoursAgo(34), plotLocation: { lat: 16.78, lng: 81.60 } },
    ];
    const mills = [
        { id: "millY", location: { lat: 16.78, lng: 81.60 }, slots: [{ id: "slot1", slotTime: hoursFromNow(1), remainingKg: 300 }] },
    ];
    const { assignments, unassigned } = runMatching(batches, mills, { minFreshnessThreshold: 70, decayRateWeight: 1.5, travelWeight: 0.5 });
    assert.equal(assignments.length, 0);
    assert.equal(unassigned.length, 1);
    assert.equal(unassigned[0].batchId, "too_old");
    assert.equal(unassigned[0].reason, "no_slot_within_freshness_threshold");
});

test("skips a slot with insufficient capacity and uses one that fits", () => {
    const batches = [
        { id: "big_batch", quantityKg: 800, harvestedAt: hoursAgo(1), plotLocation: { lat: 16.90, lng: 81.70 } },
    ];
    const mills = [
        { id: "millSmall", location: { lat: 16.90, lng: 81.70 }, slots: [{ id: "slotSmall", slotTime: hoursFromNow(1), remainingKg: 200 }] },
        { id: "millBig", location: { lat: 16.95, lng: 81.75 }, slots: [{ id: "slotBig", slotTime: hoursFromNow(2), remainingKg: 1000 }] },
    ];
    const { assignments } = runMatching(batches, mills, { minFreshnessThreshold: 70, decayRateWeight: 1.5, travelWeight: 0.5 });
    assert.equal(assignments.length, 1);
    assert.equal(assignments[0].millId, "millBig");
    assert.equal(assignments[0].slotId, "slotBig");
});

test("assigns two simultaneous batches to two different slots without conflict", () => {
    const batches = [
        { id: "batch1", quantityKg: 400, harvestedAt: hoursAgo(3), plotLocation: { lat: 16.90, lng: 81.70 } },
        { id: "batch2", quantityKg: 400, harvestedAt: hoursAgo(5), plotLocation: { lat: 16.90, lng: 81.70 } },
    ];
    const mills = [
        {
            id: "millX", location: { lat: 16.90, lng: 81.70 }, slots: [
                { id: "slotA", slotTime: hoursFromNow(1), remainingKg: 400 },
                { id: "slotB", slotTime: hoursFromNow(2), remainingKg: 400 },
            ]
        },
    ];
    const { assignments } = runMatching(batches, mills, { minFreshnessThreshold: 70, decayRateWeight: 1.5, travelWeight: 0.5 });
    assert.equal(assignments.length, 2);
    const usedSlots = new Set(assignments.map((a) => a.slotId));
    assert.equal(usedSlots.size, 2);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);