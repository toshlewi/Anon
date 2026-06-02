import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { ensureDefaultCardsForUser } from "../utils/defaultCards.js";
import { syncAdminRole } from "../utils/adminAccess.js";

const router = express.Router();
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "7d",
  });

router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, profilePhoto } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: "Username must be 3-20 characters (letters, numbers, underscore)." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }
    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });
    if (existing) return res.status(409).json({ message: "Email or username already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      profilePhoto: profilePhoto || "",
    });
    await ensureDefaultCardsForUser(user);
    await syncAdminRole(user);
    const safeUser = await User.findById(user._id).select("-passwordHash");
    return res.status(201).json({ token: signToken(safeUser), user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: "Could not register", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ message: "Identifier and password are required." });
  const user = await User.findOne({
    $or: [{ email: identifier?.toLowerCase() }, { username: identifier?.toLowerCase() }],
  });
  if (!user || !user.passwordHash) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  await syncAdminRole(user);
  const safeUser = await User.findById(user._id).select("-passwordHash");
  return res.json({ token: signToken(safeUser), user: safeUser });
});

router.post("/google", async (req, res) => {
  const { email, name, googleId, photo } = req.body;
  if (!email || !googleId) return res.status(400).json({ message: "Invalid Google payload" });

  let user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const safeName = (name || email.split("@")[0]).trim();
    const seed = Math.floor(Math.random() * 9999);
    user = await User.create({
      name: safeName,
      username: `${safeName.replace(/\s+/g, "").toLowerCase()}${seed}`,
      email: email.toLowerCase(),
      googleId,
      profilePhoto: photo || "",
    });
    await ensureDefaultCardsForUser(user);
  }
  await syncAdminRole(user);
  const safeUser = await User.findById(user._id).select("-passwordHash");
  return res.json({ token: signToken(safeUser), user: safeUser });
});

router.get("/me", requireAuth, async (req, res) => {
  let user = await User.findById(req.user.id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });
  await syncAdminRole(user);
  user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
});

export default router;
