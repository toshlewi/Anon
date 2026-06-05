import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

const { default: app } = await import("../server/src/app.js");

const getMongoUri = () => (process.env.MONGO_URI || "").trim();

const globalCache = globalThis;

if (!globalCache.__anonMongoose) {
  globalCache.__anonMongoose = { promise: null };
}

const cache = globalCache.__anonMongoose;

const mongooseOptions = {
  bufferCommands: false,
  maxPoolSize: 1,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 20000,
  socketTimeoutMS: 45000,
};

async function connectDatabase() {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error("MONGO_URI environment variable is required");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, mongooseOptions).catch((error) => {
      cache.promise = null;
      throw error;
    });
  }

  await cache.promise;

  if (mongoose.connection.readyState !== 1) {
    cache.promise = null;
    throw new Error(`MongoDB not connected (readyState ${mongoose.connection.readyState})`);
  }

  return mongoose.connection;
}

export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("API handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message:
          "Database connection failed. In MongoDB Atlas: Network Access → Allow 0.0.0.0/0, then verify MONGO_URI in Vercel.",
        error: error.message,
        hint: "Open /api/health after redeploy to confirm database shows connected.",
      });
    }
  }
}
