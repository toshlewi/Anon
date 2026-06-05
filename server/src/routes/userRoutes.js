import express from "express";
import multer from "multer";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { getUploadsDir } from "../utils/uploadsDir.js";
import { serverError } from "../utils/errors.js";
import {
  duplicateKeyMessage,
  isDuplicateKeyError,
  normalizeUsername,
  validateUsername,
} from "../utils/validation.js";

const router = express.Router();
const uploadsDir = getUploadsDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith("image/"));
  },
});

router.get("/:username/public", async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() }).select(
    "name username profilePhoto bio",
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const { name, bio, profilePhoto, username } = req.body;
    const updates = {};

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) return res.status(400).json({ message: "Name cannot be empty." });
      if (trimmed.length > 80) return res.status(400).json({ message: "Name is too long (max 80 characters)." });
      updates.name = trimmed;
    }
    if (bio !== undefined) {
      updates.bio = String(bio).slice(0, 500);
    }
    if (profilePhoto) {
      updates.profilePhoto = profilePhoto;
    }
    if (username !== undefined) {
      const usernameError = validateUsername(username);
      if (usernameError) return res.status(400).json({ message: usernameError, field: "username" });

      const normalized = normalizeUsername(username);
      const existing = await User.findOne({ username: normalized, _id: { $ne: req.user.id } });
      if (existing) {
        return res.status(409).json({ message: "Username is already taken.", field: "username" });
      }
      updates.username = normalized;
    }

    const updated = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select(
      "-passwordHash",
    );
    res.json(updated);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      const dup = duplicateKeyMessage(error);
      return res.status(409).json(dup);
    }
    return serverError(res, 500, "Could not update profile", error);
  }
});

router.post("/me/photo", requireAuth, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file is required." });
    const url = `/uploads/${req.file.filename}`;
    const updated = await User.findByIdAndUpdate(req.user.id, { profilePhoto: url }, { new: true }).select(
      "-passwordHash",
    );
    res.json(updated);
  } catch (error) {
    return serverError(res, 500, "Could not upload photo", error);
  }
});

export default router;
