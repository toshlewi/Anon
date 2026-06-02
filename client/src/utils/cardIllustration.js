export const openSourceCardImages = {
  general: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
  love: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
  secrets: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  dark: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
  support: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  thoughts: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
};

const localToKey = {
  "/card-art/general.svg": "general",
  "/card-art/love.svg": "love",
  "/card-art/secrets.svg": "secrets",
  "/card-art/dark.svg": "dark",
  "/card-art/support.svg": "support",
  "/card-art/thoughts.svg": "thoughts",
};

export const resolveCardImage = (card) => {
  if (!card?.illustration) return openSourceCardImages.general;
  if (card.illustration.startsWith("http")) return card.illustration;
  const key = localToKey[card.illustration] || "general";
  return openSourceCardImages[key];
};

