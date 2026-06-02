import { useCallback, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import AdMedia from "./AdMedia";

const SHOW_EVERY_MS = 14000;
const VISIBLE_MS = 10000;
const FIRST_SHOW_MS = 4000;

export default function SendPageAdPopup({ ads = [] }) {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const dismiss = useCallback(() => setVisible(false), []);

  const showNext = useCallback(() => {
    if (!ads.length) return;
    setIndex((prev) => (prev + 1) % ads.length);
    setVisible(true);
  }, [ads.length]);

  useEffect(() => {
    if (!ads.length) return undefined;

    const first = setTimeout(showNext, FIRST_SHOW_MS);
    const interval = setInterval(showNext, SHOW_EVERY_MS);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [ads, showNext]);

  useEffect(() => {
    if (!visible) return undefined;
    const hide = setTimeout(dismiss, VISIBLE_MS);
    return () => clearTimeout(hide);
  }, [visible, index, dismiss]);

  if (!ads.length || !visible) return null;

  const ad = ads[index];

  return (
    <>
      <button
        type="button"
        aria-label="Dismiss ad"
        className="fixed inset-0 z-40 bg-ink/10 md:bg-transparent md:pointer-events-none"
        onClick={dismiss}
      />
      <aside
        className="ad-popup-slide fixed z-50 right-2 bottom-[4.5rem] w-[min(calc(100vw-1rem),17.5rem)] sm:right-4 sm:bottom-20 sm:w-72 touch-manipulation"
        role="dialog"
        aria-label="Partner offer"
      >
        <div className="rounded-2xl border border-rose/30 bg-white shadow-xl overflow-hidden">
          <div className="flex items-center justify-between bg-beige/80 px-3 py-1.5">
            <span className="text-[10px] uppercase tracking-wider text-inkLight">Partner</span>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-full p-1.5 text-ink/70 hover:bg-white hover:text-ink"
              aria-label="Close"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
          <a href={ad.link} target="_blank" rel="noreferrer" className="block p-3 active:bg-rose/5">
            <div className="overflow-hidden rounded-xl">
              <AdMedia ad={ad} className="h-24 w-full object-cover" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-ink leading-snug">{ad.title}</h3>
            {ad.description && (
              <p className="mt-1 text-xs text-inkLight line-clamp-2">{ad.description}</p>
            )}
            {ad.businessContact && (
              <p className="mt-1 text-[11px] text-ink/75">{ad.businessContact}</p>
            )}
            <span className="mt-2 inline-block text-xs font-medium text-roseDark">Tap to learn more →</span>
          </a>
        </div>
      </aside>
    </>
  );
}
