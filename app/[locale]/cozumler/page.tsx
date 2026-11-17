import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ItemList } from "schema-dts";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink, richTags } from "@/components/sections/home/parts";
import { ProductCta } from "@/components/sections/product/product-cta";
import { SolutionCard } from "@/components/sections/solution/solution-card";
import { JsonLd } from "@/components/seo/json-ld";
import { PAGES } from "@/config/navigation";
import {
  SOLUTIONS,
  SOLUTION_GROUPS,
  SOLUTION_GROUP_ANCHORS,
  SOLUTION_GROUP_NAV,
} from "@/config/solutions";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/cozumler">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "solutions");
}

/**
 * Çözümler özet sayfası (onaylı bölüm planı): başlık + grup çipleri, Rollere göre (3 kart, maddeli),
 * Sektörlere göre (7 kart), "Sektörünüz listede yok mu?" şeridi, CTA.
 * JSON-LD: BreadcrumbList + ItemList.
 */
export default async function SolutionsPage({ params }: PageProps<"/[locale]/cozumler">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("solutionsIndex");
  const tn = await getTranslations("nav.groups");
  const tp = await getTranslations("pages");

  const groups = SOLUTION_GROUPS.map((group) => ({
    group,
    anchor: SOLUTION_GROUP_ANCHORS[group][locale],
    label: tn(SOLUTION_GROUP_NAV[group]),
    items: SOLUTIONS.filter((s) => s.group === group),
  }));

  return (
    <>
      <PageHeader id="solutions" locale={locale}>
        <nav aria-label={t("jumpLabel")}>
          <ul className="flex flex-wrap gap-2">
            {groups.map(({ group, anchor, label }) => (
              <li key={group}>
                <a
                  href={`#${anchor}`}
                  className="inline-flex h-10 items-center rounded-full border border-chip-border bg-background px-4 text-sm font-semibold text-chip-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:bg-card"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      {groups.map(({ group, anchor, label, items }, groupIndex) => (
        <section
          key={group}
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
                {label}
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground md:text-[17px]">
                {t(`groups.${group}`)}
              </p>
            </Reveal>
            <ul
              className={
                group === "role"
                  ? "grid gap-4 md:grid-cols-3"
                  : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              }
            >
              {items.map((solution, index) => (
                <Reveal key={solution.id} as="li" index={index}>
                  <SolutionCard
                    solution={solution}
                    points={
                      group === "role"
                        ? (t.raw(`points.${solution.id}`) as string[])
                        : undefined
                    }
                  />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ))}

      {/* Sektörünüz listede yok mu? */}
      <section aria-labelledby="cozumler-diger" className="py-8 md:py-12">
        <Container>
          <Reveal className="flex flex-col gap-4 rounded-3xl bg-surface px-6 py-10 md:rounded-[32px] md:px-14 md:py-14">
            <h2
              id="cozumler-diger"
              className="text-[26px] leading-tight font-extrabold text-balance md:text-[32px]"
            >
              {t("other.title")}
            </h2>
            <p className="max-w-[760px] text-[15px] leading-relaxed text-muted-foreground md:text-[17px]">
              {t("other.text")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
              <ArrowLink href={PAGES.products.href}>{t("other.products")}</ArrowLink>
              <ArrowLink href={PAGES.demo.href}>{t("other.demo")}</ArrowLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <ProductCta id="cozumler-cta" title={t.rich("cta", richTags(true))} />

      <JsonLd<ItemList>
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: tp("solutions.h1"),
          itemListElement: SOLUTIONS.map((solution, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tp(`${solution.id}.label`),
            url: absoluteUrl(locale, PAGES[solution.id].href),
          })),
        }}
      />
    </>
  );
}
