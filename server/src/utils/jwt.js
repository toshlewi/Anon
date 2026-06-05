export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  if (!secret && isProd) {
    throw new Error("JWT_SECRET must be set in production");
  }
  return secret || "dev_secret";
}
