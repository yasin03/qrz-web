import { ArrowRight, Check, Minus } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { FaqList, FaqSchema, type FaqItem } from "@/components/sections/faq-list";
import {
  CheckList,
  h2Class,
  leadClass,
  richTags,
} from "@/components/sections/home/parts";
import { ProductCta } from "@/components/sections/product/product-cta";
import { Button } from "@/components/ui/button";
import {
  FEATURE_GROUPS,
  PLAN_FEATURES,
  PLAN_IDS,
  PLANS,
  planHighlights,
} from "@/config/pricing";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[locale]/fiyatlandirma">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "pricing");
}

/**
 * Fiyatlandırma (onaylı plan): 3 paket kartı (tikli içerik), karşılaştırma tablosu, SSS, CTA.
 * Fiyatlar ve içerikler geçicidir: config/pricing.ts.
 */
export default async function PricingPage({
  params,
}: PageProps<"/[locale]/fiyatlandirma">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("pricingPage");
  const faq = t.raw("faq.items") as FaqItem[];

  const price = new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency: "TRY",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  });

  return (
    <>
      <PageHeader id="pricing" locale={locale} />

      {/* 1. Paketler */}
      <section aria-labelledby="paketler" className="pt-14 pb-8 md:pt-20 md:pb-12">
        <Container className="flex flex-col gap-8">
          <h2 id="paketler" className="sr-only">
            {t("plansTitle")}
          </h2>
          <ul className="grid items-stretch gap-5 lg:grid-cols-3">
            {PLANS.map((plan, index) => {
              const features = planHighlights(plan.id);
              const previous = index > 0 ? PLAN_IDS[index - 1] : null;
              return (
                <Reveal key={plan.id} as="li" index={index}>
                  <article
                    aria-labelledby={`paket-${plan.id}`}
                    className={cn(
                      "relative flex h-full flex-col gap-6 rounded-3xl border p-6 md:p-8",
                      plan.highlighted
                        ? "border-primary bg-background shadow-frame ring-1 ring-primary dark:bg-card"
                        : "border-border bg-background dark:bg-surface",
                    )}
                  >
                    {plan.highlighted ? (
                      <span className="absolute -top-3.5 left-6 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground md:left-8">
                        {t("popular")}
                      </span>
                    ) : null}
                    <div className="flex flex-col gap-2">
                      <h3 id={`paket-${plan.id}`} className="text-2xl font-extrabold">
                        {t(`plans.${plan.id}.name`)}
                      </h3>
                      <p className="text-[15px] leading-relaxed text-muted-foreground">
                        {t(`plans.${plan.id}.description`)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="flex items-baseline gap-1.5">
                        <span className="text-[44px] leading-none font-extrabold tracking-tight">
                          {price.format(plan.monthlyPrice)}
                        </span>
                        <span className="text-[15px] font-semibold text-muted-foreground">
                          {t("perEmployee")}
                        </span>
                      </p>
                      <p className="text-[13px] text-muted-foreground">{t("vatNote")}</p>
                    </div>
                    <Button
                      asChild
                      size="xl"
                      variant={plan.highlighted ? "default" : "outline"}
                      className="w-full"
                    >
                      <Link href="/demo-talep">
                        {t("planCta")}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                    <div className="flex flex-col gap-3.5 border-t border-border pt-6">
                      <p className="text-sm font-bold">
                        {previous
                          ? t("includesPrevious", { plan: t(`plans.${previous}.name`) })
                          : t("includes")}
                      </p>
                      <CheckList
                        items={features.map((f) =>
                          t(`features.${f.id}` as "features.qrPdks"),
                        )}
                        className="gap-2.5 md:gap-2.5 [&_li]:text-[15px] md:[&_li]:text-[15px]"
                      />
                    </div>
                    <p className="mt-auto rounded-xl bg-surface px-4 py-3 text-sm font-semibold dark:bg-background/40">
                      {t(`plans.${plan.id}.limit`)}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </ul>
          <p className="text-center text-sm text-muted-foreground">{t("note")}</p>
        </Container>
      </section>

      {/* 2. Karşılaştırma tablosu */}
      <section aria-labelledby="paket-karsilastirma" className="py-8 md:py-12">
        <Container className="flex flex-col gap-6">
          <Reveal className="flex max-w-3xl flex-col gap-3">
            <h2 id="paket-karsilastirma" className={h2Class}>
              {t.rich("compare.title", richTags())}
            </h2>
            <p className={leadClass}>{t("compare.text")}</p>
          </Reveal>
          <div className="overflow-x-auto rounded-[20px] border border-border">
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <caption className="sr-only">{t("compare.caption")}</caption>
              <thead className="bg-surface">
                <tr>
                  <th scope="col" className="w-[40%] px-5 py-4 text-sm font-bold">
                    {t("compare.feature")}
                  </th>
                  {PLAN_IDS.map((id) => (
                    <th
                      key={id}
                      scope="col"
                      className="px-4 py-4 text-center text-sm font-bold"
                    >
                      {t(`plans.${id}.name`)}
                    </th>
                  ))}
                </tr>
              </thead>
              {FEATURE_GROUPS.map((group) => (
                <tbody key={group}>
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={PLAN_IDS.length + 1}
                      className="border-t border-border bg-background px-5 pt-5 pb-2 text-xs font-bold tracking-wide text-primary uppercase dark:bg-transparent dark:text-accent"
                    >
                      {t(`groups.${group}`)}
                    </th>
                  </tr>
                  {PLAN_FEATURES.filter((f) => f.group === group).map((feature) => (
                    <tr key={feature.id} className="border-t border-border/70">
                      <th scope="row" className="px-5 py-3 font-medium">
                        {t(`features.${feature.id}` as "features.qrPdks")}
                      </th>
                      {PLAN_IDS.map((id) => (
                        <td key={id} className="px-4 py-3 text-center">
                          {feature.plans.includes(id) ? (
                            <Check
                              className="mx-auto size-5 text-primary dark:text-accent"
                              aria-label={t("compare.included")}
                            />
                          ) : (
                            <Minus
                              className="mx-auto size-5 text-muted-foreground/60"
                              aria-label={t("compare.notIncluded")}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </Container>
      </section>

      {/* 3. SSS */}
      <section aria-labelledby="fiyat-sss" className="py-8 md:py-12">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14">
          <Reveal className="flex flex-col gap-3">
            <h2 id="fiyat-sss" className={h2Class}>
              {t.rich("faq.title", richTags())}
            </h2>
            <p className={leadClass}>{t("faq.text")}</p>
          </Reveal>
          <div className="flex flex-col gap-3">
            <FaqList items={faq} />
          </div>
        </Container>
      </section>
      <FaqSchema items={faq} />

      <ProductCta id="fiyat-cta" title={t.rich("cta", richTags(true))} />
    </>
  );
}
