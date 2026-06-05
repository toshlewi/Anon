import "dotenv/config";
import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

const { default: app } = await import("../server/src/app.js");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not set. Add it in Vercel → Settings → Environment Variables.");
}

const globalCache = globalThis;

if (!globalCache.__anonMongoose) {
  globalCache.__anonMongoose = { conn: null, promise: null };
}

const cache = globalCache.__anonMongoose;

const mongooseOptions = {
  bufferCommands: false,
  maxPoolSize: 1,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  family: 4,
};

async function connectDatabase() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI environment variable is required");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cache.conn && mongoose.connection.readyState === 1) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGO_URI, mongooseOptions).then((instance) => {
      cache.conn = instance.connection || mongoose.connection;
      return cache.conn;
    });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    cache.promise = null;
    cache.conn = null;
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("API handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Database connection failed. Set MONGO_URI in Vercel and allow 0.0.0.0/0 in MongoDB Atlas Network Access.",
        error: error.message,
      });
    }
  }
}
