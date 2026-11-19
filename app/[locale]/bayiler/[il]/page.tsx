import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { DealerCard } from "@/components/dealers/dealer-card";
import { getDealerLabels } from "@/components/dealers/dealer-labels";
import { dealerToLocalBusiness } from "@/components/dealers/dealer-schema";
import { ArrowLink } from "@/components/sections/home/parts";
import { ProductCta } from "@/components/sections/product/product-cta";
import { richTags } from "@/components/sections/home/parts";
import { JsonLd } from "@/components/seo/json-ld";
import { getDealerProvinces, getDealersByProvince } from "@/config/dealers";
import { getProvinceBySlug } from "@/config/provinces";
import type { AppPathname } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

// Yalnızca bayisi olan iller üretilir; diğerleri 404 (4.7). İl slug'ı iki dilde aynıdır.
export const dynamicParams = false;

export function generateStaticParams() {
  return getDealerProvinces().map((p) => ({ il: p.slug }));
}

function load(slug: string) {
  const province = getProvinceBySlug(slug);
  const dealers = province ? getDealersByProvince(province.code) : [];
  if (!province || dealers.length === 0) notFound();
  return { province, dealers };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/bayiler/[il]">) {
  const { locale, il } = await params;
  const { province, dealers } = load(il);
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "dealersPage.province",
  });
  return buildMetadata({
    locale: locale as Locale,
    href: `/bayiler/${province.slug}` as AppPathname,
    title: t("title", { province: province.name }),
    description: t("description", { province: province.name, count: dealers.length }),
  });
}

export default async function DealerProvincePage({
  params,
}: PageProps<"/[locale]/bayiler/[il]">) {
  const { locale: rawLocale, il } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const { province, dealers } = load(il);
  const t = await getTranslations("dealersPage");
  const labels = await getDealerLabels(locale);
  const href = `/bayiler/${province.slug}` as AppPathname;

  return (
    <>
      <div className="border-b border-border bg-surface">
        <Container className="flex flex-col gap-5 py-10 md:py-14">
          <Breadcrumbs
            id="dealers"
            locale={locale}
            current={{ label: province.name, href }}
          />
          <h1 className="max-w-4xl text-4xl leading-tight font-extrabold text-balance md:text-5xl">
            {t("province.h1", { province: province.name })}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {t("province.description", {
              province: province.name,
              count: dealers.length,
            })}
          </p>
        </Container>
      </div>

      <section aria-labelledby="il-bayileri" className="py-14 md:py-20">
        <Container className="flex flex-col gap-6">
          <h2
            id="il-bayileri"
            className="text-[26px] leading-tight font-extrabold md:text-[32px]"
          >
            {t("province.listTitle", { province: province.name })}
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dealers.map((dealer) => (
              <li key={dealer.id}>
                <DealerCard
                  dealer={dealer}
                  labels={{ ...labels.card, province: province.name }}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <ArrowLink href="/bayiler">{t("province.allDealers")}</ArrowLink>
            <ArrowLink href="/is-ortakligi">{t("partner.link")}</ArrowLink>
          </div>
        </Container>
      </section>

      <ProductCta id="il-cta" title={t.rich("cta", richTags(true))} />

      {dealers.map((dealer) => (
        <JsonLd
          key={dealer.id}
          data={{ "@context": "https://schema.org", ...dealerToLocalBusiness(dealer) }}
        />
      ))}
    </>
  );
}
