import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { resolveCardImage } from "../utils/cardIllustration";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [copiedId, setCopiedId] = useState("");

  const loadCards = () => api.get("/cards/mine").then(({ data }) => setCards(data));

  useEffect(() => {
    loadCards();
    const timer = setInterval(loadCards, 10000);
    return () => clearInterval(timer);
  }, []);

  const copyLink = async (card) => {
    const link = `${window.location.origin}/c/${card.linkKey}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(card._id);
    setTimeout(() => setCopiedId(""), 1300);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="font-title text-4xl">Your Question Dashboard</h2>
      <p className="mt-2 text-inkLight">Only your category cards live here. Click any card to open its answers.</p>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card._id}
            onClick={() => navigate(`/dashboard/cards/${card._id}`)}
            className="rounded-2xl p-5 border border-white/50 shadow-md bg-cover bg-center cursor-pointer transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ backgroundColor: card.color, color: "#fff" }}
          >
            <img src={resolveCardImage(card)} alt={card.title} className="h-24 w-full rounded-xl object-cover border border-white/40" loading="lazy" />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-xs opacity-90">{card.replyCount || 0} replies</span>
            </div>
            <h3 className="mt-3 text-2xl font-bold">{card.title}</h3>
            <p className="mt-2 text-sm opacity-90">{card.prompt}</p>
            <p className="mt-1 text-xs opacity-85">Sending to @{card.linkKey.split("-")[0]}</p>
            <p className="mt-1 text-xs opacity-80">{card.viewCount || 0} views</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyLink(card);
                }}
                className="rounded-full bg-white/85 px-3 py-1 text-xs text-black transition hover:bg-roseDark hover:text-white hover:shadow-lg"
              >
                {copiedId === card._id ? "Copied" : "Copy Link"}
              </button>
              <Link
                to={`/dashboard/cards/${card._id}`}
                onClick={(e) => e.stopPropagation()}
                className="rounded-full bg-black/65 px-3 py-1 text-xs text-white transition hover:bg-white hover:text-black hover:shadow-lg"
              >
                Open Answers
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
