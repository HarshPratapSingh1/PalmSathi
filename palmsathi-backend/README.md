# PalmSathi Backend — Harvest-to-Mill Booking Core

This is the first working slice of PalmSathi: the part that predicts when a
plot's oil palm bunches will ripen, tracks freshness decay after harvest,
and runs a real-time matching engine that books farmers into mill slots
before their FFB (Fresh Fruit Bunches) spoils.

## Setup

```bash
cd palmsathi-backend
npm install
cp .env.example .env
# edit .env if your MongoDB isn't running locally on the default port

npm run seed   # creates demo farmers, plots, and mills with today's slots
npm run dev    # starts the server with nodemon on http://localhost:5000
```

Requires a local or Atlas MongoDB instance reachable via `MONGO_URI`.

## How the pieces fit together

- `src/utils/ripeness.js` — predicts a plot's next harvest window from
  planting year + season (`averageCycleDays`).
- `src/utils/freshness.js` — models FFA-driven quality decay as a 0-100
  score based on hours since harvest.
- `src/utils/maxHeap.js` — generic priority queue used to process the most
  urgent (fastest-decaying / farthest-from-mill) batches first.
- `src/services/matchingEngine.js` — the pure, DB-free matching algorithm:
  greedy urgency-priority assignment of batches to the earliest mill slot
  that keeps freshness above the configured threshold.
- `src/controllers/bookingController.js` — pulls live data from MongoDB,
  runs the matching engine, persists `Booking` docs, decrements mill slot
  capacity, and broadcasts results over Socket.IO.
- `src/sockets/index.js` — background tick job that recomputes freshness
  for all pending batches every 30s (demo interval) and emits a danger
  alert if anything drops below threshold.

## Demo walkthrough (curl)

1. **Check seeded plots and their ripeness prediction:**
   ```bash
   curl http://localhost:5000/api/plots
   curl http://localhost:5000/api/plots/<PLOT_ID>/ripeness
   ```

2. **Mark a plot as harvested (creates a pending batch):**
   ```bash
   curl -X POST http://localhost:5000/api/harvest \
     -H "Content-Type: application/json" \
     -d '{"plotId": "<PLOT_ID>", "quantityKg": 850}'
   ```

3. **Repeat step 2 for the other two seeded plots** with different
   `quantityKg` values, ideally a few minutes apart, so their freshness
   scores differ when you run matching — this is what makes the urgency
   ordering visible in the demo.

4. **Check pending batches and their live freshness:**
   ```bash
   curl http://localhost:5000/api/harvest/pending
   ```

5. **Run the matching engine:**
   ```bash
   curl -X POST http://localhost:5000/api/bookings/run-matching
   ```
   This assigns each pending batch to the earliest mill slot that keeps it
   above the freshness threshold, prioritizing the most urgent batches
   first. Connected Socket.IO clients receive a `matchingPassComplete`
   event with the same payload.

6. **View confirmed bookings:**
   ```bash
   curl http://localhost:5000/api/bookings
   ```

7. **Watch live decay:** connect any Socket.IO client to
   `http://localhost:5000` and listen for `freshnessTick` (every 30s) and
   `freshnessDangerAlert` events to see the spoilage clock in action
   without re-running matching manually.

## Tuning the engine live (for the demo)

Three env vars control behavior without touching code — good for showing
judges how the algorithm responds to different priorities:

- `MIN_FRESHNESS_THRESHOLD` — how strict the quality cutoff is (default 70)
- `DECAY_RATE_WEIGHT` — how much spoilage speed matters vs. distance
- `TRAVEL_WEIGHT` — how much travel time matters vs. spoilage speed

## What's next

This slice deliberately leaves out farmer auth, the incentive wallet, and
the React frontend so the booking core can be tested and demoed in
isolation first. Next steps: a thin React dashboard that visualizes the
priority queue and slot assignments live, then layering in onboarding and
the incentive wallet.
