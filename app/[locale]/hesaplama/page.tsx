import { ArrowRight } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ItemList } from "schema-dts";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink, richTags } from "@/components/sections/home/parts";
import { ProductCta } from "@/components/sections/product/product-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { CALCULATORS } from "@/config/calculators";
import { PAGES } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/hesaplama">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "calculators");
}

/**
 * Hesaplama araçları özet sayfası (onaylı bölüm planı): başlık, 6 araç kartı,
 * "QR Zaman bordrosu" şeridi, CTA. JSON-LD: BreadcrumbList + ItemList.
 */
export default async function CalculatorsPage({
  params,
}: PageProps<"/[locale]/hesaplama">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("calculatorsIndex");
  const tp = await getTranslations("pages");

  return (
    <>
      <PageHeader id="calculators" locale={locale} />

      <section aria-labelledby="araclar" className="pt-14 pb-8 md:pt-20 md:pb-10">
        <Container className="flex flex-col gap-6">
          <h2 id="araclar" className="sr-only">
            {t("listTitle")}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CALCULATORS.map((calc, index) => {
              const Icon = calc.icon;
              return (
                <Reveal key={calc.id} as="li" index={index}>
                  <article className="group relative flex h-full flex-col gap-3 rounded-[20px] border border-border bg-background p-6 transition-transform duration-200 focus-within:ring-2 focus-within:ring-ring hover:-translate-y-1 motion-reduce:transition-none dark:bg-surface">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-info text-info-foreground">
                      <Icon className="size-[22px]" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-bold">
                      <Link
                        href={PAGES[calc.id].href}
                        className="outline-none after:absolute after:inset-0 after:rounded-[20px] after:content-['']"
                      >
                        {tp(`${calc.id}.label`)}
                      </Link>
                    </h3>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">
                      {t(`cards.${calc.id}`)}
                    </p>
                    <span
                      aria-hidden="true"
                      className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-primary dark:text-accent"
                    >
                      {t("open")}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </span>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="hesaplama-bordro" className="py-8 md:py-12">
        <Container>
          <Reveal className="flex flex-col gap-4 rounded-3xl bg-surface px-6 py-10 md:rounded-[32px] md:px-14 md:py-14">
            <h2
              id="hesaplama-bordro"
              className="text-[26px] leading-tight font-extrabold text-balance md:text-[32px]"
            >
              {t("payroll.title")}
            </h2>
            <p className="max-w-[760px] text-[15px] leading-relaxed text-muted-foreground md:text-[17px]">
              {t("payroll.text")}
            </p>
            <ArrowLink href={PAGES.payroll.href}>{t("payroll.link")}</ArrowLink>
          </Reveal>
        </Container>
      </section>

      <ProductCta id="hesaplama-cta" title={t.rich("cta", richTags(true))} />

      <JsonLd<ItemList>
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: tp("calculators.h1"),
          itemListElement: CALCULATORS.map((calc, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tp(`${calc.id}.label`),
            url: absoluteUrl(locale, PAGES[calc.id].href),
          })),
        }}
      />
    </>
  );
}
