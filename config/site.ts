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
  appStore: "https://apps.apple.com/pe/app/qr-zaman/id6824048395?l=en-GB",
  googlePlay:
    "https://play.google.com/store/apps/details?id=com.qrzaman.qrzmobile&pcampaignid=web_share",
} as const;

export const CONTACT = {
  /** E.164 (tel: linki ve JSON-LD) */
  phone: "+902722121505",
  /** Ekranda gösterilen biçim */
  phoneDisplay: "0272 212 15 05",
  email: "info@qrzaman.com.tr",
  address: {
    /** Ekranda satır satır gösterilir */
    lines: [
      "Kasımpaşa, Gazlıgöl Cd. 115/B",
      "03200 Afyonkarahisar Merkez/Afyonkarahisar",
    ],
    // JSON-LD PostalAddress alanları
    street: "Kasımpaşa, Gazlıgöl Cd. 115/B",
    postalCode: "03200",
    locality: "Merkez",
    region: "Afyonkarahisar",
    country: "TR",
  },
} as const;

/** Destek ekibinin çalışma saatleri (ör. "Hafta içi 09:00–18:00"). TODO: bilinmiyor, yer tutucu gösterilir. */
export const SUPPORT_HOURS = { tr: "", en: "" } as const;

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
  companies: 12,
  employees: 245,
  dailyScans: 1280,
  provinces: 2,
};

/**
 * Müşteri (referans) logoları: ana sayfa "Referanslar" bandı. Dosyalar public/referances/ altında.
 * width/height dosyanın kendi oranıdır; logo sabit yükseklikte, oranı korunarak gösterilir.
 * Liste boşsa yerine 5 yer tutucu kutu gösterilir.
 */
export const CUSTOMER_LOGOS: { name: string; src: string; width: number; height: number }[] = [
  { name: "Alko", src: "/referances/alko.avif", width: 280, height: 128 },
  { name: "Destekpark", src: "/referances/destekpark.png", width: 466, height: 80 },
  { name: "Kumartaşlı", src: "/referances/kumartasli.svg", width: 598, height: 114 },
];
