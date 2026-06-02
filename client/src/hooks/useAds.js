import { useEffect, useState } from "react";
import api from "../services/api";

/**
 * Fetches active ads from the API.
 * @param {object} options
 * @param {string} [options.slot] - hero | sidebar | footer | send
 * @param {string} [options.excludeSlot] - omit ads in this slot (e.g. "send" on homepage)
 * @param {number} [options.limit]
 * @param {boolean} [options.pickRandom] - set single `ad` to a random item
 */
export function useAds({ slot, excludeSlot, limit, pickRandom = false, enabled = true } = {}) {
  const [ads, setAds] = useState([]);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const slotKey = slot || "";
  const excludeKey = excludeSlot || "";

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    const params = slot ? { slot } : {};

    api
      .get("/admin/ads", { params })
      .then(({ data }) => {
        if (cancelled) return;
        let list = Array.isArray(data) ? data : [];
        if (excludeSlot) list = list.filter((item) => item.slot !== excludeSlot);
        if (limit) list = list.slice(0, limit);

        setAds(list);
        if (pickRandom && list.length) {
          setAd(list[Math.floor(Math.random() * list.length)]);
        } else {
          setAd(list[0] || null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAds([]);
          setAd(null);
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slotKey, excludeKey, limit, pickRandom, enabled]);

  return { ads, ad, loading, error, hasAds: ads.length > 0 };
}
