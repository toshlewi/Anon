import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = decoded;
    next();
  } catch (_err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message:
          "Forbidden. Your account needs admin access. Set ADMIN_EMAILS in server/.env to your email, then log out and log in again.",
      });
    }
    req.user = { ...req.user, role: user.role, username: user.username };
    next();
  } catch (_err) {
    res.status(500).json({ message: "Could not verify admin access." });
  }
};
