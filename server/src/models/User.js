import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    profilePhoto: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bio: { type: String, default: "", maxlength: 500 },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
