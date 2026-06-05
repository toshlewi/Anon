import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

const globalCache = globalThis;

if (!globalCache.__anonDb) {
  globalCache.__anonDb = { promise: null };
}

const cache = globalCache.__anonDb;

export function getMongoUri() {
  return (process.env.MONGO_URI || "").trim();
}

export async function dbConnect() {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error("MONGO_URI environment variable is required");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 1,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 20000,
        socketTimeoutMS: 45000,
      })
      .then(() => mongoose.connection)
      .catch((error) => {
        cache.promise = null;
        throw error;
      });
  }

  const connection = await cache.promise;

  if (connection.readyState !== 1) {
    cache.promise = null;
    throw new Error(`MongoDB not connected (readyState ${connection.readyState})`);
  }

  return connection;
}

export async function dbPing() {
  const connection = await dbConnect();
  await connection.db.admin().ping();
  return connection;
}
