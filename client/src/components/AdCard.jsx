import AdMedia from "./AdMedia";

const variants = {
  send: {
    wrap: "ad-bubble-in mt-6 rounded-2xl border border-rose/25 bg-white/90 p-4 shadow-sm",
    media: "h-28 w-full rounded-xl object-cover transition group-hover:brightness-105",
    label: "Partner spotlight",
  },
  grid: {
    wrap: "rounded-2xl border border-rose/30 bg-white p-3 transition hover:-translate-y-1 hover:shadow-md block",
    media: "h-32 w-full rounded-xl object-cover",
    label: null,
  },
  compact: {
    wrap: "rounded-xl border border-rose/20 bg-white/80 p-3",
    media: "h-20 w-full rounded-lg object-cover",
    label: "Sponsored",
  },
};

export default function AdCard({ ad, variant = "grid", className = "" }) {
  if (!ad) return null;
  const v = variants[variant] || variants.grid;

  const inner = (
    <>
      {v.label && (
        <p className="text-[10px] uppercase tracking-widest text-inkLight mb-2">{v.label}</p>
      )}
      <AdMedia ad={ad} className={v.media} />
      <h3 className="mt-2 font-semibold text-ink group-hover:text-roseDark transition">{ad.title}</h3>
      {ad.description && <p className="mt-1 text-sm text-inkLight line-clamp-2">{ad.description}</p>}
      {ad.businessContact && <p className="mt-1 text-xs text-ink/80">Contact: {ad.businessContact}</p>}
    </>
  );

  if (variant === "send") {
    return (
      <aside className={`${v.wrap} ${className}`}>
        <a href={ad.link} target="_blank" rel="noreferrer" className="block group">
          {inner}
        </a>
      </aside>
    );
  }

  return (
    <a href={ad.link} target="_blank" rel="noreferrer" className={`${v.wrap} ${className} group`}>
      {inner}
    </a>
  );
}
