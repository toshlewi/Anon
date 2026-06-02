import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/User.js";

const identifier = process.argv[2];
if (!identifier) {
  console.error("Usage: node server/scripts/make-admin.mjs <email-or-username>");
  process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/anon";
await mongoose.connect(MONGO_URI);

const user = await User.findOne({
  $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }],
});

if (!user) {
  console.error("No user found for:", identifier);
  process.exit(1);
}

user.role = "admin";
await user.save();
console.log(`✓ ${user.email} (@${user.username}) is now an admin. Log out and log in again.`);
await mongoose.disconnect();
