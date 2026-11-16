import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { STORE_LINKS } from "@/config/site";
import { cn } from "@/lib/utils";
import appStore from "@/public/badges/app-store-en.svg";
import googlePlay from "@/public/badges/google-play-en.png";

/**
 * Resmi App Store / Google Play rozetleri (Apple ve Google'ın kendi rozet dosyaları; değiştirilmez,
 * yalnızca yüksekliği ayarlanır). Kaynak: developer.apple.com, play.google.com (badges).
 * İki dilde de İngilizce rozetler kullanılır (onaylı).
 */

export async function StoreBadges({
  tone = "navy",
  className,
}: {
  /**
   * Rozet yüksekliği (hepsi lacivert zeminde kullanılır):
   * navy: footer · hero: ana sayfa hero · solid: mega menü kartı · solidLg: mobil uygulama bantları
   */
  tone?: "navy" | "hero" | "solid" | "solidLg";
  className?: string;
}) {
  const t = await getTranslations("footer");
  const heightClass = {
    navy: "h-10",
    hero: "h-12",
    solid: "h-9",
    solidLg: "h-12 md:h-[52px]",
  }[tone];

  const stores = [
    { key: "appStore", href: STORE_LINKS.appStore, image: appStore },
    { key: "googlePlay", href: STORE_LINKS.googlePlay, image: googlePlay },
  ] as const;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {stores.map(({ key, href, image }) => {
        const badge = (
          <Image
            src={image}
            alt={t(`${key}Aria`)}
            // SVG optimize edilmez; PNG yüksekliğin 2 katı çözünürlükte servis edilir
            unoptimized={image.src.endsWith(".svg")}
            sizes="200px"
            className={cn("block w-auto", heightClass)}
          />
        );
        return (
          <li key={key}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener"
                className="block rounded-[10px] transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy focus-visible:outline-none"
              >
                {badge}
              </a>
            ) : (
              badge
            )}
          </li>
        );
      })}
    </ul>
  );
}
