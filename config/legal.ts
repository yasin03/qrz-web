// Yasal sayfalar (/yasal/[slug] ↔ /en/legal/[slug]). Metinler Faz 7'de MDX olarak gelir.

type LegalDef = {
  /** messages: pages.<id> */
  id: string;
  slug: { tr: string; en: string };
};

export const LEGAL_PAGES = [
  { id: "kvkk", slug: { tr: "kvkk", en: "data-protection-notice" } },
  { id: "privacy", slug: { tr: "gizlilik-politikasi", en: "privacy-policy" } },
  { id: "cookies", slug: { tr: "cerez-politikasi", en: "cookie-policy" } },
  { id: "terms", slug: { tr: "kullanim-sartlari", en: "terms-of-use" } },
] as const satisfies readonly LegalDef[];

export type LegalPage = (typeof LEGAL_PAGES)[number];
export type LegalSlug = LegalPage["slug"]["tr"];

export function getLegalBySlug(slug: string) {
  return LEGAL_PAGES.find((l) => l.slug.tr === slug);
}
