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
app/[locale]/        Sayfalar (TR öneksiz, EN /en)
components/layout/   Container, Section, ThemeToggle, LocaleSwitcher …
components/mockups/  BrowserFrame, PhoneFrame, ToastCard, QrPoster
components/sections/ Marquee …
components/ui/       shadcn bileşenleri
config/site.ts       Site URL, panel URL, mağaza linkleri
i18n/                next-intl routing (pathnames), request, navigation
messages/            tr.json / en.json (UI metinleri)
proxy.ts             next-intl locale yönlendirmesi (Next 16'da middleware → proxy)
public/logos         logo-pri (açık zemin), logo-sec (koyu zemin)
public/screenshots   Maskeli ekran görüntüleri (admin, mobile)
```

## Kurallar (özet)

- **Renkler sadece token:** `app/globals.css` içindeki `:root` / `.dark` değişkenleri. Bileşenlerde hex, `bg-white` vb. kullanılmaz.
- **Metinler sadece `messages/*.json` veya MDX:** yeni anahtar TR ve EN'e birlikte eklenir.
- **Linkler `@/i18n/navigation`'daki `Link` ile:** dile özel URL'ler `i18n/routing.ts` → `pathnames`.
- **Görseller `next/image` + statik import.** Next 16'da `priority` kaldırıldı; ekranın üstündeki görsellerde `loading="eager"` / `fetchPriority="high"` (bileşenlerde `aboveFold` prop'u).
- **Döngüsel animasyonlar CSS ile**, hepsi `prefers-reduced-motion`'da durur.

## İçerik ekleme

- **Yeni UI metni:** `messages/tr.json` ve `messages/en.json`'a aynı anahtarla ekle (tipler `global.d.ts` ile kontrol edilir).
- **Yeni sayfa:** `app/[locale]/<tr-yol>/page.tsx` + `i18n/routing.ts` → `pathnames` içine `{ tr, en }` eşlemesi.

## Yayın

`npm run build` → `.next/standalone` + `.next/static` + `public` sunucuya kopyalanır, pm2 ile `node server.js` (detaylar Faz 9).
