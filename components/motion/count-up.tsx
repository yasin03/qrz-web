"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

/**
 * Görünür olunca 0'dan hedef sayıya sayar (4.5). Sunucu HTML'inde ve hareket
 * azaltma açıkken son değer basılır; böylece JS'siz ve botlar için de doğru rakam görünür.
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        setCurrent(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {current.toLocaleString(locale === "tr" ? "tr-TR" : "en-US")}
      {suffix}
    </span>
  );
}
