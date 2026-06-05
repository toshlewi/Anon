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
import { dbConnect, dbPing, getMongoUri } from "./db.js";
import { getUploadsDir } from "./utils/uploadsDir.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.env.VERCEL ? process.cwd() : path.resolve(__dirname, "../../");

const productionUrl = process.env.CLIENT_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

const corsOrigins = [
  productionUrl,
  "https://anon-seven-eta.vercel.app",
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
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  try {
    await dbPing();
    res.json(
      isProd
        ? { status: "ok", database: "connected" }
        : {
            status: "ok",
            env: process.env.VERCEL ? "vercel" : "node",
            database: "connected",
            mongoConfigured: Boolean(getMongoUri()),
            url: productionUrl || null,
          },
    );
  } catch (error) {
    res.status(503).json(
      isProd
        ? { status: "degraded", database: "disconnected" }
        : {
            status: "degraded",
            env: process.env.VERCEL ? "vercel" : "node",
            database: "disconnected",
            mongoConfigured: Boolean(getMongoUri()),
            error: error.message,
            url: productionUrl || null,
          },
    );
  }
});

const requireDb = async (_req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (error) {
    res.status(503).json({
      message: "Database unavailable",
      error: error.message,
      mongoConfigured: Boolean(getMongoUri()),
    });
  }
};

app.use("/api/auth", requireDb, authRoutes);
app.use("/api/messages", requireDb, messageRoutes);
app.use("/api/users", requireDb, userRoutes);
app.use("/api/admin", requireDb, adminRoutes);
app.use("/api/cards", requireDb, cardRoutes);

export default app;
