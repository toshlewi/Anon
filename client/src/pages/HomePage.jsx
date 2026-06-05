import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdMarquee from "../components/AdMarquee";
import Logo from "../components/Logo";

export default function HomePage() {
  const [activeCard, setActiveCard] = useState(0);
  const sampleCards = [
    { category: "Love Stories", text: "You inspire people more than you think. Keep going.", color: "#E34B6F" },
    { category: "Dirty Secrets", text: "I have had a huge crush on you for months.", color: "#8B1E3F" },
    { category: "Dark Humor", text: "My sense of humor is darker than my coffee.", color: "#141414" },
    { category: "Anonymous Support", text: "You are doing better than you believe right now.", color: "#5A6473" },
    { category: "Deep Thoughts", text: "Silence often says what words cannot carry.", color: "#3B5BA9" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % sampleCards.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [sampleCards.length]);

  return (
    <main className="w-full pb-40">
      <section className="relative flex min-h-[calc(100vh-9rem)] items-center overflow-hidden px-4 py-6 md:px-8 lg:px-12 lg:py-10">
        <div className="absolute -top-10 left-[45%] h-44 w-44 rounded-full bg-skywarm/40 blur-2xl float-soft" />
        <div className="absolute bottom-6 -left-10 h-36 w-36 rounded-full bg-roseSoft/40 blur-2xl float-soft" />
        <div className="absolute top-[30%] right-[8%] h-24 w-24 rounded-full bg-white/40 blur-xl float-soft" />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-[11px] uppercase tracking-wider text-ink/80 sm:px-4 sm:text-xs">
              <Logo size="xs" animation="bounce" />
              Ask anything. Stay anonymous.
            </span>
            <h1 className="mt-4 font-title text-[2rem] font-extrabold leading-[1.06] tracking-tight text-ink sm:text-5xl md:text-6xl xl:text-7xl">
              Share what you cannot say out loud.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-inkLight sm:mt-5 sm:text-lg md:text-xl">
              Receive honest thoughts, encouragement, and support from your community — completely anonymous.
            </p>
            <p className="mt-2 max-w-2xl text-sm text-ink/85 sm:text-base md:text-lg">
              Anonymous messages. Real connections. A safe place for honest conversations.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link to="/auth" className="btn-primary w-full sm:w-auto">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                </svg>
                Send a message
              </Link>
              <Link to="/auth?mode=register" className="btn-secondary w-full font-card text-xl sm:w-auto sm:text-2xl">
                Create account
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              <span className="rounded-full border border-roseSoft/40 bg-white/65 px-3 py-1 text-[11px] sm:text-xs">
                No sender identity
              </span>
              <span className="rounded-full border border-roseSoft/40 bg-white/65 px-3 py-1 text-[11px] sm:text-xs">
                Shareable message cards
              </span>
              <span className="rounded-full border border-roseSoft/40 bg-white/65 px-3 py-1 text-[11px] sm:text-xs">
                Built by Tosh Developers
              </span>
            </div>
          </div>

          <div className="relative mx-auto h-[320px] w-full max-w-md sm:h-[420px] lg:mx-0 lg:h-[520px] lg:max-w-none">
            <div className="absolute inset-0 rounded-3xl border border-white/30 bg-white/20 blur-sm" />
            <div className="absolute inset-2 overflow-hidden rounded-2xl p-3 md:p-5">
              {sampleCards.map((item, idx) => (
                <article
                  key={item.category}
                  className={`absolute inset-3 rounded-3xl border border-white/45 p-5 text-white shadow-2xl transition-all duration-1000 ease-out md:inset-6 md:p-9 ${
                    idx === activeCard
                      ? "scale-100 translate-y-0 opacity-100"
                      : "pointer-events-none scale-95 translate-y-6 opacity-0"
                  }`}
                  style={{ backgroundColor: item.color }}
                >
                  <p className="text-[10px] uppercase tracking-wider text-white/90 sm:text-xs">{item.category}</p>
                  <p className="mt-2 font-card text-3xl leading-tight sm:mt-3 sm:text-4xl md:text-5xl">{item.text}</p>
                  <p className="mt-3 text-[10px] text-white/85 sm:text-xs">Built by Tosh Developers</p>
                </article>
              ))}
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                {sampleCards.map((item, idx) => (
                  <span
                    key={item.category}
                    className={`h-2 w-2 rounded-full transition sm:h-2.5 sm:w-2.5 ${idx === activeCard ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdMarquee fixed />
    </main>
  );
}
