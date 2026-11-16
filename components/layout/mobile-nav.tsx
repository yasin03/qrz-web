"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Mobil menü (< 1024px): hamburger → tam ekran panel.
 * İçerik (accordion + alt alan) Server Component olarak gelir ve kapalıyken de DOM'dadır
 * (`hidden` ile gizlenir, sayfa kaynağında görünür). Accordion native <details> kullanır.
 */
export function MobileNav({
  openLabel,
  closeLabel,
  logo,
  footer,
  children,
  className,
}: {
  openLabel: string;
  closeLabel: string;
  /** Panelin üst satırındaki logo */
  logo: ReactNode;
  /** Altta sabit alan: dil, tema, Giriş Yap, Demo Talep Et */
  footer: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Sayfa değişince panel kapanır
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) {
      // Kapanınca odak hamburger butonuna döner
      if (wasOpen.current) openButtonRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeButtonRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      // Odak panelin içinde döner (aria-modal)
      if (event.key !== "Tab") return;
      const dialog = document.getElementById("mobil-menu");
      const focusables = dialog?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const visible = [...focusables].filter((el) => el.offsetParent !== null);
      const first = visible[0];
      const last = visible[visible.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    // Masaüstü genişliğine geçilirse panel kapanır
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  const iconButton =
    "flex size-11 items-center justify-center rounded-xl border transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

  return (
    <div className={className}>
      <button
        ref={openButtonRef}
        type="button"
        aria-label={openLabel}
        aria-expanded={open}
        aria-controls="mobil-menu"
        onClick={() => setOpen(true)}
        className={cn(
          iconButton,
          "border-border text-foreground hover:bg-muted",
          "group-data-[hero=true]/header:border-navy-border group-data-[hero=true]/header:text-navy-foreground group-data-[hero=true]/header:hover:bg-navy-foreground/10",
        )}
      >
        <Menu className="size-[22px]" aria-hidden="true" />
      </button>

      <div
        id="mobil-menu"
        role="dialog"
        aria-modal="true"
        aria-label={openLabel}
        hidden={!open}
        className="fixed inset-0 z-[60] flex flex-col bg-background text-foreground"
        onClick={(event) => {
          // Panel içindeki bir linke tıklanınca kapanır (aynı sayfa linki dahil)
          if ((event.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-border px-4">
          {logo}
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
            className={cn(iconButton, "border-border text-foreground hover:bg-muted")}
          >
            <X className="size-[22px]" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
        <div className="shrink-0 border-t border-border bg-background p-4">{footer}</div>
      </div>
    </div>
  );
}
