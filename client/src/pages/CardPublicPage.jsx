import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Logo from "../components/Logo";
import AdMarquee from "../components/AdMarquee";
import SuccessToast from "../components/SuccessToast";
import { useAds } from "../hooks/useAds";
import api from "../services/api";
import { resolveCardImage } from "../utils/cardIllustration";

export default function CardPublicPage() {
  const { linkKey } = useParams();
  const [card, setCard] = useState(null);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const { ads: sendAds } = useAds({ slot: "send" });

  const closeSuccess = useCallback(() => setSent(false), []);

  useEffect(() => {
    api.get(`/cards/link/${linkKey}`).then(({ data }) => setCard(data));
  }, [linkKey]);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post(`/cards/link/${linkKey}/messages`, { text });
      setText("");
      setSent(true);
    } catch {
      /* keep form text on error */
    } finally {
      setSending(false);
    }
  };

  if (!card) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16">
        <Logo size="xl" animation="bounce-spin" />
        <p className="mt-4 text-inkLight">Opening your link…</p>
      </main>
    );
  }

  const hasAds = sendAds.length > 0;

  return (
    <main className="relative mx-auto max-w-2xl px-4 py-8 pb-24 sm:py-12">
      <SuccessToast
        open={sent}
        onClose={closeSuccess}
        title="Successfully sent!"
        message="Your identity stays hidden. The card owner will see your anonymous reply."
      />

      <section
        className="rounded-2xl border border-white/70 p-5 shadow-md sm:p-6"
        style={{ backgroundColor: card.color }}
      >
        <img
          src={resolveCardImage(card)}
          alt={`${card.title} artwork`}
          className="h-36 w-full rounded-xl border border-white/40 object-cover sm:h-40"
        />
        <p className="text-2xl">{card.icon}</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: card.textColor || "#fff" }}>
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

      <form onSubmit={submit} className="relative z-10 mt-5 space-y-3 sm:mt-6">
        <textarea
          className="input min-h-36 resize-y text-base sm:min-h-40"
          placeholder="Write your anonymous answer..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit" disabled={sending} className="btn-primary w-full sm:w-auto disabled:opacity-70">
          {sending ? "Sending…" : "Send anonymously"}
        </button>
      </form>

      <section className="mb-4 mt-10 rounded-2xl border border-rose/25 bg-white/90 p-5 text-center shadow-sm">
        <p className="text-sm text-inkLight">Want to receive anonymous messages too?</p>
        <Link to="/auth?mode=register" className="btn-primary mt-3 w-full text-sm sm:w-auto">
          Create your own question cards →
        </Link>
        <p className="mt-2 text-xs text-inkLight">Free to join · Share links · Get honest anonymous replies</p>
      </section>

      {hasAds && (
        <div className="mt-8">
          <AdMarquee ads={sendAds} compact />
        </div>
      )}
    </main>
  );
}
