import { useAds } from "../hooks/useAds";
import AdCard from "./AdCard";

/**
 * Renders ads for a placement. Pass `ad` to skip fetching (controlled mode).
 */
export default function AdSlot({
  slot,
  excludeSlot,
  limit = 3,
  pickRandom = false,
  variant = "grid",
  ad: controlledAd,
  ads: controlledAds,
  className = "",
  empty = null,
}) {
  const isControlled = controlledAds != null || controlledAd != null;
  const fetched = useAds({
    slot,
    excludeSlot,
    limit,
    pickRandom,
    enabled: !isControlled,
  });

  const ads = controlledAds ?? fetched.ads;
  const ad = controlledAd ?? fetched.ad;
  const loading = controlledAds || controlledAd ? false : fetched.loading;

  if (loading) return null;
  if (pickRandom || controlledAd) {
    if (!ad) return empty;
    return <AdCard ad={ad} variant={variant} className={className} />;
  }
  if (!ads.length) return empty;

  const gridCols =
    ads.length >= 3 ? "md:grid-cols-3" : ads.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1";

  return (
    <div className={variant === "grid" ? `grid gap-4 ${gridCols} ${className}` : className}>
      {ads.map((item) => (
        <AdCard key={item._id} ad={item} variant={variant} />
      ))}
    </div>
  );
}
