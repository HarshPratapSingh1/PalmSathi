import { Server } from "socket.io";
import HarvestBatch from "../models/HarvestBatch.js";
import { freshnessScoreFromDate } from "../utils/freshness.js";

const TICK_INTERVAL_MS = 30 * 1000; // every 30s for demo purposes (would be a few minutes in production)
const DANGER_THRESHOLD = 75; // if freshness drops below this, nudge the client to re-run matching

export function setupSockets(httpServer, app) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN || "*" },
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log(`[socket] client connected: ${socket.id}`);
    socket.on("disconnect", () => console.log(`[socket] client disconnected: ${socket.id}`));
  });

  // Periodically recompute freshness for every still-pending batch and
  // broadcast it, so every connected client sees the decay clock ticking
  // in real time without polling.
  setInterval(async () => {
    const pending = await HarvestBatch.find({ status: "pending" });
    if (pending.length === 0) return;

    const updates = pending.map((b) => ({
      batchId: b._id,
      freshnessScore: Math.round(freshnessScoreFromDate(b.harvestedAt)),
    }));

    io.emit("freshnessTick", updates);

    const anyInDanger = updates.some((u) => u.freshnessScore < DANGER_THRESHOLD);
    if (anyInDanger) {
      io.emit("freshnessDangerAlert", {
        message: "Some batches are approaching the spoilage threshold - re-run matching soon.",
        batches: updates.filter((u) => u.freshnessScore < DANGER_THRESHOLD),
      });
    }
  }, TICK_INTERVAL_MS);

  return io;
}
