import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  // TR öneksiz (/urunler), EN /en altında (/en/products)
  localePrefix: "as-needed",
  // Tarayıcı diline göre otomatik yönlendirme yok: her URL'nin tek ve sabit
  // bir dili olur (SEO). Dil değişimi footer'daki seçiciyle yapılır.
  localeDetection: false,
  // Dile özel slug'lar. Faz 2'de 3. bölümdeki tüm yollar eklenir.
  pathnames: {
    "/": "/",
    "/bilesenler": "/bilesenler",
  },
});

export type AppLocale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
