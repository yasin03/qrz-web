import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  /** Erişilebilir bölüm adı (ör. "Özellikler") */
  label: string;
  className?: string;
};

/**
 * Yatay sürekli kayan özellik şeridi (CSS animasyonu, JS yok).
 * Liste iki kez basılır; ikinci kopya ekran okuyuculardan gizlenir.
 */
export function Marquee({ items, label, className }: MarqueeProps) {
  return (
    <section
      aria-label={label}
      className={cn(
        "overflow-hidden border-b border-border bg-background py-[18px]",
        className,
      )}
    >
      <ul className="flex w-max animate-qz-marquee gap-3 hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, index) => (
          <li
            key={index}
            aria-hidden={index >= items.length ? true : undefined}
            className="rounded-full border border-chip-border px-4 py-[9px] text-sm font-semibold whitespace-nowrap text-chip-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
