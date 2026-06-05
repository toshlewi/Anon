import express from "express";
import rateLimit from "express-rate-limit";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const anonMessageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages. Please wait a moment." },
});

router.post("/:username", anonMessageLimiter, async (req, res) => {
  const { username } = req.params;
  const { text, category, cardColor } = req.body;
  const receiver = await User.findOne({ username: username.toLowerCase() });
  if (!receiver) return res.status(404).json({ message: "Profile not found" });
  if (!text?.trim()) return res.status(400).json({ message: "Message is required" });
  if (text.trim().length > 5000) return res.status(400).json({ message: "Message is too long (max 5000 characters)." });

  await Message.create({
    receiver: receiver._id,
    text: text.trim(),
    category: category || "General",
    cardColor: cardColor || "#F7D6E0",
  });
  res.status(201).json({ message: "Anonymous message sent" });
});

router.get("/mine", requireAuth, async (req, res) => {
  const messages = await Message.find({ receiver: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json(messages);
});

export default router;
