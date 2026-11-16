import { defineRouting } from "next-intl/routing";
import { CALCULATORS } from "@/config/calculators";
import { LEGAL_PAGES } from "@/config/legal";
import { PRODUCTS } from "@/config/products";
import { SOLUTIONS } from "@/config/solutions";

type Localized = { tr: string; en: string };

/**
 * Config'teki her kayıt için dile özel tam yol üretir:
 * "/urunler/qr-kodlu-pdks" → { tr: "/urunler/qr-kodlu-pdks", en: "/products/qr-code-attendance" }.
 * İç yol (anahtar) her zaman TR slug'ıdır; next-intl EN adresi bu iç yola yeniden yazar.
 * Böylece dil seçici, breadcrumb ve sitemap slug eşlemesini ayrıca bilmek zorunda kalmaz.
 */
function slugPaths<
  const Base extends string,
  const Items extends readonly { slug: Localized }[],
>(trBase: Base, enBase: string, items: Items) {
  return Object.fromEntries(
    items.map((item) => [
      `${trBase}/${item.slug.tr}`,
      { tr: `${trBase}/${item.slug.tr}`, en: `${enBase}/${item.slug.en}` },
    ]),
  ) as Record<`${Base}/${Items[number]["slug"]["tr"]}`, Localized>;
}

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  // TR öneksiz (/urunler), EN /en altında (/en/products)
  localePrefix: "as-needed",
  // Tarayıcı diline göre otomatik yönlendirme yok: her URL'nin tek ve sabit
  // bir dili olur (SEO). Dil değişimi footer'daki seçiciyle yapılır.
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/bilesenler": "/bilesenler",

    // Ürünler
    "/urunler": { tr: "/urunler", en: "/products" },
    ...slugPaths("/urunler", "/products", PRODUCTS),

    // Çözümler
    "/cozumler": { tr: "/cozumler", en: "/solutions" },
    ...slugPaths("/cozumler", "/solutions", SOLUTIONS),

    "/fiyatlandirma": { tr: "/fiyatlandirma", en: "/pricing" },

    // Kaynaklar
    "/blog": "/blog",
    "/sss": { tr: "/sss", en: "/faq" },
    "/destek": { tr: "/destek", en: "/support" },
    "/hesaplama": { tr: "/hesaplama", en: "/calculators" },
    ...slugPaths("/hesaplama", "/calculators", CALCULATORS),

    // Kurumsal
    "/hakkimizda": { tr: "/hakkimizda", en: "/about" },
    "/bayiler": { tr: "/bayiler", en: "/dealers" },
    "/is-ortakligi": { tr: "/is-ortakligi", en: "/partners" },
    "/iletisim": { tr: "/iletisim", en: "/contact" },
    "/guvenlik": { tr: "/guvenlik", en: "/security" },
    "/demo-talep": { tr: "/demo-talep", en: "/request-demo" },

    // Yasal
    ...slugPaths("/yasal", "/legal", LEGAL_PAGES),
    "/hesap-silme": { tr: "/hesap-silme", en: "/delete-account" },
  },
});

export type AppLocale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
