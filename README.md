<div align="center">

#  PalmSathi

### *The digital साथी (companion) for India's oil palm farmers*

**From the moment a bunch is planted to the moment it becomes money in a wallet — PalmSathi runs the whole journey.**

</div>

---

## What even is this?

Oil palm farming in India has a nasty little physics problem: once you cut a Fresh Fruit Bunch (FFB) off the tree, it starts rotting almost immediately. Free fatty acid (FFA) builds up, oil quality tanks, and the mill pays less — or refuses it outright. Farmers race the clock to get bunches to a mill *before* they spoil, often with no idea which mill has capacity, what price is fair, or when their trees will even be ready to harvest.

**PalmSathi solves this with software, not guesswork.** It's a full-stack platform that:

- Predicts *exactly* when a plot's bunches will be ripe
- Tracks freshness decay in real time, hour by hour, from the moment of harvest
- Auto-matches urgent (fast-decaying) batches to the nearest mill slot with capacity — like an ambulance dispatch system, but for palm oil
- Tells a farmer how much money they're leaving on the table if they wait
- Tracks government subsidy claims from application to disbursement
- Rewards good practices with a points-and-rewards wallet
- Answers farmer questions in a Hinglish-speaking AI chatbot
- Gives live agronomy advice (fertilizer + irrigation) based on real weather data

It's built as two independent apps — a **Node/Express/MongoDB backend** and a **React + Vite frontend** — talking over a REST API (plus a WebSocket channel for live updates).

---

##  The "Wow, that's clever" list

If you only remember five things about this app, make it these:

| # | Feature | Why it's clever |
|---|---------|------------------|
| 1 | **Freshness Decay Engine** | Models FFA buildup as a curve: rock-solid for 12 hrs, gentle decay to 36 hrs, then a cliff. Every batch has a live, ticking freshness score. |
| 2 | **Smart Matching Engine** | A max-heap priority queue ranks *every pending batch* by urgency (decay speed + distance to nearest mill) and assigns the best available slot — the digital equivalent of a dispatcher triaging emergencies. |
| 3 | **Ripeness Predictor** | Uses plot age + last harvest date + season to tell a farmer the exact window to harvest — not too early (yield loss), not too late (over-ripening). |
| 4 | **Yield & Payout Estimator** | Projects total FFB output and rupee payout using India's NMEO-OP price-linked formula, and shows the government's minimum guarantee alongside the mill's live offer — so no farmer gets short-changed. |
| 5 | **Gamified Incentive Wallet** | Points for harvesting, for booking a fresh batch (≥85 freshness), for filing subsidy claims, for getting a claim disbursed. Real behavior nudges, dressed up as a rewards program. |

---

##  Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Backend — `palmsathi-backend`
- **Runtime:** Node.js (ESM), Express 4
- **Database:** MongoDB + Mongoose
- **Auth:** Phone number + OTP → JWT (7-day expiry)
- **Real-time:** Socket.IO (broadcasts matching results live)
- **Scheduling:** node-cron (freshness decay ticks, daily mill slot refresh)
- **AI Chat:** Groq SDK (streamed responses via SSE)
- **Testing:** Native Node test runner for the matching engine

</td>
<td valign="top" width="50%">

### Frontend — `palmsathi-frontend`
- **Framework:** React 19 + Vite 8
- **Routing:** React Router v7
- **Styling:** Tailwind CSS + shadcn-style component primitives (Radix UI underneath)
- **Icons:** lucide-react
- **HTTP:** Axios
- **Toasts:** Sonner
- **State:** Context API (`AuthContext`) — no Redux needed for this scope

</td>
</tr>
</table>

---

##  Project Structure

```
palmSathi/
├── palmsathi-backend/
│   └── src/
│       ├── controllers/     # request handlers (thin — business logic lives in services)
│       ├── models/          # Mongoose schemas: Farmer, Plot, Mill, HarvestBatch,
│       │                    #   Booking, Advisory, SubsidyClaim, Wallet, OTP
│       ├── routes/          # Express routers, one per resource
│       ├── services/        # THE BRAINS: matchingEngine, advisoryEngine,
│       │                    #   yieldEstimator, walletService, weatherService,
│       │                    #   groqService (chatbot), cronJobs
│       ├── utils/           # freshness math, geo distance, ripeness prediction, max-heap
│       ├── middleware/      # JWT auth guard
│       ├── sockets/         # Socket.IO setup
│       ├── seed/            # seedMills.js — populate demo mills
│       └── tests/           # matchingEngine.test.mjs
│
└── palmsathi-frontend/
    └── src/
        ├── api/             # axios wrappers: auth, plots, mills, harvest
        ├── pages/           # Landing, Register, Login, Dashboard, Admin
        ├── components/
        │   ├── modules/     # PlotCard, MillCard, BatchCard, AdvisoryCard, AddPlotModal
        │   ├── layout/       # Sidebar
        │   └── ui/          # button, card, dialog, input, tabs, badge... (shadcn-style)
        └── context/         # AuthContext (JWT + farmer session)
```

---

##  How the Data Flows (the whole life of one bunch)

```
 Farmer registers (phone, village, district)
        │
        ▼
 Adds a Plot (location, area, palm count, planting year)
        │
        ▼
 Checks Ripeness Prediction → "harvest in 4 days"
        │
        ▼
 Marks plot as Harvested → creates a HarvestBatch (status: pending)
        │                        └─ Wallet: +50 points
        ▼
 Freshness Score starts ticking down live (cron job, every batch, every minute)
        │
        ▼
 Farmer (or system) runs the Matching Engine
        │
        ├─ Max-heap ranks all pending batches by urgency
        ├─ Finds nearest mill slot that keeps freshness ≥ threshold
        ├─ Creates a Booking, decrements mill slot capacity
        └─ If freshness ≥ 85 at assignment → Wallet: +30 points
        │
        ▼
 Farmer sees the Yield Estimate (expected kg × today's price vs govt minimum)
        │
        ▼
 Meanwhile: Advisory Engine pulls live weather → fertilizer + irrigation advice
        │
        ▼
 Farmer files a Subsidy Claim (planting material / drip irrigation / intercropping)
        └─ Wallet: +20 points on filing, +50 on disbursement
        │
        ▼
 Admin panel verifies → disburses → Wallet credited
```

---

##  Getting It Running Locally

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or Atlas)
- A [Groq API key](https://console.groq.com) (free tier works) — powers the chatbot
- An [OpenWeatherMap API key](https://openweathermap.org/api) (free tier works) — powers the advisory engine

### 1. Backend

```bash
cd palmsathi-backend
npm install
```

Create a `.env` file in `palmsathi-backend/`:

```dotenv
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_ORIGIN=http://localhost:5173

# Matching engine tuning knobs — safe to tweak, great for demos
MIN_FRESHNESS_THRESHOLD=70
DECAY_RATE_WEIGHT=1.5
TRAVEL_WEIGHT=0.5

JWT_SECRET=some_long_random_string
OPENWEATHER_API_KEY=your_openweather_key
GROQ_API_KEY=your_groq_key
ADMIN_SECRET=choose_a_strong_admin_password
```

```bash
npm run seed   # populates demo mills with slots
npm run dev    # starts on http://localhost:5000
```

Health check: `GET http://localhost:5000/health`

### 2. Frontend

```bash
cd palmsathi-frontend
npm install
```

Create a `.env` file in `palmsathi-frontend/`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev    # starts on http://localhost:5173
```

---

##  Walkthrough: Using the App as a Farmer

This is the "click through it yourself" tour.

### 1️⃣ Land on the homepage
Visit the app — you'll see the **Landing page** with a live-animated freshness decay bar showing exactly why speed matters (quality dropping from green → yellow → red as hours pass).

### 2️⃣ Register
Click **Register**. Fill in name, phone number, village, district, state. No password — this app uses **phone + OTP** login, like most farmer-facing apps in India.

### 3️⃣ Log in
Go to **Login**, enter your phone number, hit **Send OTP**.
> 🔧 *Demo mode note:* the OTP is returned directly in the API response (not actually SMS'd) so you can log in without a real phone gateway. Look for it on-screen or in your Network tab.

Enter the 4-digit OTP → you're in. A JWT is issued and stored client-side for the next 7 days.

### 4️⃣ Add a Plot
On the **Dashboard**, click **Add Plot**. Enter:
- Location (lat/lng)
- Area (hectares)
- Palm count
- Planting year
- Soil type

The app immediately calculates the plot's **age** and becomes eligible for ripeness predictions.

### 5️⃣ Check Ripeness
Each Plot Card can show its **ripeness window** — a prediction of when the next harvest should happen, based on age, last harvest date, and season. Use this to plan *before* you cut anything.

### 6️⃣ Mark a Harvest
Click **Mark Harvested** on a plot, enter the quantity (kg). This:
- Creates a **Harvest Batch** with status `pending`
- Starts its **freshness clock** ticking (100 → 0 over ~48 hours)
- Awards you **+50 wallet points**

### 7️⃣ Run the Matching Engine
Hit **Run Matching** on the dashboard. Watch the magic:
- Every pending batch gets ranked by urgency (how fast it's decaying + how far the nearest mill is)
- The engine finds the earliest mill slot that (a) has capacity and (b) keeps freshness above the safety threshold on arrival
- A **Booking** is created and the mill's slot capacity is decremented
- If your batch was assigned while still ≥85% fresh, **+30 more points**
- Anything that couldn't be safely matched shows up as `unassigned_emergency` — a clear signal to act fast

All connected clients see this happen live via **Socket.IO** — no refresh needed.

### 8️⃣ Check the Yield Estimator
Pick a plot + a mill → see:
- Expected total FFB output (kg) this round
- What the mill's today's price would pay you
- What the government's minimum guaranteed price would pay you
- Which one wins

### 9️⃣ Get Agronomy Advice
Open the **Advisory** tab for a plot. The app fetches **live weather** for your plot's coordinates and generates:
- Growth-stage-specific fertilizer schedule (immature / young-bearing / mature-bearing)
- Irrigation advice adjusted for current rain, heat, and humidity
- Any urgent alerts (e.g., heat stress, over-watering risk)

### 🔟 File a Subsidy Claim
Under **Subsidy Tracker**, choose a scheme:
- Planting Material Subsidy (up to ₹15,000)
- Drip Irrigation Subsidy (up to ₹50,000)
- Intercropping Support Subsidy (up to ₹10,000)

Submit a claim → it starts as `applied`, moves to `verified`, then `disbursed` (handled by an admin). Filing earns points; disbursement earns more.

### 1️⃣1️⃣ Check your Wallet
The **Incentive Wallet** shows your total points and a full transaction history — every action that earned (or redeemed) points, with a reason logged for each.

### 1️⃣2️⃣ Talk to the Chatbot
The **Hinglish Chatbot** (bottom corner) answers farming questions conversationally — in the mixed Hindi-English way many farmers actually speak — streamed token-by-token in real time.

### 🔐 Admin Panel
Navigate to `/admin`, enter the admin password, and you get a claims dashboard: filter by status, and advance claims through `applied → verified → disbursed` with one click. This is the "government office" side of the subsidy workflow.

---

##  API Overview

All routes are prefixed with `/api`. Routes marked 🔒 require a JWT (`Authorization: Bearer <token>`).

| Resource | Endpoint | What it does |
|---|---|---|
| Auth | `POST /auth/register` | Create a farmer account |
| Auth | `POST /auth/send-otp` | Request login OTP |
| Auth | `POST /auth/verify-otp` | Verify OTP → get JWT |
| Auth | 🔒 `GET /auth/profile` | Get logged-in farmer |
| Plots | `POST /plots` | Create a plot |
| Plots | `GET /plots?farmerId=` | List a farmer's plots |
| Plots | `GET /plots/:id/ripeness` | Get ripeness prediction |
| Mills | `GET /mills` | List all mills |
| Mills | `GET /mills/:id/slots` | Get a mill's booking slots |
| Harvest | 🔒 `POST /harvest` | Mark a plot as harvested |
| Harvest | 🔒 `GET /harvest/pending` | List pending batches w/ live freshness |
| Bookings | 🔒 `POST /bookings/run-matching` | Trigger the matching engine |
| Bookings | 🔒 `GET /bookings` | List your bookings |
| Advisory | 🔒 `GET /advisory/:plotId` | Get fresh agronomy advice |
| Advisory | 🔒 `GET /advisory/:plotId/history` | Last 5 advisories |
| Yield | 🔒 `GET /yield/estimate?plotId=&millId=&season=` | Projected yield + payout |
| Subsidy | 🔒 `POST /subsidy` | File a claim |
| Subsidy | 🔒 `GET /subsidy/my-claims` | List your claims |
| Wallet | 🔒 `GET /wallet` | Get points balance + history |
| Wallet | 🔒 `POST /wallet/redeem` | Redeem points |
| Chat | 🔒 `POST /chat` | Streamed AI chatbot response (SSE) |
| Admin | `GET /admin/claims?secret=` | All subsidy claims |
| Admin | `POST /admin/refresh-slots` | Force-refresh today's mill slots |

---

##  Things Worth Knowing Before You Deploy

- **OTP is returned in the API response** for demo purposes — before any real-world use, wire this to an actual SMS/WhatsApp gateway and stop returning the code in the response body.
- **The Admin panel's password check happens client-side** in `Admin.jsx`, with the real check re-validated server-side via `ADMIN_SECRET`. Treat the admin secret like any other production credential — keep it out of version control and rotate it if it's ever been committed.
- The frontend's Admin page currently points at a hardcoded `http://localhost:5000/api` — swap this to use `import.meta.env.VITE_API_URL` like the rest of the app before deploying, or the admin panel will only work locally.
- **Cron jobs** (freshness ticking, daily slot refresh) only run while the backend process is alive — on free-tier hosts that spin down when idle (like Render's free plan), these won't fire during downtime.

---

<div align="center">

### 🌴 Built for the people who grow the fruit that ends up in half of everything on a supermarket shelf.

</div>