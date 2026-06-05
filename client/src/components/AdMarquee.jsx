import { useEffect, useMemo, useState } from "react";
import { useAds } from "../hooks/useAds";
import AdMedia from "./AdMedia";

const ROTATE_MS = 5500;

function AdSlide({ ad, compact }) {
  return (
    <a
      href={ad.link}
      target="_blank"
      rel="noreferrer"
      className={`ad-carousel-slide group flex w-full items-center gap-3 rounded-xl border border-rose/20 bg-gradient-to-br from-white via-white to-roseSoft/15 shadow-md transition hover:border-rose/40 hover:shadow-lg ${compact ? "px-3 py-2.5" : "px-4 py-3"}`}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl ring-2 ring-roseSoft/30 ${compact ? "h-10 w-10" : "h-11 w-11 sm:h-12 sm:w-12"}`}
      >
        <AdMedia ad={ad} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-rose">Sponsored</p>
        <h3 className={`truncate font-semibold text-ink group-hover:text-roseDark ${compact ? "text-sm" : "text-sm sm:text-base"}`}>
          {ad.title}
        </h3>
        {ad.description && (
          <p className={`line-clamp-1 text-inkLight ${compact ? "text-xs" : "text-xs sm:text-sm"}`}>{ad.description}</p>
        )}
      </div>
      <span className="hidden shrink-0 text-rose/70 transition group-hover:translate-x-0.5 group-hover:text-rose sm:inline">
        →
      </span>
    </a>
  );
}

export default function AdMarquee({
  slot,
  ads: externalAds,
  compact = false,
  fixed = false,
  className = "",
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const useInternal = externalAds == null;

  const { ads: fetchedAds, loading: fetchLoading } = useAds({
    slot,
    limit: 24,
    enabled: useInternal,
  });

  const ads = useMemo(() => {
    if (externalAds != null) return externalAds;
    if (slot) return fetchedAds;
    const forHome = fetchedAds.filter((ad) => ad.slot !== "send");
    return forHome.length ? forHome : fetchedAds;
  }, [externalAds, fetchedAds, slot]);

  useEffect(() => {
    setActiveIndex(0);
  }, [ads]);

  useEffect(() => {
    if (ads.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ads.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [ads]);

  const loading = useInternal && fetchLoading;
  const showCarousel = !loading && ads.length > 0;
  const ad = ads[activeIndex];

  if (loading) {
    return <div className="ad-marquee-shell h-[4.75rem] animate-pulse rounded-2xl" aria-hidden />;
  }

  if (!showCarousel || !ad) return null;

  const label = compact ? "Sponsored" : "Featured partners";

  const shell = (
    <section aria-label={label} className={`ad-marquee-shell w-full overflow-hidden rounded-2xl ${className}`}>
      <div className="relative border border-rose/25 bg-white/92 shadow-lg backdrop-blur-md">
        <div
          className={`flex items-center justify-center gap-2 border-b border-rose/15 bg-gradient-to-r from-roseSoft/25 via-white to-roseSoft/25 px-4 ${compact ? "py-1.5" : "py-2"}`}
        >
          <span className="ad-marquee-sparkle h-1.5 w-1.5 rounded-full bg-rose" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/70">{label}</p>
          <span className="ad-marquee-sparkle ad-marquee-sparkle-delay h-1.5 w-1.5 rounded-full bg-rose" />
        </div>

        <div className={`relative overflow-hidden ${compact ? "px-3 py-2.5" : "px-3 py-3 sm:px-4"}`}>
          <div className={`relative w-full ${compact ? "h-[3.75rem]" : "h-[4.25rem] sm:h-[4.5rem]"}`}>
            <AdSlide key={`${ad._id}-${activeIndex}`} ad={ad} compact={compact} />
          </div>

          {ads.length > 1 && (
            <div className="mt-2 flex items-center justify-center gap-1.5">
              {ads.map((item, idx) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? "w-4 bg-rose" : "w-1.5 bg-rose/30 hover:bg-rose/50"}`}
                  aria-label={`Show ad ${idx + 1} of ${ads.length}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  if (fixed) {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-11 z-40 px-3 sm:px-5 lg:px-8">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl">{shell}</div>
      </div>
    );
  }

  return shell;
}
