// Site genelindeki sabitler.
// Bilinmeyen gerçek bilgiler uydurulmaz: boş bırakılır ve arayüzde gösterilmez (TODO).

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://qrzaman.com.tr"
).replace(/\/$/, "");

/** Staging'de site tamamen noindex + robots Disallow olur (6.6). */
export const IS_INDEXABLE = process.env.NEXT_PUBLIC_SITE_ENV !== "staging";

export const SITE_NAME = "QR Zaman";

export const PANEL_URL = "https://app.qrzaman.com.tr";
export const PANEL_LOGIN_URL = `${PANEL_URL}/login`;

export const STORE_LINKS = {
  appStore: "", // TODO: App Store linki
  googlePlay: "", // TODO: Google Play linki
} as const;

export const CONTACT = {
  phone: "", // TODO: telefon (E.164, ör. +90...)
  email: "", // TODO: e-posta
  address: "", // TODO: adres
} as const;

export const SOCIAL_LINKS = {
  linkedin: "", // TODO: LinkedIn
  instagram: "", // TODO: Instagram
  youtube: "", // TODO: YouTube
} as const;

export type SocialNetwork = keyof typeof SOCIAL_LINKS;

/**
 * Ana sayfa rakamları (4.4/3). TODO: gerçek değerler gelene kadar null;
 * null olan rakam yer tutucu metinle gösterilir ve sayma animasyonu çalışmaz.
 */
export const STATS: Record<
  "companies" | "employees" | "dailyScans" | "provinces",
  number | null
> = {
  companies: null,
  employees: null,
  dailyScans: null,
  provinces: null,
};

/** Müşteri logoları. TODO: gerçek logolar gelene kadar boş; yerine 5 yer tutucu kutu gösterilir. */
export const CUSTOMER_LOGOS: { name: string; src: string }[] = [];
