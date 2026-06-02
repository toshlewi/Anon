import "dotenv/config";
import mongoose from "mongoose";
import app from "../server/src/app.js";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not set. Add it in Vercel Project Settings → Environment Variables.");
}

const globalCache = globalThis;

if (!globalCache.__anonMongoose) {
  globalCache.__anonMongoose = { conn: null, promise: null };
}

const cache = globalCache.__anonMongoose;

async function connectDatabase() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI environment variable is required");
  }
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGO_URI, { bufferCommands: false })
      .then((mongooseInstance) => mongooseInstance);
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("API handler error:", error);
    res.status(500).json({
      message: "Server error. Check MONGO_URI and Vercel environment variables.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
