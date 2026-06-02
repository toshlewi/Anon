import express from "express";
import { requireAuth } from "../middleware/auth.js";
import QuestionCard from "../models/QuestionCard.js";
import Message from "../models/Message.js";
import { ensureDefaultCardsForUser } from "../utils/defaultCards.js";
import User from "../models/User.js";

const router = express.Router();
const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 30);

const buildUniqueLinkKey = async (username, slug) => {
  const base = `${username}-${slug || "anon-card"}`;
  let candidate = base;
  let suffix = 1;
  while (await QuestionCard.exists({ linkKey: candidate })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
};

router.get("/mine", requireAuth, async (req, res) => {
  const owner = await User.findById(req.user.id).select("username");
  if (!owner) return res.status(404).json({ message: "User not found" });
  await ensureDefaultCardsForUser(owner);
  const cards = await QuestionCard.find({ owner: req.user.id }).sort({ createdAt: 1 }).lean();
  res.json(cards);
});

router.get("/:cardId/messages", requireAuth, async (req, res) => {
  const card = await QuestionCard.findById(req.params.cardId).lean();
  if (!card || String(card.owner) !== req.user.id) return res.status(404).json({ message: "Card not found" });
  const messages = await Message.find({ card: card._id }).sort({ createdAt: -1 }).lean();
  res.json({ card, messages });
});

router.post("/", requireAuth, async (req, res) => {
  const owner = await User.findById(req.user.id).select("username");
  if (!owner) return res.status(404).json({ message: "User not found" });
  const title = req.body.title?.trim();
  const prompt = req.body.prompt?.trim();
  if (!title || !prompt) return res.status(400).json({ message: "Title and prompt are required." });

  const slug = slugify(req.body.slug || title);
  const linkKey = await buildUniqueLinkKey(owner.username, slug);

  const card = await QuestionCard.create({
    owner: req.user.id,
    title,
    slug,
    prompt,
    description: req.body.description || "",
    icon: req.body.icon || "💬",
    illustration: req.body.illustration || "/card-art/general.svg",
    color: req.body.color || "#F3A6C9",
    textColor: req.body.textColor || "#ffffff",
    linkKey,
  });
  res.status(201).json(card);
});

router.patch("/:cardId", requireAuth, async (req, res) => {
  const card = await QuestionCard.findById(req.params.cardId);
  if (!card || String(card.owner) !== req.user.id) return res.status(404).json({ message: "Card not found" });

  const updates = {
    ...(req.body.title ? { title: req.body.title.trim() } : {}),
    ...(req.body.prompt ? { prompt: req.body.prompt.trim() } : {}),
    ...(req.body.description !== undefined ? { description: req.body.description } : {}),
    ...(req.body.icon ? { icon: req.body.icon } : {}),
    ...(req.body.illustration ? { illustration: req.body.illustration } : {}),
    ...(req.body.color ? { color: req.body.color } : {}),
    ...(req.body.textColor ? { textColor: req.body.textColor } : {}),
  };
  Object.assign(card, updates);
  await card.save();
  res.json(card);
});

router.delete("/:cardId", requireAuth, async (req, res) => {
  const card = await QuestionCard.findById(req.params.cardId);
  if (!card || String(card.owner) !== req.user.id) return res.status(404).json({ message: "Card not found" });
  await Message.deleteMany({ card: card._id });
  await card.deleteOne();
  res.json({ message: "Card deleted." });
});

router.get("/link/:linkKey", async (req, res) => {
  const cardDoc = await QuestionCard.findOne({ linkKey: req.params.linkKey }).populate("owner", "name username profilePhoto");
  if (!cardDoc) return res.status(404).json({ message: "Card not found" });
  cardDoc.viewCount += 1;
  await cardDoc.save();
  const card = cardDoc.toObject();
  if (!card) return res.status(404).json({ message: "Card not found" });
  res.json(card);
});

router.post("/link/:linkKey/messages", async (req, res) => {
  const card = await QuestionCard.findOne({ linkKey: req.params.linkKey });
  if (!card) return res.status(404).json({ message: "Card not found" });
  const text = req.body.text?.trim();
  if (!text) return res.status(400).json({ message: "Message is required." });

  await Message.create({
    receiver: card.owner,
    card: card._id,
    text,
    category: card.title,
    cardColor: card.color,
  });
  card.replyCount += 1;
  await card.save();
  res.status(201).json({ message: "Anonymous answer sent." });
});

export default router;
