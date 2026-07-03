import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { connectDB } from "./config/db.js";
import { setupSockets } from "./sockets/index.js";

import authRoutes from "./routes/authRoutes.js";
import plotRoutes from "./routes/plotRoutes.js";
import millRoutes from "./routes/millRoutes.js";
import harvestRoutes from "./routes/harvestRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", service: "palmsathi-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/plots", plotRoutes);
app.use("/api/mills", millRoutes);
app.use("/api/harvest", harvestRoutes);
app.use("/api/bookings", bookingRoutes);

const httpServer = http.createServer(app);
setupSockets(httpServer, app);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`[server] PalmSathi backend running on port ${PORT}`);
  });
});