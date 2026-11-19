import { routing } from "./routing";

/**
 * Dil yönlendirmesi proxy (middleware) yerine next.config rewrites/redirects ile yapılır.
 *
 * Neden: next-intl proxy'si iç rewrite'ı mutlak URL olarak yazar; standalone server.js
 * sunucu HOSTNAME'i 0.0.0.0/localhost dışında bir değerle başlatıldığında bunu dış istek
 * sayar ve /tr → / yönlendirmesiyle sonsuz döngü (ERR_TOO_MANY_REDIRECTS) oluşur.
 * next.config rewrite'ları Next'in kendi yönlendiricisinde göreli çalışır, sunucu
 * ayarından etkilenmez. Ek olarak her istekte proxy çalışmaz.
 *
 * Kurallar routing.pathnames'ten üretilir (iç yol = TR slug):
 * - TR (öneksiz): /urunler/x → /tr/urunler/x (genel kural, bilinmeyen yollar da TR 404'e düşer)
 * - EN: /en/products/y → /en/urunler/x (yalnızca slug'ı farklı olan yollar)
 * - Kanonik olmayan adresler kalıcı yönlendirilir: /tr/... → /..., /en/urunler/x → /en/products/y
 */

const { defaultLocale, pathnames } = routing;
const otherLocales = routing.locales.filter((l) => l !== defaultLocale);

type Rewrite = { source: string; destination: string };
type Redirect = Rewrite & { permanent: boolean };
type Localized = Record<(typeof routing.locales)[number], string>;

function localizedEntries() {
  return Object.entries(pathnames).flatMap(([internal, value]) =>
    typeof value === "string" ? [] : [[internal, value as Localized] as const],
  );
}

/** path-to-regexp kaynaklarında özel karakter kalmasın (slug'lar zaten [a-z0-9-]) */
function assertPlain(path: string) {
  if (!/^[/a-z0-9-]*$/.test(path)) {
    throw new Error(`url-rules: beklenmeyen yol karakteri: ${path}`);
  }
  return path;
}

// Önek dışı ilk segment: diğer diller, varsayılan dil, Next iç yolları; noktalı yollar
// (dosyalar: sitemap.xml, robots.txt, görseller) dosya sistemi tarafından karşılanır.
const reserved = [...routing.locales, "api", "_next", "_vercel"]
  .map((s) => `${s}(?:/|$)`)
  .join("|");

export function localeRewrites(): { afterFiles: Rewrite[] } {
  const enRules: Rewrite[] = otherLocales.flatMap((locale) =>
    localizedEntries()
      .filter(([internal, value]) => value[locale] !== internal)
      .map(([internal, value]) => ({
        source: assertPlain(`/${locale}${value[locale]}`),
        destination: `/${locale}${internal}`,
      })),
  );

  return {
    // afterFiles: statik dosyalar ve önceden üretilmiş sayfalardan sonra, [locale]
    // dinamik rotasından önce kontrol edilir (yoksa /urunler, [locale]=urunler olurdu).
    afterFiles: [
      ...enRules,
      { source: "/", destination: `/${defaultLocale}` },
      {
        source: `/:path((?!${reserved})(?!.*\\.).+)`,
        destination: `/${defaultLocale}/:path`,
      },
    ],
  };
}

export function localeRedirects(): Redirect[] {
  const enCanonical: Redirect[] = otherLocales.flatMap((locale) =>
    localizedEntries()
      .filter(([internal, value]) => value[locale] !== internal)
      .map(([internal, value]) => ({
        source: assertPlain(`/${locale}${internal}`),
        destination: `/${locale}${value[locale]}`,
        permanent: true,
      })),
  );

  return [
    ...enCanonical,
    { source: `/${defaultLocale}`, destination: "/", permanent: true },
    { source: `/${defaultLocale}/:path*`, destination: "/:path*", permanent: true },
  ];
}
