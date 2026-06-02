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
    <main className="w-full px-4 py-6 pb-36 md:px-8 md:pb-10 lg:px-12 lg:py-10">
      <section className="relative overflow-hidden min-h-[calc(100vh-9rem)] flex items-center">
        <div className="absolute -top-10 left-[45%] h-44 w-44 rounded-full bg-skywarm/40 blur-2xl float-soft" />
        <div className="absolute bottom-6 -left-10 h-36 w-36 rounded-full bg-rose/40 blur-2xl float-soft" />
        <div className="absolute top-[30%] right-[8%] h-24 w-24 rounded-full bg-white/40 blur-xl float-soft" />

        <div className="relative z-10 grid w-full items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/65 px-4 py-1 text-xs uppercase tracking-wider text-ink/80 border border-white/80">
              <Logo size="xs" animation="bounce" />
              Ask anything. Stay anonymous.
            </span>
            <h1 className="mt-4 font-title font-extrabold tracking-tight text-4xl md:text-6xl xl:text-7xl text-ink leading-[1.04]">
              Share what you cannot say out loud.
            </h1>
            <p className="mt-5 max-w-2xl text-inkLight text-base md:text-xl">
              Receive honest thoughts, encouragement, and support from your community - completely anonymous.
            </p>
            <p className="mt-3 max-w-2xl text-ink/85 text-sm md:text-lg">
              Anonymous messages. Real connections. A safe place for honest conversations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="rounded-full bg-rose text-white px-6 py-3 inline-flex items-center gap-2 transition hover:scale-[1.03] hover:bg-roseDark shadow-md"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                </svg>
                Send a message
              </Link>
              <Link
                to="/auth?mode=register"
                className="rounded-full bg-white/80 text-ink px-6 py-3 border border-rose/30 font-card text-2xl leading-none transition hover:scale-[1.03]"
              >
                Create account
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-rose/30 bg-white/60 px-3 py-1 text-xs">No sender identity</span>
              <span className="rounded-full border border-rose/30 bg-white/60 px-3 py-1 text-xs">Shareable message cards</span>
              <span className="rounded-full border border-rose/30 bg-white/60 px-3 py-1 text-xs">Built by Tosh Developers</span>
            </div>
          </div>

          <div className="relative h-[430px] md:h-[520px]">
            <div className="absolute inset-0 rounded-3xl bg-white/20 blur-sm border border-white/30" />
            <div className="absolute inset-2 overflow-hidden rounded-2xl p-3 md:p-5">
              {sampleCards.map((item, idx) => (
                <article
                  key={item.category}
                  className={`absolute inset-3 md:inset-6 rounded-3xl border border-white/45 p-6 md:p-9 text-white shadow-2xl transition-all duration-1000 ease-out ${
                    idx === activeCard ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95 pointer-events-none"
                  }`}
                  style={{ backgroundColor: item.color }}
                >
                  <p className="text-xs uppercase tracking-wider text-white/90">{item.category}</p>
                  <p className="mt-3 font-card text-4xl md:text-5xl leading-tight">{item.text}</p>
                  <p className="mt-4 text-xs text-white/85">Built by Tosh Developers</p>
                </article>
              ))}
              <div className="absolute left-0 right-0 bottom-4 flex justify-center gap-2">
                {sampleCards.map((item, idx) => (
                  <span
                    key={item.category}
                    className={`h-2.5 w-2.5 rounded-full transition ${idx === activeCard ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdMarquee />
    </main>
  );
}
