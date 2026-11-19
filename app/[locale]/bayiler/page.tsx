import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ItemList } from "schema-dts";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { DealerCard } from "@/components/dealers/dealer-card";
import { getDealerLabels } from "@/components/dealers/dealer-labels";
import { dealerToLocalBusiness } from "@/components/dealers/dealer-schema";
import { buildMapProvinces } from "@/components/dealers/map-data";
import { MapExplorer } from "@/components/dealers/map-explorer";
import { TurkeyMap } from "@/components/dealers/turkey-map";
import {
  ArrowLink,
  h2Class,
  leadClass,
  richTags,
} from "@/components/sections/home/parts";
import { ProductCta } from "@/components/sections/product/product-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { DEALERS, getDealerProvinces, getDealersByProvince } from "@/config/dealers";
import { getPathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/bayiler">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "dealers");
}

/**
 * Bayilerimiz (4.7): Türkiye haritası (inline SVG) + il paneli, il il bayi listesi,
 * "Bayimiz olun" bandı. Bayi listesi config/dealers.ts'ten gelir; boşken boş durum gösterilir.
 */
export default async function DealersPage({ params }: PageProps<"/[locale]/bayiler">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("dealersPage");
  const labels = await getDealerLabels(locale);
  const provinces = buildMapProvinces(DEALERS);
  const dealerProvinces = getDealerProvinces();

  const href = (path: AppPathname) => getPathname({ locale, href: path });
  const provinceHrefs = Object.fromEntries(
    dealerProvinces.map((p) => [p.slug, href(`/bayiler/${p.slug}` as AppPathname)]),
  );

  return (
    <>
      <PageHeader id="dealers" locale={locale} />

      {/* 1. Harita */}
      <section aria-labelledby="bayi-haritasi" className="pt-14 pb-8 md:pt-20 md:pb-12">
        <Container className="flex flex-col gap-6">
          <div className="flex max-w-3xl flex-col gap-2">
            <h2
              id="bayi-haritasi"
              className="text-[26px] leading-tight font-extrabold md:text-[32px]"
            >
              {t("map.title")}
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground md:text-base">
              {t("map.text")}
            </p>
          </div>
          <MapExplorer
            provinces={provinces}
            dealers={DEALERS}
            provinceHrefs={provinceHrefs}
            partnersHref={href("/is-ortakligi")}
            contactHref={href("/iletisim")}
            labels={labels.map}
          >
            <TurkeyMap provinces={provinces} locale={locale} label={t("map.svgLabel")} />
          </MapExplorer>
        </Container>
      </section>

      {/* 2. İl il bayi listesi */}
      <section aria-labelledby="bayi-listesi" className="py-8 md:py-12">
        <Container className="flex flex-col gap-6">
          <h2 id="bayi-listesi" className={h2Class}>
            {t.rich("list.title", richTags())}
          </h2>
          {dealerProvinces.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-[20px] border border-dashed border-chip-border p-6 md:p-8">
              <p className="text-lg font-bold">{t("map.emptyTitle")}</p>
              <p className={leadClass}>{t("list.empty")}</p>
              <ArrowLink href="/iletisim">{t("map.contact")}</ArrowLink>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {dealerProvinces.map((province) => (
                <div key={province.code} className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold">
                    <ArrowLink
                      href={`/bayiler/${province.slug}` as AppPathname}
                      className="text-xl text-foreground dark:text-foreground"
                    >
                      {t("list.provinceHeading", { province: province.name })}
                    </ArrowLink>
                  </h3>
                  <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {getDealersByProvince(province.code).map((dealer) => (
                      <li key={dealer.id}>
                        <DealerCard
                          dealer={dealer}
                          headingLevel="h4"
                          labels={{ ...labels.card, province: province.name }}
                          className="h-full"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 3. Bayimiz olun (iki yönlü link: /is-ortakligi) */}
      <section aria-labelledby="bayimiz-olun" className="py-8 md:py-12">
        <Container>
          <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex max-w-2xl flex-col gap-2">
              <h2 id="bayimiz-olun" className="text-2xl font-extrabold">
                {t("partner.title")}
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {t("partner.text")}
              </p>
            </div>
            <ArrowLink href="/is-ortakligi">{t("partner.link")}</ArrowLink>
          </div>
        </Container>
      </section>

      <ProductCta id="bayiler-cta" title={t.rich("cta", richTags(true))} />

      {DEALERS.length > 0 ? (
        <JsonLd<ItemList>
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t("schemaName"),
            url: absoluteUrl(locale, "/bayiler"),
            itemListElement: DEALERS.map((dealer, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: dealerToLocalBusiness(dealer),
            })),
          }}
        />
      ) : null}
    </>
  );
}
