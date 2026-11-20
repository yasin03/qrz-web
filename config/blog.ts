// Blog (Faz 8). Yazı metinleri, başlık ve açıklamaları MDX dosyasındadır:
// content/tr/blog/<slug>.mdx → `export const meta`. Burada yalnızca yönlendirme, sitemap ve
// iç linkleme için gereken yapısal bilgiler durur (next.config da bu dosyayı yükler: göreli import).
//
// Yazılar şimdilik yalnızca Türkçedir. /en/blog aynı Türkçe yazıları listeler; yazı sayfası
// İngilizce üretilmez (/en/blog/<slug> 404), dil seçici EN'de /en/blog'a gider.

export type BlogCategoryDef = {
  /** messages: blogPage.categories.<id> */
  id: string;
  slug: { tr: string; en: string };
};

export const BLOG_CATEGORIES = [
  { id: "attendance", slug: { tr: "pdks-ve-puantaj", en: "attendance-and-timesheets" } },
  { id: "payroll", slug: { tr: "bordro-ve-mevzuat", en: "payroll-and-compliance" } },
  { id: "hr", slug: { tr: "ik-yonetimi", en: "hr-management" } },
  { id: "guides", slug: { tr: "urun-rehberleri", en: "product-guides" } },
] as const satisfies readonly BlogCategoryDef[];

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogCategoryId = BlogCategory["id"];

/** Yazar: messages → blogPage.authors.<id>. Gerçek kişi adı uydurulmaz. */
export const BLOG_AUTHORS = ["team"] as const;
export type BlogAuthorId = (typeof BLOG_AUTHORS)[number];

export type BlogPostDef = {
  /** URL: /blog/<slug> (TR) */
  slug: string;
  category: BlogCategoryId;
  author: BlogAuthorId;
  /** ISO tarih (YYYY-AA-GG) */
  publishedAt: string;
  updatedAt: string;
  /**
   * Kapak görseli: public/blog/ altında, 1600px genişlik. Alt metni MDX'te: meta.coverAlt.
   * Unsplash fotoğraflarında (Unsplash Lisansı, ücretsiz) `credit` verilir; yazı sayfasında
   * kapağın altında fotoğrafçı ve Unsplash linki gösterilir. Kendi ekranlarımızdan
   * hazırlanan kapaklarda `credit` yoktur.
   */
  cover: {
    src: string;
    width: number;
    height: number;
    credit?: {
      photographer: string;
      /** Fotoğrafın Unsplash sayfası */
      url: string;
    };
  };
  /** Yazının sonunda verilen iç linkler (6.4): config/products.ts ve calculators.ts id'leri */
  related: { products: string[]; calculators: string[] };
};

/** Blog yazılarının dili. Diğer diller yazıyı listeler ama yazı sayfası üretilmez. */
export const BLOG_POST_LOCALE = "tr";

export const BLOG_POSTS = [
  {
    slug: "pdks-nedir",
    category: "attendance",
    author: "team",
    publishedAt: "2026-11-03",
    updatedAt: "2026-11-03",
    cover: {
      src: "/blog/pdks-giris-noktasinda-telefon.jpg",
      width: 1600,
      height: 1067,
      credit: {
        photographer: "Jakub Żerdzicki",
        url: "https://unsplash.com/photos/UyWuiljE25w",
      },
    },
    related: {
      products: ["qrPdks", "locationTracking", "timesheet", "mobileApp"],
      calculators: [],
    },
  },
  {
    slug: "fazla-mesai-ucreti-nasil-hesaplanir",
    category: "payroll",
    author: "team",
    publishedAt: "2026-11-11",
    updatedAt: "2026-11-11",
    cover: {
      src: "/blog/fazla-mesai-ofiste-calisan-personel.jpg",
      width: 1600,
      height: 1067,
      credit: {
        photographer: "Israel Andrade",
        url: "https://unsplash.com/photos/people-sitting-on-chair-in-front-of-computer-YI_9SivVt_s",
      },
    },
    related: {
      products: ["timesheet", "shiftManagement", "payroll"],
      calculators: ["overtimeCalc", "salaryCalc"],
    },
  },
  {
    slug: "kidem-tazminati-sartlari",
    category: "payroll",
    author: "team",
    publishedAt: "2026-11-17",
    updatedAt: "2026-11-17",
    cover: {
      src: "/blog/kidem-tazminati-sozlesme-imzalama.jpg",
      width: 1600,
      height: 1068,
      credit: {
        photographer: "Scott Graham",
        url: "https://unsplash.com/photos/man-writing-on-paper-OQMZwNd3ThU",
      },
    },
    related: {
      products: ["payroll", "employeeRecords", "compliance"],
      calculators: ["severanceCalc", "noticeCalc"],
    },
  },
  {
    slug: "yillik-izin-hakki",
    category: "hr",
    author: "team",
    publishedAt: "2026-10-14",
    updatedAt: "2026-10-14",
    cover: {
      src: "/blog/yillik-izin-planlama-takvimi.jpg",
      width: 1600,
      height: 1067,
      credit: {
        photographer: "Towfiqu barbhuiya",
        url: "https://unsplash.com/photos/bwOAixLG0uc",
      },
    },
    related: {
      products: ["leaveManagement", "employeeRecords", "reporting"],
      calculators: ["annualLeaveCalc"],
    },
  },
  {
    slug: "puantaj-nedir",
    category: "attendance",
    author: "team",
    publishedAt: "2026-10-23",
    updatedAt: "2026-10-23",
    cover: {
      src: "/blog/puantaj-kontrol-listesi.jpg",
      width: 1600,
      height: 900,
      credit: {
        photographer: "Jakub Żerdzicki",
        url: "https://unsplash.com/photos/TB7aNN4blTQ",
      },
    },
    related: {
      products: ["timesheet", "qrPdks", "payroll", "hrDocuments"],
      calculators: ["overtimeCalc"],
    },
  },
  {
    slug: "qr-kodlu-pdks-kurulumu",
    category: "guides",
    author: "team",
    publishedAt: "2026-11-06",
    updatedAt: "2026-11-06",
    cover: {
      // Stilize A4 QR afişi (çalışan QR kod yok) + mobil uygulama giriş ekranı
      src: "/blog/qr-zaman-pdks-kurulumu-qr-afis-mobil-giris.jpg",
      width: 1600,
      height: 840,
    },
    related: {
      products: ["qrPdks", "locationTracking", "shiftManagement", "employeeManagement", "multiCompany", "mobileApp"],
      calculators: [],
    },
  },
] as const satisfies readonly BlogPostDef[];

export type BlogPost = (typeof BLOG_POSTS)[number];
export type BlogSlug = BlogPost["slug"];

export function getPostDef(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getCategoryById(id: string) {
  return BLOG_CATEGORIES.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string) {
  return BLOG_CATEGORIES.find((c) => c.slug.tr === slug);
}

/** Yalnızca yazısı olan kategorilerin sayfası üretilir (boş kategori sayfası olmaz). */
export function getActiveCategories() {
  return BLOG_CATEGORIES.filter((c) => BLOG_POSTS.some((p) => p.category === c.id));
}

/** Yazı sayfasının iç yolu (TR slug) */
export const postPath = (slug: string) => `/blog/${slug}`;

/**
 * Dil seçici için: verilen iç yol, hedef dilde bulunmayan bir blog yazısıysa
 * o dilin blog ana sayfası döner.
 */
export function blogLocaleFallback(pathname: string, locale: string) {
  if (locale === BLOG_POST_LOCALE) return undefined;
  return BLOG_POSTS.some((p) => postPath(p.slug) === pathname) ? "/blog" : undefined;
}
