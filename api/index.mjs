import "dotenv/config";
import mongoose from "mongoose";
import app from "../server/src/app.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/anon";

if (mongoose.connection.readyState === 0) {
  await mongoose.connect(MONGO_URI);
}

export default app;
