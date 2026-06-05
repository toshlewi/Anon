import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { ensureDefaultCardsForUser } from "../utils/defaultCards.js";
import { syncAdminRole } from "../utils/adminAccess.js";
import { getJwtSecret } from "../utils/jwt.js";
import { serverError } from "../utils/errors.js";
import {
  duplicateKeyMessage,
  isDuplicateKeyError,
  normalizeEmail,
  normalizeUsername,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/validation.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please wait and try again." },
});

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, username: user.username }, getJwtSecret(), {
    expiresIn: "7d",
  });

router.get("/check-username", async (req, res) => {
  const username = normalizeUsername(req.query.username);
  const usernameError = validateUsername(username);
  if (usernameError) {
    return res.json({ available: false, message: usernameError });
  }
  const taken = await User.exists({ username });
  return res.json({
    available: !taken,
    message: taken ? "Username is already taken." : "Username is available.",
  });
});

router.get("/check-email", async (req, res) => {
  const email = normalizeEmail(req.query.email);
  const emailError = validateEmail(email);
  if (emailError) {
    return res.json({ available: false, message: emailError });
  }
  const taken = await User.exists({ email });
  return res.json({
    available: !taken,
    message: taken ? "Email is already registered." : "Email is available.",
  });
});

router.post("/register", authLimiter, async (req, res) => {
  try {
    const { name, username, email, password, profilePhoto } = req.body;
    const trimmedName = String(name || "").trim();

    if (!trimmedName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (trimmedName.length > 80) {
      return res.status(400).json({ message: "Name is too long (max 80 characters)." });
    }

    const usernameError = validateUsername(username);
    if (usernameError) return res.status(400).json({ message: usernameError, field: "username" });

    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ message: emailError, field: "email" });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ message: passwordError, field: "password" });

    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = normalizeEmail(email);

    const [emailTaken, usernameTaken] = await Promise.all([
      User.exists({ email: normalizedEmail }),
      User.exists({ username: normalizedUsername }),
    ]);

    if (emailTaken) {
      return res.status(409).json({ message: "Email is already registered.", field: "email" });
    }
    if (usernameTaken) {
      return res.status(409).json({ message: "Username is already taken.", field: "username" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: trimmedName,
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      profilePhoto: profilePhoto || "",
    });
    await ensureDefaultCardsForUser(user);
    await syncAdminRole(user);
    const safeUser = await User.findById(user._id).select("-passwordHash");
    return res.status(201).json({ token: signToken(safeUser), user: safeUser });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      const dup = duplicateKeyMessage(error);
      return res.status(409).json(dup);
    }
    return serverError(res, 500, "Could not register", error);
  }
});

router.post("/login", authLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Email/username and password are required." });
    }
    if (String(password).length > 128) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const normalized = String(identifier).trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: normalized }, { username: normalized }],
    });
    if (!user || !user.passwordHash) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    await syncAdminRole(user);
    const safeUser = await User.findById(user._id).select("-passwordHash");
    return res.json({ token: signToken(safeUser), user: safeUser });
  } catch (error) {
    return serverError(res, 500, "Could not log in", error);
  }
});

router.get("/me", requireAuth, async (req, res) => {
  let user = await User.findById(req.user.id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });
  await syncAdminRole(user);
  user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
});

export default router;
