export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export function validateUsername(username) {
  const value = String(username || "").trim();
  if (!USERNAME_REGEX.test(value)) {
    return "Username must be 3–20 characters (letters, numbers, underscore only).";
  }
  return null;
}

export function validatePassword(password) {
  const value = String(password || "");
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (value.length > 128) return "Password must be at most 128 characters.";
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}
