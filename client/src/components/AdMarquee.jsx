import { useMemo } from "react";
import { useAds } from "../hooks/useAds";
import AdMedia from "./AdMedia";

function MarqueeItem({ ad }) {
  return (
    <a
      href={ad.link}
      target="_blank"
      rel="noreferrer"
      className="mx-2 flex w-[min(88vw,300px)] shrink-0 items-center gap-3 rounded-2xl border border-rose/25 bg-white/95 p-3 shadow-md transition hover:shadow-lg active:scale-[0.98]"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-beige">
        <AdMedia ad={ad} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-roseDark">Sponsored</p>
        <h3 className="truncate text-sm font-semibold text-ink">{ad.title}</h3>
        {ad.description && <p className="mt-0.5 line-clamp-2 text-xs text-inkLight">{ad.description}</p>}
      </div>
    </a>
  );
}

export default function AdMarquee() {
  const { ads, loading, hasAds } = useAds({ excludeSlot: "send" });

  const track = useMemo(() => {
    if (!ads.length) return [];
    return [...ads, ...ads];
  }, [ads]);

  const durationSec = Math.max(28, ads.length * 14);

  if (loading || !hasAds) return null;

  return (
    <section
      className="fixed inset-x-0 bottom-10 z-20 md:static md:bottom-auto md:mt-10 md:mb-2"
      aria-label="Featured partners"
    >
      <div className="border-t border-rose/30 bg-white/85 backdrop-blur-md shadow-[0_-4px_24px_rgba(67,53,69,0.08)] md:rounded-2xl md:border md:shadow-md">
        <p className="px-3 pt-2 text-center text-[10px] uppercase tracking-widest text-inkLight">Featured partners</p>
        <div className="ad-marquee-mask overflow-hidden py-3">
          <div
            className="ad-marquee-track flex w-max"
            style={{ animationDuration: `${durationSec}s` }}
          >
            {track.map((ad, idx) => (
              <MarqueeItem key={`${ad._id}-${idx}`} ad={ad} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
