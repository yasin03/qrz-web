import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname } from "@/i18n/routing";
import { IS_INDEXABLE, SITE_NAME, SITE_URL } from "@/config/site";
import { PAGES, type PageId } from "@/config/navigation";

const OG_LOCALES: Record<Locale, string> = { tr: "tr_TR", en: "en_US" };

/** Sayfanın verilen dildeki mutlak URL'si (canonical, hreflang, sitemap, JSON-LD). */
export function absoluteUrl(locale: Locale, href: AppPathname) {
  const path = getPathname({ locale, href });
  return `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
}

/** hreflang alternatifleri: tr, en ve x-default (TR). */
export function languageAlternates(href: AppPathname) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[locale] = absoluteUrl(locale, href);
  languages["x-default"] = absoluteUrl(routing.defaultLocale, href);
  return languages;
}

type BuildMetadataArgs = {
  locale: Locale;
  href: AppPathname;
  title: string;
  description: string;
  /** true ise "%s | QR Zaman" şablonu uygulanmaz (ana sayfa) */
  absoluteTitle?: boolean;
  noindex?: boolean;
};

/** 6.2: title, description, canonical, hreflang, Open Graph, Twitter, robots. */
export function buildMetadata({
  locale,
  href,
  title,
  description,
  absoluteTitle = false,
  noindex = false,
}: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(locale, href);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(href) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALES[l]),
      url,
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    robots: robotsFor(noindex),
  };
}

/** Staging: tamamen kapalı. noindex sayfa: indekslenmez ama linkleri izlenir. */
export function robotsFor(noindex = false): Metadata["robots"] {
  if (!IS_INDEXABLE) return { index: false, follow: false };
  return noindex ? { index: false, follow: true } : { index: true, follow: true };
}

/** Kayıtlı bir sayfanın metadata'sı: metinler messages → pages.<id>. */
export async function pageMetadata(locale: Locale, id: PageId): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pages" });
  const isHome = id === "home";
  return buildMetadata({
    locale,
    href: PAGES[id].href,
    title: isHome ? `${t(`${id}.title`)} | ${SITE_NAME}` : t(`${id}.title`),
    description: t(`${id}.metaDescription`),
    absoluteTitle: isHome,
  });
}
