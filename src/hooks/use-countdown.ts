import { useEffect, useState } from "react";

const KEY = "promo-deadline";
const DURATION_MS = 2 * 60 * 60 * 1000;

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + DURATION_MS;
  const stored = window.localStorage.getItem(KEY);
  const parsed = stored ? parseInt(stored, 10) : 0;
  if (parsed && parsed > Date.now()) return parsed;
  const next = Date.now() + DURATION_MS;
  window.localStorage.setItem(KEY, String(next));
  return next;
}

export function useCountdown(): string {
  const [remaining, setRemaining] = useState(DURATION_MS);

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        const next = Date.now() + DURATION_MS;
        window.localStorage.setItem(KEY, String(next));
        setRemaining(DURATION_MS);
      } else {
        setRemaining(diff);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const total = Math.max(0, Math.floor(remaining / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
