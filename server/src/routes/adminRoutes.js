import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Ad from "../models/Ad.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = express.Router();
const uploadsDir = path.resolve("server/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `ad-${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
    cb(null, ok);
  },
});

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

const fileUrl = (file) => (file ? `/uploads/${file.filename}` : "");

router.get("/ads", async (req, res) => {
  const filter = { active: true };
  if (req.query.slot) filter.slot = req.query.slot;
  const ads = await Ad.find(filter).sort({ createdAt: -1 });
  res.json(ads);
});

router.get("/ads/all", requireAuth, requireAdmin, async (_req, res) => {
  const ads = await Ad.find().sort({ createdAt: -1 });
  res.json(ads);
});

router.post("/ads", requireAuth, requireAdmin, uploadFields, async (req, res) => {
  try {
    const { title, link, mediaType, description, businessContact, slot, active } = req.body;
    if (!title?.trim() || !link?.trim()) {
      return res.status(400).json({ message: "Title and target link are required." });
    }

    const imageUrl = fileUrl(req.files?.image?.[0]) || req.body.imageUrl || "";
    const videoUrl = fileUrl(req.files?.video?.[0]) || req.body.videoUrl || "";
    const type = mediaType || "image";

    if (type === "video" && !videoUrl) {
      return res.status(400).json({ message: "Upload a video or provide a video URL." });
    }
    if (type === "image" && !imageUrl) {
      return res.status(400).json({ message: "Upload an image or provide an image URL." });
    }
    if (type === "poster" && !imageUrl && !videoUrl) {
      return res.status(400).json({ message: "Upload an image and/or video for the poster ad." });
    }

    const ad = await Ad.create({
      title: title.trim(),
      link: link.trim(),
      mediaType: type,
      imageUrl,
      videoUrl,
      posterUrl: imageUrl,
      description: description || "",
      businessContact: businessContact || "",
      slot: slot || "send",
      active: active !== "false",
    });

    res.status(201).json({ message: "Ad created successfully.", ad });
  } catch (error) {
    res.status(500).json({ message: "Could not create ad.", error: error.message });
  }
});

router.patch("/ads/:id", requireAuth, requireAdmin, uploadFields, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found." });

    const updates = {
      ...(req.body.title ? { title: req.body.title.trim() } : {}),
      ...(req.body.link ? { link: req.body.link.trim() } : {}),
      ...(req.body.mediaType ? { mediaType: req.body.mediaType } : {}),
      ...(req.body.description !== undefined ? { description: req.body.description } : {}),
      ...(req.body.businessContact !== undefined ? { businessContact: req.body.businessContact } : {}),
      ...(req.body.slot ? { slot: req.body.slot } : {}),
      ...(req.body.active !== undefined ? { active: req.body.active === "true" || req.body.active === true } : {}),
    };

    if (req.files?.image?.[0]) updates.imageUrl = fileUrl(req.files.image[0]);
    if (req.files?.video?.[0]) updates.videoUrl = fileUrl(req.files.video[0]);
    if (req.body.imageUrl) updates.imageUrl = req.body.imageUrl;
    if (req.body.videoUrl) updates.videoUrl = req.body.videoUrl;

    const updated = await Ad.findByIdAndUpdate(ad._id, updates, { new: true });
    res.json({ message: "Ad updated successfully.", ad: updated });
  } catch (error) {
    res.status(500).json({ message: "Could not update ad.", error: error.message });
  }
});

router.delete("/ads/:id", requireAuth, requireAdmin, async (req, res) => {
  const ad = await Ad.findByIdAndDelete(req.params.id);
  if (!ad) return res.status(404).json({ message: "Ad not found." });
  res.json({ message: "Ad deleted successfully." });
});

export default router;
