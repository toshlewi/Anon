const isProd = () => process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

export function serverError(res, status, message, error) {
  const body = { message };
  if (!isProd() && error?.message) {
    body.error = error.message;
  }
  return res.status(status).json(body);
}
