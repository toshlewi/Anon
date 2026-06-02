import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MessageCard from "../components/MessageCard";
import api from "../services/api";
import { resolveCardImage } from "../utils/cardIllustration";

export default function CardInboxPage() {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [messages, setMessages] = useState([]);
  const [copied, setCopied] = useState(false);

  const loadCardMessages = () => {
    api.get(`/cards/${cardId}/messages`).then(({ data }) => {
      setCard(data.card);
      setMessages(data.messages);
    });
  };

  useEffect(() => {
    loadCardMessages();
    const timer = setInterval(loadCardMessages, 7000);
    return () => clearInterval(timer);
  }, [cardId]);

  const copyLink = async () => {
    if (!card) return;
    await navigator.clipboard.writeText(`${window.location.origin}/c/${card.linkKey}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (!card) return <main className="mx-auto max-w-5xl px-4 py-10">Loading card...</main>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/dashboard" className="text-sm underline">
        Back to dashboard
      </Link>
      <section className="mt-3 rounded-2xl border border-white/60 p-5 shadow-md" style={{ backgroundColor: card.color }}>
        <img
          src={resolveCardImage(card)}
          alt={`${card.title} illustration`}
          className="h-44 w-full rounded-xl object-cover border border-white/40"
        />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl">{card.icon}</p>
            <h2 className="text-3xl font-bold mt-1" style={{ color: card.textColor || "#fff" }}>
              {card.title}
            </h2>
            <p className="mt-2 text-sm" style={{ color: card.textColor || "#fff" }}>
              {card.prompt}
            </p>
            <p className="mt-2 text-xs" style={{ color: card.textColor || "#fff" }}>
              {card.viewCount || 0} views • {card.replyCount || 0} replies
            </p>
          </div>
          <button onClick={copyLink} className="rounded-full bg-white px-4 py-2 text-sm transition hover:shadow hover:-translate-y-0.5">
            {copied ? "Link copied" : "Copy card link"}
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {messages.map((message) => (
          <MessageCard key={message._id} message={message} />
        ))}
      </section>
    </main>
  );
}
