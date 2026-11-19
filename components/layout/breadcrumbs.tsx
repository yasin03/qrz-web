import { Fragment } from "react";
import NextLink from "next/link";
import { ChevronRight } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { BreadcrumbList } from "schema-dts";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbTrail, PAGES, type PageId } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Görsel breadcrumb + BreadcrumbList JSON-LD (6.4).
 * Zincir config/navigation.ts → PAGES[*].parent'tan üretilir.
 */
export async function Breadcrumbs({
  id,
  locale,
  section,
  current,
  className,
}: {
  id: PageId;
  locale: Locale;
  /**
   * Son adımdan önce gösterilen ara adım (ör. ürün kategorisi → /urunler#zaman-ve-devam-takibi).
   * Ayrı bir sayfa olmadığı için JSON-LD'ye eklenmez.
   */
  section?: { label: string; href: string };
  /** Kayıtlı sayfanın altındaki son adım (ör. /bayiler › İstanbul). JSON-LD'ye de eklenir. */
  current?: { label: string; href: AppPathname };
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "pages" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const trail = getBreadcrumbTrail(id);
  const linkClass =
    "rounded transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";
  const separator = <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />;

  return (
    <>
      <nav aria-label={tb("label")} className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted-foreground">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1 && !current;
            return (
              <Fragment key={crumb}>
                {last && section ? (
                  <li className="flex items-center gap-1.5">
                    {separator}
                    <NextLink href={section.href} className={linkClass}>
                      {section.label}
                    </NextLink>
                  </li>
                ) : null}
                <li className="flex items-center gap-1.5">
                  {index > 0 ? separator : null}
                  {last ? (
                    <span aria-current="page" className="font-semibold text-foreground">
                      {t(`${crumb}.label`)}
                    </span>
                  ) : (
                    <Link href={PAGES[crumb].href} className={linkClass}>
                      {t(`${crumb}.label`)}
                    </Link>
                  )}
                </li>
              </Fragment>
            );
          })}
          {current ? (
            <li className="flex items-center gap-1.5">
              {separator}
              <span aria-current="page" className="font-semibold text-foreground">
                {current.label}
              </span>
            </li>
          ) : null}
        </ol>
      </nav>
      <JsonLd<BreadcrumbList>
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            ...trail.map((crumb, index) => ({
              "@type": "ListItem" as const,
              position: index + 1,
              name: t(`${crumb}.label`),
              item: absoluteUrl(locale, PAGES[crumb].href),
            })),
            ...(current
              ? [
                  {
                    "@type": "ListItem" as const,
                    position: trail.length + 1,
                    name: current.label,
                    item: absoluteUrl(locale, current.href),
                  },
                ]
              : []),
          ],
        }}
      />
    </>
  );
}
