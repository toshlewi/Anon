import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import mongoose from "mongoose";
import { getUploadsDir } from "./utils/uploadsDir.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.env.VERCEL ? process.cwd() : path.resolve(__dirname, "../../");

const corsOrigins = [
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.VERCEL_BRANCH_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (corsOrigins.includes(origin)) return callback(null, true);
      try {
        const host = new URL(origin).hostname;
        if (host.endsWith(".vercel.app")) return callback(null, true);
      } catch {
        /* ignore invalid origin */
      }
      if (process.env.NODE_ENV !== "production") return callback(null, true);
      return callback(null, corsOrigins[0] || true);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(morgan(process.env.VERCEL ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  }),
);

app.use(
  "/assets",
  express.static(projectRoot, {
    maxAge: "7d",
  }),
);
app.use(
  "/uploads",
  express.static(getUploadsDir(), {
    maxAge: "7d",
  }),
);

app.get("/api/health", async (_req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbReady = mongoose.connection.readyState === 1;
  let dbPing = false;
  let dbError = null;

  if (dbReady) {
    try {
      await mongoose.connection.db.admin().ping();
      dbPing = true;
    } catch (error) {
      dbError = error.message;
    }
  }

  res.json({
    status: dbPing ? "ok" : "degraded",
    env: process.env.VERCEL ? "vercel" : "node",
    database: dbPing ? "connected" : "disconnected",
    mongoConfigured: Boolean((process.env.MONGO_URI || "").trim()),
    mongoState: states[mongoose.connection.readyState] || "unknown",
    ...(dbError ? { dbError } : {}),
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cards", cardRoutes);

export default app;
