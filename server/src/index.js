import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";
import { getJwtSecret } from "./utils/jwt.js";

try {
  getJwtSecret();
} catch (error) {
  console.error(error.message);
  if (process.env.NODE_ENV === "production") process.exit(1);
}

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/anon";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect MongoDB", err);
    process.exit(1);
  });
