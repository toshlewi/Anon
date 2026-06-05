export function getGoogleClientId() {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
}

export function isGoogleAuthEnabled() {
  const id = getGoogleClientId();
  if (!id) return false;
  if (id.includes("your_google") || id === "google-client-id") return false;
  return id.endsWith(".apps.googleusercontent.com");
}
