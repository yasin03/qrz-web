"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/*
 * Masaüstü menü (≥ 1024px). Yalnızca açma/kapama mantığı burada; menü içerikleri
 * Server Component olarak üretilip children ile gelir ve kapalıyken de DOM'da durur
 * (3.2: linkler ilk HTML'de). Kapalı panel `invisible` ile gizlenir, Tab sırasına girmez.
 *
 * Klavye: Tab ile tetikleyiciler arasında gezilir, Enter/Space açar-kapatır,
 * açık panelin linklerine Tab ile girilir, Esc kapatıp odağı tetikleyiciye döndürür,
 * odak menüden çıkınca panel kapanır.
 */

type NavContext = {
  openId: string | null;
  open: (id: string, via: "click" | "hover") => void;
  close: () => void;
  toggle: (id: string) => void;
  scheduleClose: () => void;
  cancelClose: () => void;
};

const DesktopNavContext = createContext<NavContext | null>(null);

function useDesktopNav() {
  const ctx = useContext(DesktopNavContext);
  if (!ctx) throw new Error("DesktopNavMenu, DesktopNav içinde kullanılmalı");
  return ctx;
}

export function DesktopNav({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoverOpenedAt = useRef(0);

  // Sayfa değişince menü kapanır
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpenId(null);
  }

  const cancelClose = useCallback(() => window.clearTimeout(closeTimer.current), []);

  const open = useCallback(
    (id: string, via: "click" | "hover") => {
      cancelClose();
      if (via === "hover") hoverOpenedAt.current = Date.now();
      setOpenId(id);
    },
    [cancelClose],
  );

  const close = useCallback(() => {
    cancelClose();
    setOpenId(null);
  }, [cancelClose]);

  const toggle = useCallback(
    (id: string) => {
      cancelClose();
      setOpenId((current) => {
        // Fareyle üzerine gelip hemen tıklayınca menü kapanmasın
        if (current === id && Date.now() - hoverOpenedAt.current < 400) return id;
        return current === id ? null : id;
      });
    },
    [cancelClose],
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenId(null), 160);
  }, [cancelClose]);

  // Esc ve dışarı tıklama
  useEffect(() => {
    if (!openId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenId(null);
      document.getElementById(`${openId}-trigger`)?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenId(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openId]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <DesktopNavContext.Provider
      value={{ openId, open, close, toggle, scheduleClose, cancelClose }}
    >
      <nav
        ref={navRef}
        aria-label={label}
        className={cn("h-full", className)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
        }}
      >
        <ul className="flex h-full items-center gap-0.5">{children}</ul>
      </nav>
    </DesktopNavContext.Provider>
  );
}

/** Üst menü öğelerinin ortak stili (link ve tetikleyici) */
export const topItemClass = cn(
  "flex items-center gap-1 rounded-[10px] px-2.5 py-2.5 text-[15px] font-medium transition-colors xl:px-3",
  "text-foreground hover:text-primary",
  "group-data-[hero=true]/header:text-navy-link group-data-[hero=true]/header:hover:text-navy-foreground",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group-data-[hero=true]/header:focus-visible:ring-accent",
  "aria-[current=page]:font-semibold aria-[current=page]:text-primary group-data-[hero=true]/header:aria-[current=page]:text-navy-foreground",
);

export function DesktopNavMenu({
  id,
  label,
  mega = false,
  hrefs,
  children,
}: {
  id: string;
  label: string;
  /** Ürünler mega menüsü: container genişliğinde açılır */
  mega?: boolean;
  /** Menüdeki sayfalar: aktif sayfa bunlardan biriyse tetikleyici vurgulanır */
  hrefs: string[];
  children: ReactNode;
}) {
  const { openId, open, toggle, scheduleClose, cancelClose } = useDesktopNav();
  const isOpen = openId === id;
  const pathname = usePathname();
  const active = hrefs.includes(pathname);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Dar panel tetikleyicinin altına hizalanır, container dışına taşmaz
  useLayoutEffect(() => {
    if (mega || !isOpen) return;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const container = panel?.offsetParent as HTMLElement | null;
    if (!panel || !trigger || !container) return;
    // Container'ın yan iç boşluğu kadar kenarda kalır
    const gutter = parseFloat(getComputedStyle(container).paddingRight) || 16;
    const containerRect = container.getBoundingClientRect();
    const desired = trigger.getBoundingClientRect().left - containerRect.left - 12;
    const max = containerRect.width - panel.offsetWidth - gutter;
    panel.style.left = `${Math.max(gutter, Math.min(desired, max))}px`;
  }, [isOpen, mega]);

  return (
    <li
      className="flex h-full items-center"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") open(id, "hover");
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") scheduleClose();
      }}
    >
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        onClick={() => toggle(id)}
        className={cn(
          topItemClass,
          (isOpen || active) &&
            "font-semibold text-primary group-data-[hero=true]/header:text-navy-foreground",
          isOpen && "bg-surface group-data-[hero=true]/header:bg-navy-foreground/10",
        )}
      >
        {label}
        <ChevronDown
          className={cn("size-4 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <div
        ref={panelRef}
        id={`${id}-menu`}
        data-state={isOpen ? "open" : "closed"}
        onPointerEnter={cancelClose}
        className={cn(
          // visibility geçişe dahil değil: kapanınca linkler anında Tab sırasından çıkar
          "absolute top-full pt-2.5 transition-[opacity,transform] duration-150",
          "invisible -translate-y-1 opacity-0",
          "data-[state=open]:visible data-[state=open]:translate-y-0 data-[state=open]:opacity-100",
          "motion-reduce:transition-none",
          mega ? "inset-x-4 sm:inset-x-6" : "left-0 max-w-[calc(100%-2rem)]",
        )}
      >
        {children}
      </div>
    </li>
  );
}
