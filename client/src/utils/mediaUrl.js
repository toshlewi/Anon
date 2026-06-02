export const mediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};
