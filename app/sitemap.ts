import type { MetadataRoute } from "next";
import { getDealerProvinces } from "@/config/dealers";
import { PAGES } from "@/config/navigation";
import { IS_INDEXABLE } from "@/config/site";
import { routing, type AppPathname } from "@/i18n/routing";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

/**
 * Sitemap (6.6): config/navigation.ts → PAGES'teki her sayfa, iki dilde ayrı kayıt
 * ve her kayıtta hreflang alternatifleri (tr, en, x-default).
 * Bayisi olan illerin /bayiler/[il] sayfaları da eklenir (4.7). Blog yazıları Faz 8'de eklenir.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!IS_INDEXABLE) return [];
  const lastModified = new Date();

  const hrefs: AppPathname[] = [
    ...Object.values(PAGES).map((page) => page.href),
    ...getDealerProvinces().map((p) => `/bayiler/${p.slug}` as AppPathname),
  ];

  return hrefs.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, href),
      lastModified,
      alternates: { languages: languageAlternates(href) },
    })),
  );
}
