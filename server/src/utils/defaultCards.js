import QuestionCard from "../models/QuestionCard.js";

const openSource = {
  love: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
  secrets: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  dark: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
  support: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  thoughts: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
};

const templates = [
  {
    title: "Love Stories",
    slug: "love-stories",
    prompt: "Tell me your sweetest love story anonymously.",
    description: "Romantic confessions and heartwarming notes.",
    icon: "❤️",
    illustration: openSource.love,
    color: "#E34B6F",
    textColor: "#ffffff",
  },
  {
    title: "Dirty Secrets",
    slug: "dirty-secrets",
    prompt: "Drop your wildest dirty secret anonymously.",
    description: "Bold, spicy, and secret confessions.",
    icon: "🔥",
    illustration: openSource.secrets,
    color: "#8B1E3F",
    textColor: "#ffffff",
  },
  {
    title: "Dark Humor",
    slug: "dark-humor",
    prompt: "Send your darkest anonymous humor line.",
    description: "Savage jokes for brave people only.",
    icon: "🖤",
    illustration: openSource.dark,
    color: "#141414",
    textColor: "#ffffff",
  },
  {
    title: "Anonymous Support",
    slug: "anonymous-support",
    prompt: "Send me anonymous encouragement or advice.",
    description: "Safe support from your community.",
    icon: "🤝",
    illustration: openSource.support,
    color: "#5A6473",
    textColor: "#ffffff",
  },
  {
    title: "Deep Thoughts",
    slug: "deep-thoughts",
    prompt: "Share your deep thought that you cannot post publicly.",
    description: "Philosophy, reflection, and real feelings.",
    icon: "💭",
    illustration: openSource.thoughts,
    color: "#3B5BA9",
    textColor: "#ffffff",
  },
];

export const ensureDefaultCardsForUser = async (user) => {
  const count = await QuestionCard.countDocuments({ owner: user._id });
  if (count > 0) return;

  const cards = templates.map((template) => ({
    ...template,
    owner: user._id,
    linkKey: `${user.username}-${template.slug}`,
    isDefault: true,
  }));
  await QuestionCard.insertMany(cards);
};
