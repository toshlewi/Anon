import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../components/Logo";
import SendPageAdPopup from "../components/SendPageAdPopup";
import { useAds } from "../hooks/useAds";
import api from "../services/api";
import { resolveCardImage } from "../utils/cardIllustration";

export default function CardPublicPage() {
  const { linkKey } = useParams();
  const [card, setCard] = useState(null);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const { ads: sendAds } = useAds({ slot: "send" });

  useEffect(() => {
    api.get(`/cards/link/${linkKey}`).then(({ data }) => setCard(data));
  }, [linkKey]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post(`/cards/link/${linkKey}/messages`, { text });
    setText("");
    setSent(true);
    setTimeout(() => setSent(false), 1800);
  };

  if (!card) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 flex flex-col items-center">
        <Logo size="xl" animation="bounce-spin" />
        <p className="mt-4 text-inkLight">Opening your link…</p>
      </main>
    );
  }

  return (
    <main className="relative mx-auto max-w-2xl px-4 py-8 pb-28 sm:py-12 sm:pb-32">
      <SendPageAdPopup ads={sendAds} />

      <section className="rounded-2xl p-5 sm:p-6 shadow-md border border-white/70" style={{ backgroundColor: card.color }}>
        <img
          src={resolveCardImage(card)}
          alt={`${card.title} artwork`}
          className="h-36 sm:h-40 w-full rounded-xl object-cover border border-white/40"
        />
        <p className="text-2xl">{card.icon}</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold" style={{ color: card.textColor || "#fff" }}>
          {card.title}
        </h1>
        <p className="mt-2 text-sm" style={{ color: card.textColor || "#fff" }}>
          {card.prompt}
        </p>
        <p className="mt-2 text-xs" style={{ color: card.textColor || "#fff" }}>
          Replying to @{card.owner?.username}
        </p>
        <p className="mt-1 text-xs" style={{ color: card.textColor || "#fff" }}>
          This link has been viewed {card.viewCount || 0} times
        </p>
      </section>

      <form onSubmit={submit} className="mt-5 sm:mt-6 space-y-3">
        <textarea
          className="input min-h-36 sm:min-h-40 text-base"
          placeholder="Write your anonymous answer..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full sm:w-auto rounded-full bg-ink px-6 py-3 text-white text-base font-medium active:scale-[0.98] transition"
        >
          Send anonymously
        </button>
        {sent && <p className="text-sm text-green-700">Sent. Your identity stays hidden.</p>}
      </form>
    </main>
  );
}
