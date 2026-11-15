# QR Zaman – Tanıtım Web Sitesi (qrz-web)

Bu doküman, `qrzaman.com.tr` için sıfırdan yazılacak Next.js tanıtım sitesinin brifidir.
Ürünün tüm özellikleri `docs/ozellikler.md` dosyasındadır. Sitedeki tüm metinlerin kaynağı bu dosyadır.
Onaylı tasarım 4. bölümde, tüm site için SEO kuralları 6. bölümde, iş planı 7. bölümde (fazlar) anlatılır.
**Fazlar sırayla yapılır. Her fazın sonunda dur, yapılanları ve kabul kriterlerinin sonucunu özetle, onayımı bekle. Onay gelmeden sonraki faza geçme.**

> **Kural:** Sitenin hiçbir yerinde "Yakında", "Coming soon", "Çok yakında" gibi ibareler kullanılmaz. Tüm özellikler mevcut özellik olarak anlatılır.

---

## 1. Ürün özeti

**QR Zaman**, işletmelerin personel, zaman, bordro ve müşteri süreçlerini tek platformda yöneten bir SaaS ürünüdür. Personel, iş yerindeki QR kodu telefonundan okutarak giriş-çıkış yapar. Bu kayıtlar otomatik olarak puantaja ve bordroya dönüşür.

### qrz-admin: Web paneli (`https://app.qrzaman.com.tr`)
- Next.js 16 (App Router) + Tailwind v4 + shadcn/ui, kendi sunucumuzda çalışıyor.
- **Bordro Yönetimi modülü:** Personel, Lokasyon & QR, PDKS ve vardiyalar, Puantaj ve mesai çizelgesi, Bordro hesaplama, Eklenti/Kesinti, İzin ve Avans (talep → onay akışı), Özlük, İK Belgeleri, Raporlar, Ayarlar.
- **CRM modülü:** Kişiler, Satışlar, Teklifler, Görevler, Raporlar.
- **Ortak alanlar:** Grup → Şirket → Şube → Bölüm hiyerarşisi, kullanıcı ve yetki yönetimi, yıl bazlı SGK/vergi mevzuat parametreleri, takvim, destek talepleri.
- Roller: Admin, Yönetici, Personel, Bayi (iş ortağı). Her role özel dashboard, Excel/PDF/Word dışa aktarma, açık/koyu tema.

### qrz-mobile: Mobil uygulama ("QR Zaman", iOS + Android)
- Expo / React Native, bundle id `com.qrzaman.qrzmobile`.
- **QR ile giriş-çıkış:** konum doğrulama, sahte GPS tespiti, cihaz eşleştirme.
- Personel: izin ve avans talebi, bordro, puantaj, PDKS kayıtları, özlük ve profil bilgileri.
- Yönetici: talepleri onaylama/reddetme, personel listeleri, sahada tek dokunuşla lokasyon (QR noktası) kaydetme.

### Bu proje: qrz-web
- Admin'den **tamamen bağımsız** bir Next.js projesi. Sebepleri: farklı domain, auth proxy'nin karışmaması, statik ve hafif site, bağımsız deploy.
- Mevcut WordPress sitesinin yerini alır. `app.qrzaman.com.tr`'ye dokunulmaz.
- Hedef: idenfit.com benzeri, kurumsal ve SEO odaklı bir SaaS tanıtım sitesi.

---

## 2. Teknolojiler

> ⚠️ Next.js 16 kullanılıyor. API'ler eğitim verindeki sürümden farklı olabilir (ör. `middleware.ts` → `proxy.ts`). **Kod yazmadan önce `node_modules/next/dist/docs/` altındaki ilgili rehberi oku.** `next-intl` ve diğer kütüphanelerde de kurulu sürümün dokümanına bak, ezbere yazma.

| Konu | Seçim | Not |
|---|---|---|
| Framework | **Next.js 16.2.x** (App Router, TypeScript strict, `src/` yok) | Admin ile aynı sürüm. Sayfalar varsayılan olarak Server Component + statik üretim (SSG). |
| UI | React 19.2 | |
| Stil | **Tailwind CSS v4** + **shadcn/ui** | `../qrz-admin/components.json` referans alınır. |
| Tasarım token'ları | `app/globals.css` içinde `:root` / `.dark` CSS değişkenleri + Tailwind v4 `@theme` | Değerler 4.2'deki onaylı paletten gelir. Bileşenlerde hardcoded renk (`bg-white`, hex) yasak, sadece token'lar. |
| Font | `next/font/google` ile **Inter** (tek font; metin 400–600, başlıklar 700–800) | Noktalı harflerde (i, ı, İ, ş, ğ, ö, ü) yuvarlak nokta bilinçli bir tercihtir; nokta şekli kare olan fontlar kullanılmaz. Build sırasında self-host edilir, `display: swap`, `latin-ext` alt kümesi (Türkçe karakterler). Başlıklarda `letter-spacing: -0.02em`. |
| Tema | `next-themes` (`attribute="class"`, `defaultTheme="system"`) | Açık / koyu / sistem. Tema butonu footer'dadır. |
| Çok dil | **`next-intl`** (`app/[locale]`, TR varsayılan ve öneksiz, EN `/en`) | `pathnames` ile dile özel slug'lar (`/urunler` ↔ `/en/products`). |
| İçerik | UI metinleri `messages/{tr,en}.json`, uzun içerik (blog, yasal) MDX | MDX için `@next/mdx` + frontmatter eklentisi. Kurulu sürümün dokümanına göre seçilir. |
| SEO | Next Metadata API, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, JSON-LD (`schema-dts` tipleriyle) | Navbar için 3.2, tüm site için 6. bölüm. |
| Görsel | `next/image` (AVIF/WebP) + `sharp` | |
| Animasyon | `motion` + saf CSS keyframes | Sürekli dönen döngüler (ekran geçişi, tarama çizgisi, kayan şerit) CSS ile; kaydırınca giriş efektleri `motion` ile. `prefers-reduced-motion`'a saygı duyar. Detay 4.5. |
| İkon | `lucide-react` | Admin ile aynı ikon seti. |
| Form | `react-hook-form` + `zod` 4 + Server Action, `nodemailer` (SMTP) | |
| Bildirim | `sonner` | |
| Kalite | ESLint (Next config), Prettier, `.editorconfig` | |
| Barındırma | `output: "standalone"` + pm2, önünde reverse proxy (nginx/IIS) | |

---

## 3. Navbar (SEO uyumlu)

idenfit.com yapısı örnek alınır: 5 ana menü, "Ürünler" mega menü, sağda giriş ve demo CTA'sı. Dil ve tema seçicileri footer'dadır.

### 3.1 Yapı

```
[Logo]  Ürünler ▾  Çözümler ▾  Fiyatlandırma  Kaynaklar ▾  Kurumsal ▾      [Giriş Yap] [Demo Talep Et]
```

#### Ürünler (mega menü, 5 kolon + tanıtım kartı)
Her öğe: ikon + başlık + tek satır açıklama. Linkler `/urunler/[slug]` sayfalarına gider. Kolon başlıkları link değildir. Menü adı, URL (`/urunler`), breadcrumb ve sayfa başlıkları aynı kelimeyi kullanır: **Ürünler**.

> **Genişleme:** İleride yeni ürünler eklenecek (ör. Ön Muhasebe, POS, Stok). Yeni ürün = `config/products.ts`'e kayıt + menüye yeni kolon veya öğe. URL yapısı (`/urunler/[slug]`) değişmez. Hazır olmayan ürün menüde ve sitemap'te gösterilmez ("Yakında" kuralı).

| Kolon | Öğe | TR yol | EN yol |
|---|---|---|---|
| **Zaman & Devam Takibi** | QR Kodlu PDKS | `/urunler/qr-kodlu-pdks` | `/en/products/qr-code-attendance` |
| | Vardiya Yönetimi | `/urunler/vardiya-yonetimi` | `/en/products/shift-management` |
| | Puantaj ve Mesai | `/urunler/puantaj` | `/en/products/timesheet` |
| | Lokasyon & QR Noktaları | `/urunler/lokasyon-takibi` | `/en/products/location-tracking` |
| **İnsan Kaynakları** | Personel Yönetimi | `/urunler/personel-yonetimi` | `/en/products/employee-management` |
| | Özlük Dosyası | `/urunler/ozluk-dosyasi` | `/en/products/employee-records` |
| | İzin Yönetimi | `/urunler/izin-yonetimi` | `/en/products/leave-management` |
| | Avans Yönetimi | `/urunler/avans-yonetimi` | `/en/products/salary-advance` |
| | İK Belgeleri | `/urunler/ik-belgeleri` | `/en/products/hr-documents` |
| **Bordro & Raporlama** | Bordro Hesaplama | `/urunler/bordro` | `/en/products/payroll` |
| | Ek Ödeme & Kesintiler | `/urunler/ek-odeme-ve-kesinti` | `/en/products/earnings-and-deductions` |
| | Mevzuat Uyumu (SGK/Vergi) | `/urunler/mevzuat-uyumu` | `/en/products/compliance` |
| | Raporlama | `/urunler/raporlama` | `/en/products/reporting` |
| **CRM** | Müşteri & Kişi Yönetimi | `/urunler/musteri-yonetimi` | `/en/products/contact-management` |
| | Satış Takibi | `/urunler/satis-takibi` | `/en/products/sales-tracking` |
| | Teklif Yönetimi | `/urunler/teklif-yonetimi` | `/en/products/quote-management` |
| | Görev Yönetimi | `/urunler/gorev-yonetimi` | `/en/products/task-management` |
| **Platform** | Mobil Uygulama | `/urunler/mobil-uygulama` | `/en/products/mobile-app` |
| | Çoklu Şirket & Şube | `/urunler/coklu-sirket-sube` | `/en/products/multi-company` |
| | Rol & Yetki Yönetimi | `/urunler/yetki-yonetimi` | `/en/products/roles-and-permissions` |
| | Dashboard & Takvim | `/urunler/dashboard` | `/en/products/dashboard` |

- **Tanıtım kartı (sağda):** "Mobil uygulamayı indir" + App Store / Google Play rozetleri, altında "Tüm ürünler →" (`/urunler` ↔ `/en/products`).

#### Çözümler (dropdown, 2 kolon)
| Kolon | Öğe | TR yol | EN yol |
|---|---|---|---|
| **Rollere göre** | İşletme Sahipleri & Yöneticiler | `/cozumler/yoneticiler` | `/en/solutions/managers` |
| | İK & Bordro Ekipleri | `/cozumler/ik-ve-bordro` | `/en/solutions/hr-and-payroll` |
| | Çalışanlar | `/cozumler/calisanlar` | `/en/solutions/employees` |
| **Sektörlere göre** | Perakende & Mağazacılık | `/cozumler/perakende` | `/en/solutions/retail` |
| | Üretim & Fabrika | `/cozumler/uretim` | `/en/solutions/manufacturing` |
| | İnşaat & Saha Ekipleri | `/cozumler/insaat-ve-saha` | `/en/solutions/construction-and-field` |
| | Restoran & Hizmet | `/cozumler/restoran-ve-hizmet` | `/en/solutions/hospitality` |
| | Sağlık | `/cozumler/saglik` | `/en/solutions/healthcare` |
| | Eğitim | `/cozumler/egitim` | `/en/solutions/education` |
| | Çok Şubeli İşletmeler | `/cozumler/cok-subeli-isletmeler` | `/en/solutions/multi-branch` |

> Sektör listesi önerisidir. Faz 2'den önce bana teyit ettir.

#### Fiyatlandırma (tek link)
`/fiyatlandirma` ↔ `/en/pricing`

#### Kaynaklar (dropdown)
| Kolon | Öğe | TR yol | EN yol |
|---|---|---|---|
| **İçerik** | Blog | `/blog` | `/en/blog` |
| | Sıkça Sorulan Sorular | `/sss` | `/en/faq` |
| | Destek | `/destek` | `/en/support` |
| **Hesaplama Araçları** | Net-Brüt Maaş Hesaplama | `/hesaplama/net-brut-maas` | `/en/calculators/salary` |
| | Kıdem Tazminatı Hesaplama | `/hesaplama/kidem-tazminati` | `/en/calculators/severance-pay` |
| | İhbar Tazminatı Hesaplama | `/hesaplama/ihbar-tazminati` | `/en/calculators/notice-pay` |
| | Fazla Mesai Hesaplama | `/hesaplama/fazla-mesai` | `/en/calculators/overtime` |
| | İşveren Maliyeti Hesaplama | `/hesaplama/isveren-maliyeti` | `/en/calculators/employer-cost` |
| | Yıllık İzin Hesaplama | `/hesaplama/yillik-izin` | `/en/calculators/annual-leave` |

> Hesaplama araçları organik trafiğin ana kaynağıdır ve ürünün bordro yeteneğini kanıtlar. Faz 2'de sayfalar başlık ve açıklamayla oluşturulur, hesap mantığı Faz 6'da yazılır.

#### Kurumsal (dropdown)
| Öğe | TR yol | EN yol |
|---|---|---|
| Hakkımızda | `/hakkimizda` | `/en/about` |
| Bayilerimiz | `/bayiler` | `/en/dealers` |
| İş Ortaklığı (Bayilik) | `/is-ortakligi` | `/en/partners` |
| İletişim | `/iletisim` | `/en/contact` |
| Güvenlik & KVKK | `/guvenlik` | `/en/security` |

#### Sağ taraf
Header'da yalnızca iki öğe bulunur. Dil seçici ve tema butonu header'a **konmaz**.
- **Giriş Yap:** `https://app.qrzaman.com.tr/login` (harici link, `rel="nofollow noopener"`).
- **Demo Talep Et** (birincil CTA butonu): `/demo-talep` ↔ `/en/request-demo`.

#### Dil ve tema (footer'da)
- **Dil seçici (TR · EN):** Footer'ın alt satırında durur. Aynı sayfanın diğer dildeki karşılığına geçer (`next-intl` pathnames). Arama motorları dil sürümlerini bu butondan değil, `<head>` içindeki hreflang etiketlerinden bulur.
- **Tema butonu (ay/güneş ikonu):** Footer'ın alt satırında, sosyal medya ikonlarının yanında durur. Açık / koyu / sistem arasında geçiş yapar.
- **Varsayılan tema:** `system`. Site ilk açılışta cihazın açık/koyu ayarını kullanır; kullanıcının seçimi `next-themes` tarafından saklanır.

#### Mobil (< 1024px)
Hamburger → tam ekran panel. Ana menüler accordion olarak açılır. Altta sabit alanda Giriş Yap ve Demo Talep Et butonları ile bunların üstünde "TR · EN" ve "Tema: Sistem" seçicileri durur.

### 3.2 SEO kuralları (navbar)
1. **Tek kaynak:** Menü `config/navigation.ts` içindeki typed config'ten üretilir. Aynı config `sitemap.ts`, footer, breadcrumb ve `BreadcrumbList` JSON-LD tarafından da kullanılır. Menüde olan her sayfa sitemap'te yer alır, menüde olmayan sayfa sitemap'e eklenmez.
2. **Linkler ilk HTML'de bulunur:** Header bir Server Component'tir. Sadece açma/kapama mantığı küçük client bileşenlerdedir. Mega menü ve mobil menü içerikleri kapalıyken de DOM'da bulunur (Radix `NavigationMenu` / `Sheet` kullanılıyorsa `forceMount` + CSS ile gizleme). Ayrıca footer tüm linkleri içerir.
3. **Gerçek `<a href>`:** Navigasyon `next-intl`'in `Link` bileşeniyle yapılır. `onClick` + `router.push` ile link kurulmaz. Hiçbir iç linke `nofollow` eklenmez.
4. **Semantik yapı:** `<header>` › `<nav aria-label="Ana menü">` › `<ul>/<li>`. Açılır menü tetikleyicileri `<button aria-expanded aria-controls>` olur. Aktif sayfada `aria-current="page"` kullanılır. Sayfanın en başında "İçeriğe geç" (skip link) bulunur.
5. **Anahtar kelimeli anchor metinleri:** "QR Kodlu PDKS", "Bordro Hesaplama" gibi aranan terimler kullanılır. Açıklamalar `messages/*.json`'dan gelir ve sayfanın `description`'ıyla tutarlı olur.
6. **Dile özel URL'ler:** Tüm hrefler `next-intl` `pathnames` ile çözülür. Her sayfada `alternates.languages` (tr, en, x-default) bulunur. Dil query parametresi (`?lang=`) kullanılmaz.
7. **Performans ve CLS:** Header yüksekliği sabittir (sticky, layout shift yok). Logo `next/image` + `priority` ile yüklenir. Menü ikonları tree-shake edilir.
8. **Kırık link yok:** Menüdeki her yol Faz 2'de gerçek bir sayfa olarak oluşturulur (bkz. 5. bölüm).

### 3.3 Config tipi (öneri)

```ts
// config/navigation.ts
import type { LucideIcon } from "lucide-react";
import type { AppPathname } from "@/i18n/routing";

export type NavLink = {
  id: string;              // messages: nav.<id>.title / nav.<id>.description
  href: AppPathname;       // next-intl pathnames anahtarı (TR yol)
  icon?: LucideIcon;
};

export type NavGroup = { id: string; href?: AppPathname; items: NavLink[] };

export type NavItem =
  | { type: "link"; id: string; href: AppPathname }
  | { type: "mega" | "dropdown"; id: string; groups: NavGroup[] };

export const MAIN_NAV: NavItem[] = [/* Ürünler, Çözümler, Fiyatlandırma, Kaynaklar, Kurumsal */];
export const PANEL_LOGIN_URL = "https://app.qrzaman.com.tr/login";
```

Ürün ve çözüm sayfalarının içerik verisi `config/products.ts` ve `config/solutions.ts` dosyalarında (slug, ikon, kategori, ilgili özellikler) durur. Navigasyon bu dosyalardan beslenir.

---

## 4. Tasarım (onaylı)

### 4.1 Referans dosyalar
Onaylı tasarımlar `docs/tasarim/` altındadır. Görselleri `docs/images/` klasöründen gösterir; tarayıcıda açılıp incelenebilir. Bunlar **referanstır**, siteye kopyalanmaz. Bileşenler Tailwind + token'larla yeniden yazılır.

| Dosya | İçerik |
|---|---|
| `ana-sayfa-acik.html` | Ana sayfa, açık tema. Bölüm sırası ve içerik **bu dosyaya göre** kurulur. |
| `ana-sayfa-koyu.html` | Koyu tema örneği. Koyu renk paleti ve kart görünümü buradan alınır. Koyu temada sayfa düzeni açık temayla **aynıdır**; sadece token'lar değişir. |
| `urun-sayfasi.html` | Ürün sayfası şablonu (örnek: QR Kodlu PDKS). Tüm `/urunler/[slug]` sayfaları bu şablonu kullanır. |
| `navbar-menuler.html` | Ürünler mega menü, Çözümler, Kaynaklar ve Kurumsal açılır menülerinin açık hali. |
| `footer.html` | Footer: CTA bandı, marka ve iletişim bloğu, 4 link kolonu, alt satır (yasal linkler, sosyal ikonlar, tema butonu, TR · EN). |
| `mobil-ana-sayfa.html` | Ana sayfanın 390px görünümü. |
| `mobil-menu.html` | Açık hamburger menü (accordion, altta dil/tema ve CTA'lar). |

### 4.2 Renk paleti ve token'lar

| Token | Açık | Koyu | Kullanım |
|---|---|---|---|
| `--background` | `#FFFFFF` | `#050E1F` | Sayfa zemini |
| `--surface` | `#EAF2FB` | `#0A1730` | Bölüm zemini, açık kartlar |
| `--card` | `#FFFFFF` | `#13243F` | Kartlar |
| `--border` | `#DCE5F0` | `#1F3558` | Çizgiler, kart kenarları |
| `--foreground` | `#0B1B33` | `#FFFFFF` | Başlık ve ana metin |
| `--muted-foreground` | `#4B5B73` | `#9FB0C8` | İkincil metin |
| `--primary` | `#1D4ED8` | `#1D4ED8` | Birincil buton, link, ikon zemini |
| `--accent` | `#7FB0FF` | `#7FB0FF` | Vurgulu başlık kelimeleri (koyu zeminde), çizgiler |
| `--navy` | `#071A3A` | `#071A3A` | Hero, footer, koyu bantlar |

- Hero zemini: `radial-gradient(ellipse 60% 70% at 85% 30%, #12336B 0%, #071A3A 60%)`.
- Durum renkleri: başarı `#DCFCE7` / `#15803D`, bekleyen `#FEF3C7` / `#B45309`.
- Köşe yuvarlaklıkları: buton 12px, kart 16–24px, telefon çerçevesi 40px.

### 4.3 Logo ve görseller
- **Açık zeminde** `logo-pri` kullanılır (lacivert + camgöbeği). **Koyu zeminde** (hero, footer, koyu tema) `logo-sec` kullanılır (beyaz + camgöbeği). Kaynak: `docs/images/logos/`. SVG sürümleri tercih edilir.
- Ekran görüntüleri `docs/images/admin-temiz/` ve `docs/images/mobile-temiz/` altındadır. TC, telefon ve e-posta alanları maskelenmiştir. **Maskesiz `admin/` ve `mobile/` klasörleri asla kullanılmaz.**
- Görseller `public/screenshots/{admin,mobile}/` altına kopyalanır, `next/image` ile verilir. Admin görselleri tarayıcı çerçevesi, mobil görseller telefon çerçevesi içinde gösterilir.
- ⚠️ Yayına çıkmadan önce: admin görsellerinde gerçek personel/şirket isimleri, A4 QR afişinde çalışan bir QR kodu var. Demo verili görsellerle değiştirilecek (bkz. Faz 9).

### 4.4 Ana sayfa bölümleri (sırasıyla)
1. **Hero (lacivert):**
   - Sol: rozet, H1 "Personel takibinin akıllı yolu.", açıklama, "Ücretsiz Demo Talep Et" + "Özellikleri Keşfet" butonları, App Store / Google Play rozetleri.
   - Sağ: tarayıcı çerçevesinde yönetici paneli, önünde ekranları değişen telefon, sırayla beliren 3 bildirim kartı ("Mesai başladı", "Konum doğrulandı", "Onay bekliyor").
   - Sağ alt: eğik A4 QR afişi (tarama çizgisi animasyonlu) ve "OKUT · KAYDET · BORDRO HAZIR" yazılı dönen rozet.
2. **Kayan özellik şeridi:** QR Kodlu PDKS, Sahte GPS tespiti, Vardiya, Puantaj, Bordro, İzin & Avans, A4 QR Afişi, Excel İçe Aktarım, Çoklu Şirket & Şube, CRM.
3. **Referanslar ve rakamlar:** müşteri logoları ve 4 rakam (şirket, personel, günlük okutma, il). Gerçek veri gelene kadar `TODO`.
4. **Tek platform:** 5 kategori kartı (Zaman & Devam, İnsan Kaynakları, Bordro & Raporlama, CRM, Platform), her biri kendi özellik linkleriyle.
5. **Özellik bölümleri** (metin + görsel, sırayla yer değiştirir): PDKS, Lokasyon & QR, Puantaj, Bordro, İzin & Avans, Çoklu Şirket & Şube.
6. **Mobil uygulama:** "QR okut, mesain başlasın." + 6 telefonluk galeri.
7. **Nasıl çalışır:** "Okut. Kaydet. Bordro hazır." 4 adım.
8. **Hesaplama araçları + SSS:** 6 araç linki ve 5 soruluk akordiyon (`FAQPage` JSON-LD).
9. **Footer.**

### 4.5 Hareket (motion) planı
- Hero telefonu: ekranlar 4 sn'de bir yumuşak geçişle değişir (Ana sayfa → QR okut → İzinler). Bildirim kartları ekranla eşzamanlı belirir.
- Telefonlar ve QR afişi yavaşça süzülür (6 sn döngü).
- A4 QR afişinde parlayan tarama çizgisi aşağı-yukarı gezer, yanındaki rozet döner.
- Özellik şeridi yatay olarak sürekli kayar.
- Bölümler kaydırınca 16px aşağıdan belirir, kartlar 60 ms arayla sırayla gelir.
- Rakamlar görünür olunca 0'dan sayar.
- Kartlar hover'da 4px yükselir.
- `prefers-reduced-motion` açıksa tüm animasyonlar kapanır; ilk ekran ve ilk bildirim sabit görünür.
- Animasyonlar CLS üretmez, yalnızca `transform` ve `opacity` kullanır.

### 4.6 Tasarımı henüz olmayan sayfalar
Aşağıdaki sayfaların hazır tasarımı yoktur. İlgili faza gelindiğinde netleştirilir:

| Sayfa | Faz | Not |
|---|---|---|
| `/urunler` (tüm ürünler) | 4 | Kategori bazlı liste |
| Çözümler (rol + sektör) ve `/cozumler` | 5 | Sektör listesi önce onaylanır |
| Hesaplama araçları ve `/hesaplama` | 6 | Form + sonuç tablosu düzeni |
| SSS, Destek | 6 | |
| Fiyatlandırma | 7 | Paket yapısı ve fiyatlar bende |
| Hakkımızda, İş Ortaklığı, İletişim, Güvenlik & KVKK, Demo Talep | 7 | Form düzenleri |
| Bayilerimiz (`/bayiler`, `/bayiler/[il]`) | 7 | Kurallar 4.7'de. Bölüm planı yine onaya sunulur |
| Yasal sayfalar, Hesap Silme | 7 | Sade metin sayfası |
| Blog liste ve yazı detayı | 8 | |
| 404 | 2 | |

**Bu sayfalar için çalışma şekli:**
1. Koda geçmeden önce sayfanın **bölüm planını** bana sun: bölümlerin sırası, her bölümde ne olacağı, hangi mevcut bileşenin kullanılacağı, varsa ekran görüntüsü. Kısa bir liste yeterli.
2. Onayımdan sonra yaz. Onay gelmeden tasarımı olmayan bir sayfanın gövdesini kodlama (Faz 2'deki başlık + açıklama + breadcrumb iskeleti hariç).
3. Yeni bir görsel dil icat etme: 4.2'deki renkler, Inter, mevcut bileşenler (`Section`, kartlar, `BrowserFrame`, `PhoneFrame`, akordiyon, CTA bandı) ve ana sayfa/ürün sayfasındaki boşluk ve köşe ölçüleri kullanılır.
4. Yeni bir bileşen gerekiyorsa (ör. fiyat tablosu, hesaplama formu) önce ne olacağını söyle.
5. Sayfa bittikten sonra açık ve koyu temada, masaüstü ve 390px genişlikte ekran görüntüsü alıp bana göster.

### 4.7 Bayi haritası sayfası (`/bayiler`)
Bayilerin il bazında adres ve iletişim bilgileri, Türkiye haritası üzerinde gösterilir. Bayisi olan iller farklı renkte boyanır, iller hover/tıklama ile incelenir.

**Konum ve linkler**
- Menü: Kurumsal › "Bayilerimiz", "İş Ortaklığı (Bayilik)"in hemen üstünde.
- URL: `/bayiler` ↔ `/en/dealers`. İl detayı: `/bayiler/[il]` ↔ `/en/dealers/[il]` (ör. `/bayiler/istanbul`). İl slug'ları iki dilde de aynıdır.
- İl sayfaları **sadece bayisi olan iller** için üretilir (yerel SEO: "Ankara PDKS bayi"). Bayisi olmayan il 404 verir ve sitemap'e girmez.
- Çapraz linkler: `/iletisim` → "Size en yakın bayiyi bulun". `/is-ortakligi` ↔ `/bayiler` iki yönlü. Footer'da da link bulunur.

**Veri (`config/dealers.ts`, typed, kodla yönetilir)**
```ts
export type Dealer = {
  id: string;
  name: string;                 // Firma adı
  provinceCode: number;         // Plaka kodu (1–81), config/provinces.ts ile eşleşir
  district?: string;            // İlçe
  address: string;
  phone: string;                // E.164 (+90...), ekranda formatlı
  email?: string;
  website?: string;
  mapsUrl?: string;             // Google Maps linki
  coordinates?: { lat: number; lng: number };
  isHeadquarters?: boolean;     // Merkez / bölge müdürlüğü rozeti
  servesProvinces?: number[];   // Hizmet verdiği diğer iller (haritada açık tonla boyanır)
};
export const DEALERS: Dealer[] = []; // Gerçek liste bende. Gelene kadar TODO, uydurma
```
`config/provinces.ts`: 81 il, `{ code, slug, name }` (ör. `{ code: 34, slug: "istanbul", name: "İstanbul" }`). SVG path id'leri plaka kodu ile eşleşir.

**Harita**
- 81 ilin SVG'si **inline** ve Server Component içinde render edilir (ilk HTML'de bulunur, JS'siz de görünür). Harici harita kütüphanesi (Leaflet, Mapbox, Google Maps) kullanılmaz.
- SVG kaynağı açık lisanslı olmalı (ör. Wikimedia Commons'taki Türkiye illeri haritası veya MIT/CC lisanslı bir paket). Lisansı README'ye yaz, ücretli lisanslı kaynak kullanma. Path'ler SVGO ile optimize edilir, hedef boyut < 150 KB.
- Renkler yalnızca token ile verilir:
  - bayi yok → `fill-muted`, `stroke-border`
  - bayi var → `fill-primary`
  - sadece hizmet verilen il → `fill-primary/35`
  - hover/focus → bir ton koyu + `stroke-foreground`
  - seçili il → `fill-primary` + kalın kontur
  - Açık ve koyu temada kontrast kontrol edilir. Haritanın altında küçük bir lejant bulunur.
- **Etkileşim** (küçük client bileşeni, sadece olay yönetimini yapar):
  - Masaüstünde hover → imleci takip eden tooltip: il adı + "3 bayi" / "Bayi yok"
  - Tıklama → sağdaki (mobilde alttaki) panelde o ilin bayi kartları açılır, URL `?il=istanbul` ile güncellenir (paylaşılabilir). Paneldeki "Tüm bilgiler" linki `/bayiler/[il]`'e gider.
  - Bayisi olmayan il tıklanırsa: "Bu ilde henüz bayimiz yok. En yakın bayiler: …" (koordinata göre en yakın 3 bayi) + "Bayimiz olun" → `/is-ortakligi`
  - Mobilde hover yoktur, dokunma seçim yapar. Harita yatayda kaydırılmaz, genişliğe sığar. Üstte "İl seçin" arama/combobox'ı (cmdk) bulunur.
- **Erişilebilirlik:** Bayisi olan her il `<a href="/bayiler/[il]" aria-label="İstanbul, 3 bayi">` ile sarılır ve klavyeyle Tab ile gezilebilir. Diğer iller `role="img"` + `aria-label` alır. Haritanın yanında aynı bilgiyi içeren düz bir liste bulunur (ekran okuyucu ve SEO için).

**Sayfa düzeni**
1. Başlık + kısa açıklama + toplam rakamlar ("X ilde Y bayi", config'ten hesaplanır)
2. Harita (solda, geniş) + seçili il paneli (sağda). Mobilde alt alta.
3. "Tüm bayiler" listesi: il bazında gruplu, alfabetik, arama kutusuyla filtrelenir.
4. CTA bandı: "Bölgenizde bayi olmak ister misiniz?" → `/is-ortakligi`

**Bayi kartı:** firma adı, il/ilçe, adres, `tel:` linkli telefon, `mailto:` e-posta, web sitesi (`rel="noopener"`), "Yol tarifi" (mapsUrl), merkez rozeti.

**İl sayfası (`/bayiler/[il]`):** `generateStaticParams` ile yalnızca bayisi olan iller üretilir. H1 "İstanbul QR Zaman Bayileri" olur. Sayfada bayi kartları, küçük harita (ilgili il vurgulu), komşu illerdeki bayiler, `LocalBusiness` JSON-LD ve breadcrumb (Kurumsal › Bayilerimiz › İstanbul) bulunur.

**Boş durum:** `DEALERS` boşken sayfa kırılmaz. Harita gri görünür, "Bayi ağımız kuruluyor" mesajı ve İş Ortaklığı CTA'sı gösterilir.

---

## 5. Proje iskeleti

### 5.1 Dizin yapısı

```
qrz-web/
├─ app/
│  ├─ [locale]/
│  │  ├─ layout.tsx                    # <html lang>, ThemeProvider, NextIntlClientProvider, Header, Footer, skip link
│  │  ├─ page.tsx                      # Ana sayfa
│  │  ├─ not-found.tsx
│  │  ├─ urunler/
│  │  │  ├─ page.tsx                   # Tüm ürünler (kategori bazlı)
│  │  │  └─ [slug]/page.tsx            # generateStaticParams ← config/products.ts
│  │  ├─ cozumler/
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]/page.tsx            # ← config/solutions.ts
│  │  ├─ fiyatlandirma/page.tsx
│  │  ├─ blog/
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]/page.tsx            # ← content/{locale}/blog/*.mdx
│  │  ├─ sss/page.tsx
│  │  ├─ destek/page.tsx
│  │  ├─ hesaplama/
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]/page.tsx            # ← config/calculators.ts
│  │  ├─ hakkimizda/page.tsx
│  │  ├─ is-ortakligi/page.tsx
│  │  ├─ bayiler/
│  │  │  ├─ page.tsx                   # Türkiye haritası + bayi listesi (4.7)
│  │  │  └─ [il]/page.tsx              # generateStaticParams ← sadece bayisi olan iller
│  │  ├─ iletisim/page.tsx
│  │  ├─ guvenlik/page.tsx
│  │  ├─ demo-talep/page.tsx
│  │  ├─ yasal/[slug]/page.tsx         # kvkk, gizlilik-politikasi, kullanim-sartlari (MDX)
│  │  └─ hesap-silme/page.tsx          # Mağaza zorunluluğu (mobil hesap silme)
│  ├─ sitemap.ts                       # config/navigation + blog + yasal, iki dil, hreflang
│  ├─ robots.ts
│  ├─ opengraph-image.tsx
│  ├─ icon.png / apple-icon.png
│  └─ globals.css                      # 4.2'deki token'lar (:root / .dark) + @theme
├─ components/
│  ├─ layout/
│  │  ├─ header.tsx                    # Server Component
│  │  ├─ desktop-nav.tsx               # Mega menü / dropdown (client, forceMount)
│  │  ├─ mobile-nav.tsx                # Hamburger + accordion (client, forceMount)
│  │  ├─ nav-link.tsx                  # aria-current yönetimi
│  │  ├─ locale-switcher.tsx           # Footer ve mobil menüde
│  │  ├─ theme-toggle.tsx              # Footer ve mobil menüde
│  │  ├─ breadcrumbs.tsx               # Görsel breadcrumb + BreadcrumbList JSON-LD
│  │  ├─ skip-link.tsx
│  │  └─ footer.tsx                    # Tüm menü linkleri + yasal + mağaza rozetleri
│  ├─ seo/json-ld.tsx                  # Organization, SoftwareApplication, FAQPage, BlogPosting
│  ├─ sections/                        # hero, marquee, stats, category-grid, feature-split, mobile-gallery, steps, faq, cta
│  ├─ mockups/                         # browser-frame, phone-frame, toast-card, qr-poster
│  ├─ dealers/                         # turkey-map (SVG, server), map-interactions (client), dealer-card, dealer-list, province-combobox
│  └─ ui/                              # shadcn
├─ config/
│  ├─ navigation.ts                    # MAIN_NAV, FOOTER_NAV
│  ├─ products.ts                      # Ürün sayfaları (içerik docs/ozellikler.md'den)
│  ├─ solutions.ts
│  ├─ calculators.ts
│  ├─ dealers.ts                       # Bayi listesi (gerçek veri gelene kadar boş)
│  ├─ provinces.ts                     # 81 il: plaka kodu, slug, ad
│  └─ site.ts                          # Site URL, panel URL, mağaza linkleri, iletişim, sosyal (bilinmeyenler TODO)
├─ content/
│  ├─ tr/{blog,legal}/*.mdx
│  └─ en/{blog,legal}/*.mdx
├─ messages/
│  ├─ tr.json
│  └─ en.json
├─ i18n/
│  ├─ routing.ts                       # locales, defaultLocale "tr", localePrefix "as-needed", pathnames
│  ├─ request.ts
│  └─ navigation.ts                    # Link, redirect, usePathname, useRouter, getPathname
├─ lib/
│  ├─ seo.ts                           # buildMetadata({ locale, pathname, title, description }) → canonical + hreflang + OG
│  ├─ mdx.ts
│  └─ utils.ts
├─ public/
│  ├─ logos/                           # docs/images/logos'tan (logo-pri: açık zemin, logo-sec: koyu zemin)
│  ├─ screenshots/{admin,mobile}/      # docs/images/*-temiz'den (maskeli)
│  └─ badges/                          # App Store / Google Play
├─ proxy.ts                            # next-intl locale yönlendirmesi (Next 16 adlandırması)
├─ next.config.ts                      # output: "standalone", next-intl plugin, MDX, images
├─ .env.example                        # NEXT_PUBLIC_SITE_URL, SMTP_*, CONTACT_TO
├─ .prettierrc  .editorconfig  eslint.config.mjs
└─ README.md
```

### 5.2 `i18n/routing.ts` pathnames örneği

```ts
export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/urunler": { tr: "/urunler", en: "/products" },
    "/urunler/[slug]": { tr: "/urunler/[slug]", en: "/products/[slug]" },
    "/cozumler/[slug]": { tr: "/cozumler/[slug]", en: "/solutions/[slug]" },
    "/fiyatlandirma": { tr: "/fiyatlandirma", en: "/pricing" },
    "/hesaplama/[slug]": { tr: "/hesaplama/[slug]", en: "/calculators/[slug]" },
    "/demo-talep": { tr: "/demo-talep", en: "/request-demo" },
    "/bayiler": { tr: "/bayiler", en: "/dealers" },
    "/bayiler/[il]": { tr: "/bayiler/[il]", en: "/dealers/[il]" },
    // … 3. bölümdeki tüm yollar
  },
});
```

Dinamik segmentlerde slug'lar da dile özeldir (`qr-kodlu-pdks` ↔ `qr-code-attendance`). Slug eşlemesi `config/products.ts` içinde `{ tr, en }` olarak tutulur. `generateStaticParams` ve `LocaleSwitcher` bu eşlemeyi kullanır.

---

## 6. SEO (tüm site)

SEO bu projenin bir numaralı önceliğidir. Aşağıdaki kurallar **her sayfa ve her faz** için geçerlidir. 3.2'deki navbar kuralları bunlara ektir.

### 6.1 URL kuralları
- Küçük harf, kelimeler `-` ile ayrılır, Türkçe karakter yok (`ı→i`, `ş→s`, `ğ→g`, `ü→u`, `ö→o`, `ç→c`). Sonda `/` yok.
- Kısa ve anahtar kelimeli: `/urunler/qr-kodlu-pdks`, `/hesaplama/kidem-tazminati`. Tarih, ID veya `?` parametresi yok.
- Her içeriğin tek bir URL'si vardır. `www`'lu/`www`'suz ve `http` sürümleri 301 ile `https://qrzaman.com.tr`'ye yönlenir.
- Bir URL değişirse eski adres 301 ile yenisine yönlendirilir; asla 404'e düşmez.

### 6.2 Meta etiketleri (her sayfa)
- `lib/seo.ts` içindeki `buildMetadata()` ile üretilir; sayfalar `generateMetadata` kullanır.
- **title:** benzersiz, 50–60 karakter, ana anahtar kelime başta. Şablon: `%s | QR Zaman`. Ana sayfa: "QR Kodlu Personel Takip, PDKS ve Bordro Programı | QR Zaman" gibi.
- **description:** benzersiz, 140–160 karakter, sayfanın faydasını ve bir çağrı içerir.
- **canonical:** her sayfada kendi mutlak URL'si.
- **hreflang:** `alternates.languages` ile `tr`, `en` ve `x-default` (TR).
- **Open Graph + Twitter Card:** başlık, açıklama, `opengraph-image` (1200×630), `og:locale` (`tr_TR` / `en_US`).
- **robots:** varsayılan `index, follow`. 404, demo/iletişim "teşekkürler" ekranları ve arama sonuçları `noindex`.
- `metadataBase` = `NEXT_PUBLIC_SITE_URL`.

### 6.3 Sayfa içi yapı
- Her sayfada **tek H1**, ana anahtar kelimeyi içerir. Başlıklar sırayla iner (H1 › H2 › H3), atlama yok.
- Semantik HTML: `<header>`, `<nav>`, `<main>`, `<article>`, `<section aria-labelledby>`, `<footer>`.
- Ana içerik ilk HTML'de bulunur (Server Component + SSG). Akordiyon ve sekme içerikleri kapalıyken de DOM'dadır.
- Her görselin anlamlı, Türkçe ve anahtar kelimeli bir `alt` metni vardır. Süs görselleri `alt=""`.
- Görsel dosya adları açıklayıcıdır: `qr-kodlu-pdks-yonetim-paneli.webp`, `img_123.png` değil.

### 6.4 İç linkleme
- Her ürün sayfası en az 2 ilgili ürün sayfasına, ilgili çözüm sayfasına ve demo sayfasına link verir.
- Blog yazıları ilgili ürün ve hesaplama sayfalarına, hesaplama sayfaları ilgili ürün sayfasına (ör. Kıdem Tazminatı → Bordro) link verir.
- Anchor metinleri açıklayıcıdır ("QR kodlu PDKS'yi inceleyin"); "buraya tıklayın" kullanılmaz.
- Görsel breadcrumb + `BreadcrumbList` JSON-LD tüm alt sayfalarda bulunur.
- Yetim sayfa olmaz: her sayfaya menüden, footer'dan veya başka bir sayfadan en az bir link gelir.

### 6.5 Yapısal veri (JSON-LD, `schema-dts` tipleriyle)
| Sayfa | Şema |
|---|---|
| Tüm sayfalar | `Organization` (logo, iletişim, sosyal profiller), `WebSite` |
| Ana sayfa, ürün sayfaları | `SoftwareApplication` (applicationCategory: BusinessApplication, işletim sistemi: Web, iOS, Android; fiyat bilgisi gelince `offers`) |
| SSS içeren her sayfa | `FAQPage` |
| Alt sayfalar | `BreadcrumbList` |
| Blog yazıları | `BlogPosting` (yazar, yayın ve güncelleme tarihi, görsel) |
| İletişim | `LocalBusiness` veya `Organization` + `ContactPoint` |
| `/bayiler` | Bayilerin `ItemList`'i (her öğe `LocalBusiness`) |
| `/bayiler/[il]` | Bayi başına `LocalBusiness` (name, `PostalAddress`, telephone, email, url, `areaServed`) |

Uydurma puan (`aggregateRating`) veya yorum eklenmez. Her şema Google Rich Results Test'ten hatasız geçer.

### 6.6 Teknik SEO
- `sitemap.ts`: tüm indekslenebilir sayfalar, iki dil, hreflang alternatifleri, `lastModified`. Blog için ayrı sitemap gerekirse `generateSitemaps`.
- `robots.ts`: her şeye izin, `sitemap` adresi, `/api` kapalı. Staging ortamında tamamen `Disallow` + `noindex`.
- Core Web Vitals hedefleri (mobil): LCP < 2.5 sn, INP < 200 ms, CLS < 0.1.
- `next/image` (AVIF/WebP, doğru `sizes`, hero görselinde `priority`), fontlar self-host + `display: swap`, kritik olmayan bileşenler lazy.
- Animasyonlar layout kaydırmaz, sadece `transform` ve `opacity` kullanır.
- `<html lang="tr">` / `lang="en"` doğru. Sayfa kodlaması UTF-8.
- 404 sayfası kullanıcıyı ana bölümlere yönlendirir ve `404` durum kodu döner (soft 404 yok).

### 6.7 İçerik kuralları
- Her sayfanın tek bir ana anahtar kelimesi vardır ve bu kelime title, H1, ilk paragraf, URL ve en az bir görselin alt metninde geçer. Anahtar kelime tekrarı doğal tutulur.
- Birbirine benzeyen ince sayfa olmaz: her ürün ve çözüm sayfasında o sayfaya özel en az 300 kelimelik içerik bulunur.
- İngilizce sayfalar makine çevirisi gibi değil, İngilizce aramaya göre yazılır (slug'lar da İngilizce).
- Sayfa listesi ve anahtar kelime eşlemesi `config/products.ts`, `solutions.ts` ve `calculators.ts` içinde `keyword` alanı olarak tutulur.

### 6.8 Her fazın SEO kontrol listesi
Her fazın sonunda o fazda eklenen her sayfa için:
- [ ] title ve description benzersiz, uzunlukları doğru, canonical ve hreflang var
- [ ] Tek H1, başlık sırası doğru, görsellerin `alt` metni var
- [ ] İlgili JSON-LD var ve Rich Results Test'ten hatasız geçiyor
- [ ] Sayfa sitemap'te, breadcrumb'ı var, en az bir iç link alıyor
- [ ] JS kapalıyken içerik ve linkler sayfa kaynağında görünüyor
- [ ] Lighthouse (mobil): SEO 100, Performance ≥ 90, Accessibility ≥ 95

---

## 7. Fazlar

Her faz kendi başına çalışır durumda biter: `npm run build` ve `npm run lint` temiz geçer, yarım sayfa veya kırık link kalmaz. Sayfa ekleyen her faz **6.8'deki SEO kontrol listesini** geçmek zorundadır. Her fazın sonunda kabul kriterlerini tek tek kontrol et, sonucu ve `TODO` listesini bana yaz, onay bekle.

### Faz 1 – Kurulum ve tasarım sistemi
**Yapılacaklar**
1. `create-next-app` ile proje oluşturulur (TS, App Router, Tailwind v4, ESLint, `src/` yok). Next 16.2.x kullanılır.
2. shadcn/ui kurulur. 4.2'deki token'lar `app/globals.css` içine `:root` / `.dark` olarak yazılır ve Tailwind `@theme` ile bağlanır.
3. Inter `next/font/google` ile eklenir (`latin-ext`, ağırlıklar 400–800).
4. Logolar ve maskeli ekran görüntüleri `public/` altına kopyalanır (4.3). Ekran görüntüleri kopyalanırken açıklayıcı adlarla yeniden adlandırılır (ör. `dashboard.webp` → `qr-zaman-yonetici-paneli.webp`, bkz. 6.3).
5. `next-themes` ve `next-intl` kurulur. `i18n/*` ve `proxy.ts` yazılır. TR öneksiz, EN `/en`.
6. Ortak görsel bileşenler yazılır: `Button` varyantları, `Section`, `Container`, `BrowserFrame` (admin ekranı için tarayıcı çerçevesi), `PhoneFrame` (mobil ekran için telefon çerçevesi, ekranlar arası geçiş destekli), `ToastCard` (bildirim kartı), `QrPoster` (tarama çizgili A4 QR afişi + dönen rozet), `Marquee` (yatay kayan özellik şeridi).
7. Prettier, `.editorconfig`, `.env.example` ve `README.md` eklenir.

**Kabul kriterleri**
- `/` ve `/en` boş bir sayfa olarak açılıyor, `<html lang>` doğru.
- Açık / koyu tema geçişinde FOUC ve hydration hatası yok.
- Bileşenlerde hex renk yok, sadece token'lar.
- `npm run build` ve `npm run lint` temiz.

### Faz 2 – Layout, menüler ve sayfa iskeleti
**Yapılacaklar**
1. `config/navigation.ts`, `products.ts`, `solutions.ts`, `calculators.ts` ve `site.ts` doldurulur. Başlık ve açıklamalar `docs/ozellikler.md`'den, TR + EN birlikte.
2. Header (`navbar-menuler.html`): sticky, desktop mega menü + açılır menüler, sağda sadece Giriş Yap ve Demo Talep Et. Açık zeminli sayfalarda beyaz, ana sayfa hero'sunda lacivert üzerinde şeffaf.
3. Mobil menü (`mobil-menu.html`): hamburger, accordion, altta TR · EN, Tema ve CTA'lar.
4. Footer (`footer.html`): CTA bandı, marka bloğu, 4 link kolonu, alt satırda yasal linkler, sosyal ikonlar, tema butonu ve TR · EN.
5. Breadcrumbs (+ `BreadcrumbList` JSON-LD) ve SkipLink yazılır.
6. 5.1'deki **her sayfa** oluşturulur: `generateMetadata` (title, description, canonical, hreflang) + H1 + kısa açıklama + breadcrumb. Gövdeler sonraki fazlarda dolar. "Yakında" vb. ibare kullanılmaz.
7. `sitemap.ts` ve `robots.ts` config'ten üretilir. `not-found.tsx` tasarlanır.

**Kabul kriterleri**
- Menüdeki ve footer'daki her link 200 dönüyor, kırık link yok.
- JavaScript kapalıyken sayfa kaynağında tüm menü linkleri görünüyor.
- Dil geçişi aynı sayfanın karşılığına gidiyor (`/urunler/bordro` ↔ `/en/products/payroll`).
- Klavye ile menülerde gezilebiliyor (Tab, Enter, Esc). 360px'te yatay scroll yok.
- `/sitemap.xml` iki dili ve hreflang alternatiflerini içeriyor.

### Faz 3 – Ana sayfa
**Yapılacaklar**
1. 4.4'teki 9 bölüm `ana-sayfa-acik.html`'e birebir uygun olarak yazılır. Metinler `messages/*.json`'a, TR + EN.
2. Koyu tema `ana-sayfa-koyu.html`'deki renklerle kontrol edilir (aynı düzen, koyu token'lar; koyu tema için `dashboard-koyu` görseli kullanılır).
3. 4.5'teki hareketler eklenir.
4. Mobil görünüm `mobil-ana-sayfa.html`'e göre ayarlanır.
5. `Organization`, `SoftwareApplication` ve `FAQPage` JSON-LD eklenir.

**Kabul kriterleri**
- Tasarımla yan yana karşılaştırıldığında bölüm sırası, metinler ve görseller aynı.
- Lighthouse (mobil): Performance ≥ 90, Accessibility ≥ 95, SEO 100, CLS < 0.1.
- `prefers-reduced-motion` açıkken hiçbir şey hareket etmiyor.
- Hero görseli LCP'yi geciktirmiyor (`priority`, doğru `sizes`).

### Faz 4 – Ürün sayfaları
**Yapılacaklar**
1. `urun-sayfasi.html`'deki şablon tek bir ürün sayfası bileşeni olarak yazılır. Bölümler: hero (başlık, açıklama, görsel + bildirim kartı), "her hareketin kayıt altında" bloğu, kurulum adımları, "Neler yapabilirsiniz?" listesi, ilgili özellikler, CTA.
2. 3.1'deki 21 ürün sayfasının içeriği `config/products.ts` + `messages/*.json` üzerinden doldurulur. Her sayfaya en uygun ekran görüntüsü eşlenir.
3. `/urunler` sayfası: 5 kategori altında tüm ürün sayfaları.

**Kabul kriterleri**
- Her ürün sayfasının title ve description'ı benzersiz, H1 tek.
- Her sayfa en az 2 ilgili ürün sayfasına ve demo sayfasına link veriyor.
- İçerikteki her özellik `docs/ozellikler.md`'de karşılığı olan bir özellik; uydurma özellik yok.

### Faz 5 – Çözümler
**Yapılacaklar**
1. Sektör listesini **önce bana teyit ettir.**
2. Rol sayfaları (Yöneticiler, İK & Bordro, Çalışanlar) ve sektör sayfaları ortak bir şablonla yazılır: soruna giriş, o role/sektöre uygun özellikler, ekran görüntüleri, SSS, CTA.
3. `/cozumler` özet sayfası.

**Kabul kriterleri**
- Sektör sayfaları birbirinin kopyası değil; her birinde o sektöre özel en az 3 paragraf ve kendi SSS'leri var.
- Sektöre özel müşteri, rakam veya referans uydurulmamış.

### Faz 6 – Hesaplama araçları, SSS ve destek
**Yapılacaklar**
1. 6 hesaplama aracı çalışır hale getirilir: Net-Brüt Maaş, Kıdem Tazminatı, İhbar Tazminatı, Fazla Mesai, İşveren Maliyeti, Yıllık İzin.
2. Yıl bazlı parametreler (asgari ücret, SGK oranları ve tavanı, gelir vergisi dilimleri, damga vergisi, kıdem tavanı) `config/mevzuat/{yil}.ts` dosyasında tutulur. Değerler `../qrz-admin`'deki parametrelerden **okunur**, ezbere yazılmaz.
3. Hesaplar client'ta çalışır; sonuç tablosu, açıklama metni ve sonunda demo CTA'sı bulunur. Her araç sayfasında `FAQPage` JSON-LD.
4. `/sss` ve `/destek` sayfaları doldurulur.

**Kabul kriterleri**
- Her araç için en az 5 test senaryosu yazılır (Vitest). Sonuçlar admin paneldeki bordro hesabıyla karşılaştırılıp aynı çıkıyor.
- Geçersiz girişte açık hata mesajı var, sayfa çökmüyor.

### Faz 7 – Fiyatlandırma, kurumsal, iletişim ve formlar
**Yapılacaklar**
1. Fiyatlandırma sayfası. Fiyatlar bende; gelene kadar `TODO`.
2. Hakkımızda, İş Ortaklığı (bayilik başvuru formu), İletişim, Güvenlik & KVKK sayfaları.
3. Bayilerimiz: `/bayiler` (Türkiye haritası + liste) ve `/bayiler/[il]`, kurallar 4.7'de. İl SVG'si ve `config/provinces.ts` hazırlanır, `config/dealers.ts` boş bırakılır (bayi listesi bende).
4. Demo talep formu: `react-hook-form` + `zod` + Server Action + `nodemailer`. Spam koruması (honeypot + rate limit), KVKK onay kutusu, `sonner` ile sonuç bildirimi.
5. Yasal sayfalar (KVKK, Gizlilik, Çerez, Kullanım Şartları) MDX olarak; metinleri ben vereceğim.
6. `/hesap-silme` sayfası (mağaza zorunluluğu).

**Kabul kriterleri**
- Form gerçek SMTP ile test edildi, e-posta `CONTACT_TO` adresine ulaşıyor.
- Form JS kapalıyken de gönderilebiliyor (Server Action).
- Hiçbir sayfada uydurma fiyat, adres veya telefon yok.
- Bayi haritası JS kapalıyken görünüyor, bayili iller link olarak çalışıyor.
- Bayili illerin hepsi klavyeyle gezilebiliyor. Harita, tooltip ve panel açık/koyu temada okunabiliyor.
- 390px genişlikte harita taşmıyor. İl seçimi dokunarak ve combobox'tan yapılabiliyor.
- `DEALERS` boşken boş durum düzgün görünüyor. Hiçbir bayi bilgisi uydurulmamış.

### Faz 8 – Blog ve paylaşım görselleri
**Yapılacaklar**
1. MDX tabanlı blog: liste, kategori, detay, yazar, okuma süresi, ilgili yazılar. `BlogPosting` JSON-LD.
2. Başlangıç için 3 örnek yazı iskeleti (konuları bana sor).
3. `opengraph-image.tsx` ile sayfa başına dinamik OG görseli (logo + başlık, marka renkleri).
4. RSS (`/blog/rss.xml`).

**Kabul kriterleri**
- Blog yazıları sitemap'te, iki dilde ayrı.
- OG görseli Facebook/LinkedIn önizleme araçlarında doğru görünüyor.

### Faz 9 – Yayın öncesi denetim ve yayın
**Yapılacaklar**
1. Gerçek isimli admin görselleri ve çalışan QR kodlu A4 afiş demo verili görsellerle değiştirilir.
2. Tüm `TODO`'lar kapatılır (mağaza linkleri, iletişim, rakamlar, logolar, fiyatlar).
3. Erişilebilirlik denetimi (WCAG 2.1 AA): kontrast, odak halkaları, ekran okuyucu.
4. Eski WordPress URL'leri listelenir ve `next.config.ts` `redirects()` ile 301 yönlendirmesi yazılır.
5. `output: "standalone"` build, pm2 yapılandırması, nginx/IIS reverse proxy, HTTPS, gzip/brotli, cache başlıkları.
6. Google Search Console ve analitik kurulumu (çerez onayıyla).

**Kabul kriterleri**
- Tüm sayfalarda Lighthouse SEO 100, Accessibility ≥ 95.
- Eski WordPress URL'lerinin hepsi 301 ile yeni karşılığına gidiyor, 404 yok.
- `app.qrzaman.com.tr` etkilenmedi.

---

## Genel kurallar
- UI'da hardcoded metin yok: her şey `messages/*.json` ya da MDX'ten gelir. Yeni key eklenince TR ve EN birlikte eklenir.
- Hardcoded renk yok, sadece token'lar.
- Bilmediğin gerçek bilgileri (fiyat, adres, telefon, müşteri logoları, mağaza linkleri, istatistikler) **uydurma.** `TODO:` placeholder bırak ve adımın sonunda bana liste halinde sor.
- `app.qrzaman.com.tr`'ye ve `../qrz-admin`, `../qrz-mobile` projelerine dokunma, sadece oku.
- Kod yorumları Türkçe olabilir. Ben istemedikçe commit atma.
