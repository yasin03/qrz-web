import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ItemList } from "schema-dts";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { StoreBadges } from "@/components/layout/store-badges";
import { PhoneFrame } from "@/components/mockups/phone-frame";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink, Pill, richTags } from "@/components/sections/home/parts";
import { ProductCard } from "@/components/sections/product/product-card";
import { ProductCta } from "@/components/sections/product/product-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { PAGES } from "@/config/navigation";
import {
  PRODUCTS,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_ANCHORS,
} from "@/config/products";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import phoneHome from "@/public/screenshots/mobile/mobil-uygulama-ana-sayfa.webp";

export async function generateMetadata({ params }: PageProps<"/[locale]/urunler">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "products");
}

/**
 * Tüm ürünler (onaylı bölüm planı): başlık + kategori çipleri, 5 kategori bölümü
 * (ürün kartları), mobil uygulama bandı, CTA. JSON-LD: BreadcrumbList + ItemList.
 */
export default async function ProductsPage({ params }: PageProps<"/[locale]/urunler">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("productsIndex");
  const tn = await getTranslations("nav.groups");
  const tp = await getTranslations("pages");

  const groups = PRODUCT_CATEGORIES.map((category) => ({
    category,
    anchor: PRODUCT_CATEGORY_ANCHORS[category][locale],
    items: PRODUCTS.filter((p) => p.category === category),
  }));

  return (
    <>
      <PageHeader id="products" locale={locale}>
        <nav aria-label={t("jumpLabel")}>
          <ul className="flex flex-wrap gap-2">
            {groups.map(({ category, anchor }) => (
              <li key={category}>
                <a
                  href={`#${anchor}`}
                  className="inline-flex h-10 items-center rounded-full border border-chip-border bg-background px-4 text-sm font-semibold text-chip-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:bg-card"
                >
                  {tn(category)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      {groups.map(({ category, anchor, items }, groupIndex) => (
        <section
          key={category}
          id={anchor}
          aria-labelledby={`${anchor}-baslik`}
          className={groupIndex === 0 ? "pt-14 pb-8 md:pt-20 md:pb-10" : "py-8 md:py-10"}
        >
          <Container className="flex flex-col gap-6">
            <Reveal className="flex max-w-[720px] flex-col gap-2.5">
              <h2
                id={`${anchor}-baslik`}
                className="text-[26px] leading-tight font-extrabold md:text-[32px]"
              >
                {tn(category)}
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground md:text-[17px]">
                {t(`categories.${category}`)}
              </p>
            </Reveal>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((product, index) => (
                <Reveal key={product.id} as="li" index={index}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ))}

      {/* Mobil uygulama bandı */}
      <section aria-labelledby="urunler-mobil" className="py-8 md:py-12">
        <Container>
          <div className="flex flex-wrap items-end gap-x-12 gap-y-8 overflow-hidden rounded-3xl bg-hero px-6 pt-10 text-navy-foreground md:rounded-[32px] md:px-14 md:pt-16">
            <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4 md:gap-5 md:pb-16">
              <Pill>{t("mobile.badge")}</Pill>
              <h2
                id="urunler-mobil"
                className="text-[30px] leading-[1.1] font-extrabold text-balance md:text-[40px]"
              >
                {t.rich("mobile.title", richTags(true))}
              </h2>
              <p className="text-[15px] leading-relaxed text-navy-muted md:text-[17px]">
                {t("mobile.text")}
              </p>
              <StoreBadges tone="solidLg" />
              <ArrowLink
                href={PAGES.mobileApp.href}
                className="text-accent dark:text-accent"
              >
                {t("mobile.link")}
              </ArrowLink>
            </div>
            <div className="flex min-w-0 flex-[1_1_300px] justify-center">
              <PhoneFrame
                sizes="(min-width: 768px) 230px, 56vw"
                className="-mb-24 w-[min(56vw,230px)] bg-phone-frame-navy shadow-none md:w-[230px]"
                screens={[{ src: phoneHome, alt: t("mobile.imageAlt") }]}
              />
            </div>
          </div>
        </Container>
      </section>

      <ProductCta id="urunler-cta" title={t.rich("cta", richTags(true))} />

      <JsonLd<ItemList>
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: tp("products.h1"),
          itemListElement: PRODUCTS.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tp(`${product.id}.label`),
            url: absoluteUrl(locale, PAGES[product.id].href),
          })),
        }}
      />
    </>
  );
}
