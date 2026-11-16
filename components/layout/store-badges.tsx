import { Play, Smartphone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { STORE_LINKS } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * App Store / Google Play rozetleri.
 * TODO: Mağaza linkleri config/site.ts → STORE_LINKS'e girilene kadar rozet görünür
 * ama link değildir (uydurma link yok). Link girilince otomatik <a> olur.
 */
export async function StoreBadges({
  tone = "navy",
  className,
}: {
  /**
   * navy: lacivert zeminde çerçeveli (footer) · hero: iki satırlı çerçeveli (ana sayfa hero)
   * solid: küçük beyaz (mega menü kartı) · solidLg: büyük beyaz (mobil uygulama bölümü)
   */
  tone?: "navy" | "hero" | "solid" | "solidLg";
  className?: string;
}) {
  const t = await getTranslations("footer");
  const th = await getTranslations("home.storeSub");
  const stores = [
    { key: "appStore", href: STORE_LINKS.appStore, icon: Smartphone },
    { key: "googlePlay", href: STORE_LINKS.googlePlay, icon: Play },
  ] as const;

  return (
    <ul
      className={cn(
        "flex gap-2",
        tone === "solidLg" ? "gap-2.5 md:gap-3" : "flex-wrap",
        className,
      )}
    >
      {stores.map(({ key, href, icon: Icon }) => {
        const badgeClass = cn(
          "inline-flex items-center gap-2 font-bold transition-colors",
          tone === "navy" &&
            "h-[42px] rounded-[10px] border border-navy-border px-3.5 text-[13px] text-navy-foreground",
          tone === "hero" &&
            "h-12 gap-2.5 rounded-xl border border-navy-border px-4 text-navy-foreground",
          tone === "solid" &&
            "h-9 gap-1.5 rounded-[10px] bg-navy-foreground px-3 text-[13px] text-navy",
          tone === "solidLg" &&
            "h-12 w-full justify-center rounded-xl bg-navy-foreground px-5 text-navy md:h-[52px] md:w-auto",
        );
        const content =
          tone === "hero" ? (
            <>
              <Icon className="size-5" aria-hidden="true" />
              <span className="flex flex-col leading-[1.1]">
                <span className="text-[10px] font-normal text-navy-muted">{th(key)}</span>
                <span className="text-[15px]">{t(key)}</span>
              </span>
            </>
          ) : (
            <>
              {tone === "solidLg" ? null : <Icon className="size-4" aria-hidden="true" />}
              {t(key)}
            </>
          );
        return (
          <li
            key={key}
            className={tone === "solidLg" ? "flex-1 md:flex-none" : undefined}
          >
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener"
                aria-label={t(`${key}Aria`)}
                className={cn(
                  badgeClass,
                  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                  tone === "navy" || tone === "hero"
                    ? "hover:bg-navy-foreground/10"
                    : "hover:bg-navy-foreground/90",
                )}
              >
                {content}
              </a>
            ) : (
              <span className={badgeClass}>{content}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
