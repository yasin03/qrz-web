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

/**
 * Yasal metinlerde ve hesap silme formunda kullanılan şirket bilgileri.
 * Kaynak: qrz-admin/constants/yasal.ts (yalnızca okundu).
 */
export const LEGAL_ENTITY = {
  title: "DESTEKPARK BİLİŞİM MUTLU YILMAZ",
  address: "Kasımpaşa Mah. Gazlıgöl Cad. No:115/B Merkez/Afyonkarahisar",
  mersis: "2180545357000011",
  /** KVKK başvuruları ve hesap silme talepleri bu adrese gider */
  kvkkEmail: "kvkk@destekpark.com.tr",
  supportEmail: "destek@destekpark.com.tr",
  serverLocation: { tr: "Türkiye", en: "Türkiye" },
  /** Yasal metinlerin son güncelleme tarihi (ISO) */
  updatedAt: "2026-11-18",
} as const;
