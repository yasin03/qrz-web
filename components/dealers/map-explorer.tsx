"use client";

// Bayi haritası etkileşimi (4.7): hover tooltip, tıklayınca il paneli, ?il= ile paylaşılabilir URL,
// cmdk ile il arama. Harita SVG'si sunucuda render edilir ve children olarak gelir.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Command } from "cmdk";
import { ArrowRight, ChevronDown, MapPin, Search, X } from "lucide-react";
import type { Dealer } from "@/config/dealers";
import { cn } from "@/lib/utils";
import { DealerCard, type DealerCardLabels } from "./dealer-card";
import { nearestDealers, type MapProvince } from "./map-data";

export type MapExplorerLabels = {
  search: string;
  searchPlaceholder: string;
  noResult: string;
  clear: string;
  countOne: string;
  /** "{count}" yer tutucusu içerir */
  countOther: string;
  noDealer: string;
  panelIntro: string;
  emptyTitle: string;
  emptyText: string;
  noDealerInProvince: string;
  nearest: string;
  allInfo: string;
  becomeDealer: string;
  contact: string;
  legend: { dealer: string; served: string; none: string; label: string };
  card: Omit<DealerCardLabels, "province">;
};

const ctaClass =
  "group inline-flex items-center gap-1.5 self-start rounded text-[15px] font-bold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-accent";

/** Türkçe büyük/küçük harf ve aksan duyarsız arama */
const fold = (value: string) =>
  value.toLocaleLowerCase("tr").replace(/ı/g, "i").normalize("NFD").replace(/[̀-ͯ]/g, "");

export function MapExplorer({
  provinces,
  dealers,
  provinceHrefs,
  partnersHref,
  contactHref,
  labels,
  children,
}: {
  provinces: MapProvince[];
  dealers: Dealer[];
  /** slug → /bayiler/[il] adresi (yalnızca bayili iller) */
  provinceHrefs: Record<string, string>;
  partnersHref: string;
  contactHref: string;
  labels: MapExplorerLabels;
  children: ReactNode;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [hover, setHover] = useState<{ code: number; x: number; y: number } | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const byCode = useMemo(() => new Map(provinces.map((p) => [p.code, p])), [provinces]);
  const bySlug = useMemo(() => new Map(provinces.map((p) => [p.slug, p])), [provinces]);

  const countText = (count: number) =>
    count === 0
      ? labels.noDealer
      : count === 1
        ? labels.countOne
        : labels.countOther.replace("{count}", String(count));

  const select = useCallback(
    (code: number | null) => {
      setSelected(code);
      const url = new URL(window.location.href);
      const slug = code ? byCode.get(code)?.slug : undefined;
      if (slug) url.searchParams.set("il", slug);
      else url.searchParams.delete("il");
      window.history.replaceState(window.history.state, "", url);
    },
    [byCode],
  );

  // Paylaşılan link: ?il=istanbul
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("il");
    const province = slug ? bySlug.get(slug) : undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL yalnızca istemcide okunur
    if (province) setSelected(province.code);
  }, [bySlug]);

  // Seçili ili SVG'de işaretle
  useEffect(() => {
    const root = mapRef.current;
    if (!root) return;
    root
      .querySelectorAll("path[data-selected]")
      .forEach((el) => el.removeAttribute("data-selected"));
    if (selected) {
      root
        .querySelector(`path[data-code="${selected}"]`)
        ?.setAttribute("data-selected", "true");
    }
  }, [selected]);

  const codeFromEvent = (target: EventTarget | null) => {
    const el = (target as Element | null)?.closest?.("[data-code]");
    return el ? Number(el.getAttribute("data-code")) : null;
  };

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const code = codeFromEvent(event.target);
    if (!code) return;
    // Yeni sekmede açma vb. tarayıcı davranışına dokunma
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    select(code);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const code = codeFromEvent(event.target);
    const rect = mapRef.current?.getBoundingClientRect();
    if (!code || !rect) return setHover(null);
    setHover({ code, x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const current = selected ? byCode.get(selected) : undefined;
  const currentDealers = current
    ? dealers.filter((d) => d.provinceCode === current.code)
    : [];
  const nearby =
    current && currentDealers.length === 0 ? nearestDealers(current.code, dealers) : [];
  const hovered = hover ? byCode.get(hover.code) : undefined;
  const cardLabels = (dealer: Dealer): DealerCardLabels => ({
    ...labels.card,
    province: byCode.get(dealer.provinceCode)?.name ?? "",
  });

  const filtered = useMemo(() => {
    const q = fold(query.trim());
    return q ? provinces.filter((p) => fold(p.name).includes(q)) : provinces;
  }, [provinces, query]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-8">
      <div className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border p-4 md:p-6 dark:bg-surface">
        {/* İl arama (cmdk combobox) */}
        <Command shouldFilter={false} label={labels.search} className="relative">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Command.Input
              value={query}
              onValueChange={(value) => {
                setQuery(value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
              placeholder={labels.searchPlaceholder}
              aria-label={labels.search}
              className="h-12 w-full rounded-xl border border-input bg-background pr-10 pl-11 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 dark:bg-card"
            />
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <Command.List
            className={cn(
              "absolute inset-x-0 top-[calc(100%+6px)] z-20 max-h-72 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-menu",
              !open && "hidden",
            )}
          >
            <Command.Empty className="px-3 py-2.5 text-sm text-muted-foreground">
              {labels.noResult}
            </Command.Empty>
            {filtered.map((p) => (
              <Command.Item
                key={p.code}
                value={p.slug}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  select(p.code);
                  setQuery("");
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[15px] data-[selected=true]:bg-muted"
              >
                <span>{p.name}</span>
                <span className="text-xs text-muted-foreground">
                  {countText(p.count)}
                </span>
              </Command.Item>
            ))}
          </Command.List>
        </Command>

        {/* Harita */}
        <div
          ref={mapRef}
          className="relative"
          onClick={onClick}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setHover(null)}
        >
          {children}
          {hover && hovered ? (
            <div
              role="presentation"
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-xl border border-border bg-popover px-3 py-2 text-sm whitespace-nowrap text-popover-foreground shadow-menu"
              style={{ left: hover.x, top: hover.y }}
            >
              <span className="font-bold">{hovered.name}</span>
              <span className="block text-muted-foreground">
                {countText(hovered.count)}
              </span>
            </div>
          ) : null}
        </div>

        {/* Lejant */}
        <ul
          aria-label={labels.legend.label}
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"
        >
          {(
            [
              ["dealer", "bg-primary"],
              ["served", "bg-primary/35"],
              ["none", "bg-muted border border-border dark:bg-card"],
            ] as const
          ).map(([key, swatch]) => (
            <li key={key} className="flex items-center gap-2">
              <span aria-hidden="true" className={cn("size-3.5 rounded-[4px]", swatch)} />
              {labels.legend[key]}
            </li>
          ))}
        </ul>
      </div>

      {/* İl paneli */}
      <div
        aria-live="polite"
        className="flex min-w-0 flex-col gap-4 rounded-3xl bg-surface p-5 md:p-7 lg:sticky lg:top-[calc(var(--header-h)+2rem)]"
      >
        {current ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <h3 className="flex items-center gap-2 text-2xl font-extrabold">
                <MapPin
                  className="size-6 text-primary dark:text-accent"
                  aria-hidden="true"
                />
                {current.name}
              </h3>
              <button
                type="button"
                onClick={() => select(null)}
                aria-label={labels.clear}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            {currentDealers.length > 0 ? (
              <>
                <p className="text-sm font-semibold text-muted-foreground">
                  {countText(currentDealers.length)}
                </p>
                <div className="flex flex-col gap-3">
                  {currentDealers.map((dealer) => (
                    <DealerCard
                      key={dealer.id}
                      dealer={dealer}
                      labels={cardLabels(dealer)}
                      headingLevel="h4"
                    />
                  ))}
                </div>
                {provinceHrefs[current.slug] ? (
                  <a href={provinceHrefs[current.slug]} className={ctaClass}>
                    {labels.allInfo}
                    <ArrowRight
                      className="size-[18px] transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                ) : null}
              </>
            ) : (
              <>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {labels.noDealerInProvince}
                </p>
                {nearby.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-bold">{labels.nearest}</p>
                    {nearby.map((dealer) => (
                      <DealerCard
                        key={dealer.id}
                        dealer={dealer}
                        labels={cardLabels(dealer)}
                        headingLevel="h4"
                      />
                    ))}
                  </div>
                ) : (
                  <a href={contactHref} className={ctaClass}>
                    {labels.contact}
                    <ArrowRight className="size-[18px]" aria-hidden="true" />
                  </a>
                )}
                <a href={partnersHref} className={ctaClass}>
                  {labels.becomeDealer}
                  <ArrowRight className="size-[18px]" aria-hidden="true" />
                </a>
              </>
            )}
          </>
        ) : dealers.length === 0 ? (
          <>
            <h3 className="text-xl font-bold">{labels.emptyTitle}</h3>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {labels.emptyText}
            </p>
            <a href={contactHref} className={ctaClass}>
              {labels.contact}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </a>
            <a href={partnersHref} className={ctaClass}>
              {labels.becomeDealer}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </a>
          </>
        ) : (
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {labels.panelIntro}
          </p>
        )}
      </div>
    </div>
  );
}
