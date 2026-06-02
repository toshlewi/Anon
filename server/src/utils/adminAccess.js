import User from "../models/User.js";

const parseList = (value = "") =>
  value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

export function isAllowlistedAdmin({ email, username }) {
  const emails = parseList(process.env.ADMIN_EMAILS);
  const usernames = parseList(process.env.ADMIN_USERNAMES);
  if (email && emails.includes(email.toLowerCase())) return true;
  if (username && usernames.includes(username.toLowerCase())) return true;
  return false;
}

/** Promote user when allowlisted or when no admin exists yet (dev-friendly). */
export async function syncAdminRole(user) {
  if (!user) return user;
  if (user.role === "admin") return user;

  const allowlisted = isAllowlistedAdmin(user);
  const adminCount = await User.countDocuments({ role: "admin" });
  const promoteAsSoleAdmin = adminCount === 0 && process.env.FIRST_USER_AUTO_ADMIN !== "false";

  if (allowlisted || promoteAsSoleAdmin) {
    user.role = "admin";
    await user.save();
  }
  return user;
}
