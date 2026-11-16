"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

/**
 * Header'ın dış kabuğu. Ana sayfada lacivert hero üzerinde şeffaftır (data-hero),
 * kaydırınca lacivert zemine geçer. Diğer sayfalarda açık/koyu tema zemini kullanılır.
 * Yükseklik sabittir (--header-h), CLS üretmez.
 */
export function HeaderBar({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hero = pathname === "/";
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );

  return (
    <header
      data-hero={hero ? "true" : undefined}
      className={cn(
        "group/header sticky top-0 z-50 h-(--header-h) border-b transition-colors duration-200",
        hero
          ? scrolled
            ? "border-navy-line bg-navy"
            : "border-transparent bg-transparent"
          : "border-border bg-background",
      )}
    >
      {children}
    </header>
  );
}
