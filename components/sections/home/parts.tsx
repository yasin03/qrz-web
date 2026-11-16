import type { ReactNode } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Bölüm üst etiketi: mavi hap (ana-sayfa-acik.html). */
export function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "self-start rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground md:px-3.5 md:py-[7px] md:text-[13px]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Bölüm başlığı (H2) ölçüsü: mobil 30px, masaüstü 44px. */
export const h2Class =
  "text-[30px] leading-[1.1] font-extrabold text-balance md:text-[44px]";

/** Gövde paragrafı */
export const leadClass =
  "text-[15px] leading-relaxed text-muted-foreground md:text-[17px]";

/**
 * t.rich etiketleri: <accent> vurgulu kelimeler, <br></br> satır sonu.
 * Lacivert zeminde vurgu rengi accent, açık zeminde primary (koyu temada accent).
 */
export function richTags(onDark = false) {
  return {
    accent: (chunks: ReactNode) => (
      <span className={onDark ? "text-accent" : "text-primary dark:text-accent"}>
        {chunks}
      </span>
    ),
    br: () => <br />,
  };
}

/** Onay işaretli madde listesi */
export function CheckList({
  items,
  onDark = false,
  className,
}: {
  items: string[];
  onDark?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-2.5 md:gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] md:text-base">
          <CircleCheck
            className={cn(
              "mt-0.5 size-5 shrink-0",
              onDark ? "text-accent" : "text-primary dark:text-accent",
            )}
            aria-hidden="true"
          />
          <span className={onDark ? "text-navy-foreground" : undefined}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** "… →" metin linki (açıklayıcı anchor metni, 6.4) */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: AppPathname;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 self-start rounded text-base font-bold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-accent",
        className,
      )}
    >
      {children}
      <ArrowRight
        className="size-[18px] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </Link>
  );
}
