import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/:username", async (req, res) => {
  const { username } = req.params;
  const { text, category, cardColor } = req.body;
  const receiver = await User.findOne({ username: username.toLowerCase() });
  if (!receiver) return res.status(404).json({ message: "Profile not found" });
  if (!text?.trim()) return res.status(400).json({ message: "Message is required" });

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
