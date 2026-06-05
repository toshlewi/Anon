export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

export function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function validateUsername(username) {
  const value = String(username || "").trim();
  if (!USERNAME_REGEX.test(value)) {
    return "Username must be 3–20 characters (letters, numbers, underscore only).";
  }
  return null;
}

export function validateEmail(email) {
  const value = normalizeEmail(email);
  if (!value) return "Email is required.";
  if (!EMAIL_REGEX.test(value)) return "Enter a valid email address.";
  if (value.length > 254) return "Email is too long.";
  return null;
}

export function validatePassword(password) {
  const value = String(password || "");
  if (value.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters.`;
  }
  if (value.length > PASSWORD_MAX) {
    return `Password must be at most ${PASSWORD_MAX} characters.`;
  }
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}

export function duplicateKeyMessage(error) {
  const field = Object.keys(error?.keyPattern || error?.keyValue || {})[0];
  if (field === "username") return { message: "Username is already taken.", field: "username" };
  if (field === "email") return { message: "Email is already registered.", field: "email" };
  return { message: "Account already exists.", field: null };
}

export function isDuplicateKeyError(error) {
  return error?.code === 11000;
}
