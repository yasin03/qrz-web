"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * TR · EN seçici. Aynı sayfanın diğer dildeki karşılığına gerçek <a> ile gider
 * (next-intl pathnames). Arama motorları dil sürümlerini hreflang'den bulur.
 * href doğrudan kanonik adrestir (TR öneksiz: /urunler/bordro, EN: /en/products/payroll);
 * next-intl Link'in varsayılan /tr önekli yönlendirmeli adresi kullanılmaz.
 */
export function LocaleSwitcher({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  const t = useTranslations("locale");
  const current = useLocale();
  const pathname = usePathname();
  const params = useParams();

  return (
    <nav aria-label={t("label")} className={cn("flex items-center", className)}>
      <ul className="flex items-center gap-1 text-sm font-semibold">
        {routing.locales.map((locale, index) => {
          const active = locale === current;
          return (
            <li key={locale} className="flex items-center gap-1">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className={onDark ? "text-navy-border" : "text-border"}
                >
                  ·
                </span>
              ) : null}
              <a
                href={getPathname({
                  locale,
                  // Dinamik segmentli sayfalarda parametreler korunur
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  href: { pathname, params } as any,
                })}
                hrefLang={locale}
                lang={locale}
                aria-current={active ? "true" : undefined}
                title={t(locale)}
                className={cn(
                  "rounded px-1.5 py-1 uppercase transition-colors",
                  onDark
                    ? "text-navy-muted hover:text-navy-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  active && (onDark ? "text-navy-foreground" : "text-foreground"),
                )}
              >
                {locale}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
