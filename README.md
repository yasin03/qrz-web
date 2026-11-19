# qrz-web

`qrzaman.com.tr` tanıtım sitesi. Next.js 16 (App Router) + Tailwind v4 + shadcn/ui + next-intl (TR/EN) + next-themes.
Proje brifi ve fazlar: [`docs/prompt.md`](docs/prompt.md). Ürün içeriği: [`docs/ozellikler.md`](docs/ozellikler.md).

> Panel (`app.qrzaman.com.tr`, `../qrz-admin`) ayrı bir projedir; bu repo ona dokunmaz.

## Geliştirme

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_SITE_URL vb.
npm run dev                  # http://localhost:3000
```

| Komut               | Açıklama                                                  |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Geliştirme sunucusu                                       |
| `npm run build`     | Production build (`output: "standalone"`)                 |
| `npm run start`     | Build'i çalıştırır                                        |
| `npm run lint`      | ESLint                                                    |
| `npm run typecheck` | TypeScript kontrolü (önce `npx next typegen` gerekebilir) |
| `npm run format`    | Prettier (+ Tailwind sınıf sıralaması)                    |

Geliştirme ortamında `/bilesenler` sayfası ortak bileşenlerin vitrinidir. Production'da 404 döner ve indekslenmez.

## Yapı

```
app/[locale]/        Sayfalar (TR öneksiz, EN /en). [...rest] → 404
app/sitemap.ts       config/navigation.ts → PAGES'ten, iki dil + hreflang
app/robots.ts        Production: izin (/api hariç), staging: Disallow
components/layout/   Header (server) + DesktopNav/MobileNav (client), Footer, Breadcrumbs, PageHeader …
components/mockups/  BrowserFrame, PhoneFrame, ToastCard, QrPoster
components/seo/      JsonLd (schema-dts)
config/navigation.ts Menü, footer, breadcrumb ve sitemap'in tek kaynağı (PAGES, MAIN_NAV, FOOTER_NAV)
config/products.ts   Ürünler (slug {tr,en}, kategori, ikon, keyword) — aynı yapıda solutions, calculators, legal
config/site.ts       Site URL, panel URL, mağaza/iletişim/sosyal (bilinmeyenler boş → arayüzde gösterilmez)
i18n/routing.ts      next-intl pathnames: config'teki slug'lardan üretilir
lib/seo.ts           buildMetadata / pageMetadata (canonical, hreflang, OG, robots)
messages/            tr.json / en.json — sayfa metinleri pages.<id>.{label, short?, description, title, metaDescription, h1}
i18n/url-rules.ts    dil yönlendirmesi: next.config rewrites/redirects (proxy yok)
public/logos         logo-pri (açık zemin), logo-sec (koyu zemin)
public/screenshots   Maskeli ekran görüntüleri (admin, mobile)
```

### Dile özel URL'ler

İç yol her zaman TR slug'ıdır (`/urunler/bordro`). `i18n/routing.ts`, config'teki `slug.en` değerinden
EN adresini üretir (`/en/products/payroll`) ve next-intl gelen EN isteğini iç yola yeniden yazar.
Bu sayede dil seçici, breadcrumb ve sitemap ek eşleme bilmeden doğru adresi üretir.

## Kurallar (özet)

- **Renkler sadece token:** `app/globals.css` içindeki `:root` / `.dark` değişkenleri. Bileşenlerde hex, `bg-white` vb. kullanılmaz.
- **Metinler sadece `messages/*.json` veya MDX:** yeni anahtar TR ve EN'e birlikte eklenir.
- **Linkler `@/i18n/navigation`'daki `Link` ile:** dile özel URL'ler `i18n/routing.ts` → `pathnames`.
- **Görseller `next/image` + statik import.** Next 16'da `priority` kaldırıldı; ekranın üstündeki görsellerde `loading="eager"` / `fetchPriority="high"` (bileşenlerde `aboveFold` prop'u).
- **Döngüsel animasyonlar CSS ile**, hepsi `prefers-reduced-motion`'da durur.

## İçerik ekleme

- **Yeni UI metni:** `messages/tr.json` ve `messages/en.json`'a aynı anahtarla ekle (tipler `global.d.ts` ile kontrol edilir).
- **Yeni ürün / çözüm / hesaplama aracı:** ilgili `config/*.ts` dosyasına kayıt (`id`, `slug: { tr, en }`, `keyword`) +
  `messages/*.json` → `pages.<id>` metinleri. Menü, footer, breadcrumb, sitemap ve route otomatik güncellenir.
  Meta kuralları: title (marka eki dahil) 50–60, description 140–160 karakter.
- **Yeni statik sayfa:** `app/[locale]/<tr-yol>/page.tsx` + `i18n/routing.ts` → `pathnames` + `config/navigation.ts` → `PAGES`.
- **Yeni bayi:** `config/dealers.ts` → `DEALERS`'a kayıt (`provinceCode` = plaka kodu). Haritada boyama,
  `/bayiler/[il]` sayfası ve sitemap kaydı otomatik oluşur. Bilinmeyen alan boş bırakılır.
- **Fiyatlar / paketler:** `config/pricing.ts` (fiyat, paket içerikleri) + `messages/*.json` → `pricingPage`.
- **Yasal metinler:** `content/{tr,en}/legal/<tr-slug>.mdx`; şirket bilgileri `config/legal.ts` → `LEGAL_ENTITY`
  (son güncelleme tarihi `updatedAt`). İçindekiler H2 başlıklarından üretilir.
- **Formlar (demo, iletişim, bayilik, hesap silme):** `lib/forms/` (zod şemaları, Server Action, SMTP). E-posta
  `CONTACT_TO`'ya, hesap silme talepleri `LEGAL_ENTITY.kvkkEmail`'e gider. SMTP tanımlı değilse geliştirmede
  e-posta konsola yazılır, production'da form hata döner. JS kapalıyken de çalışır.
- **Staging:** `NEXT_PUBLIC_SITE_ENV=staging` → tüm sayfalar `noindex`, robots.txt `Disallow: /`, sitemap boş.

## Üçüncü taraf lisansları

- **Türkiye illeri haritası** (`components/dealers/turkey-map-data.ts`): path verisi
  [turkey-map-react](https://github.com/erdigokce/turkey-map-react) 2.4.3 paketinden alındı
  (MIT, © 2020 Erdi Gökçe; path'ler [dnomak/svg-turkiye-haritasi](https://github.com/dnomak/svg-turkiye-haritasi), MIT).
  Paket bağımlılık olarak eklenmedi; yalnızca veri kopyalandı, noktalar tam sayıya yuvarlandı.

## Yayın

`npm run build` → `.next/standalone` + `.next/static` + `public` sunucuya kopyalanır, pm2 ile `node server.js` (detaylar Faz 9).

> **Dil yönlendirmesi neden proxy'de değil:** next-intl proxy'si iç rewrite'ı mutlak URL olarak yazar; standalone `server.js` sunucu adı ya da `127.0.0.1` ile başlatıldığında bu dış istek sayılır ve `ERR_TOO_MANY_REDIRECTS` oluşur. Bu yüzden eşlemeler `i18n/url-rules.ts` ile `next.config.ts` içinde yapılır; sunucuda `HOSTNAME` ayarı gerekmez. `proxy.ts` geri eklenmemeli. `i18n/routing.ts` next.config tarafından da yüklendiği için içindeki importlar göreli olmalı (`@/` takma adı orada çözülmez). Örnek pm2 ayarı: `ecosystem.config.cjs` (port 3002).
