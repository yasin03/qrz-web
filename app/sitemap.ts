import type { MetadataRoute } from "next";
import { PAGES } from "@/config/navigation";
import { IS_INDEXABLE } from "@/config/site";
import { routing } from "@/i18n/routing";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

/**
 * Sitemap (6.6): config/navigation.ts → PAGES'teki her sayfa, iki dilde ayrı kayıt
 * ve her kayıtta hreflang alternatifleri (tr, en, x-default).
 * Blog yazıları Faz 8'de eklenir.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!IS_INDEXABLE) return [];
  const lastModified = new Date();

  return Object.values(PAGES).flatMap(({ href }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, href),
      lastModified,
      alternates: { languages: languageAlternates(href) },
    })),
  );
}
