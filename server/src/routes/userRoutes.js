import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const uploadsDir = path.resolve("server/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
});
const upload = multer({ storage });
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

router.get("/:username/public", async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() }).select(
    "name username profilePhoto bio",
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.patch("/me", requireAuth, async (req, res) => {
  const { name, bio, profilePhoto, username } = req.body;
  const updates = {
    ...(name ? { name } : {}),
    ...(bio !== undefined ? { bio } : {}),
    ...(profilePhoto ? { profilePhoto } : {}),
  };
  if (username !== undefined) {
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: "Username must be 3-20 characters (letters, numbers, underscore)." });
    }
    const normalized = username.toLowerCase();
    const existing = await User.findOne({ username: normalized, _id: { $ne: req.user.id } });
    if (existing) return res.status(409).json({ message: "Username already in use." });
    updates.username = normalized;
  }
  const updated = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updates },
    { new: true },
  ).select("-passwordHash");
  res.json(updated);
});

router.post("/me/photo", requireAuth, upload.single("photo"), async (req, res) => {
  const url = `/uploads/${req.file.filename}`;
  const updated = await User.findByIdAndUpdate(req.user.id, { profilePhoto: url }, { new: true }).select("-passwordHash");
  res.json(updated);
});

export default router;
