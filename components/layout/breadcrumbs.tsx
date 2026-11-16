import { ChevronRight } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { BreadcrumbList } from "schema-dts";
import { JsonLd } from "@/components/seo/json-ld";
import { getBreadcrumbTrail, PAGES, type PageId } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Görsel breadcrumb + BreadcrumbList JSON-LD (6.4).
 * Zincir config/navigation.ts → PAGES[*].parent'tan üretilir.
 */
export async function Breadcrumbs({
  id,
  locale,
  className,
}: {
  id: PageId;
  locale: Locale;
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "pages" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const trail = getBreadcrumbTrail(id);

  return (
    <>
      <nav aria-label={tb("label")} className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted-foreground">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={crumb} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
                ) : null}
                {last ? (
                  <span aria-current="page" className="font-semibold text-foreground">
                    {t(`${crumb}.label`)}
                  </span>
                ) : (
                  <Link
                    href={PAGES[crumb].href}
                    className="rounded transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {t(`${crumb}.label`)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd<BreadcrumbList>
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: t(`${crumb}.label`),
            item: absoluteUrl(locale, PAGES[crumb].href),
          })),
        }}
      />
    </>
  );
}
