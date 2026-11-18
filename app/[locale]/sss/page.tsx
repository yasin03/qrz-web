import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { FaqList, FaqSchema, type FaqItem } from "@/components/sections/faq-list";
import { ArrowLink } from "@/components/sections/home/parts";
import { PAGES } from "@/config/navigation";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/sss">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "faq");
}

type FaqCategory = { id: string; title: string; items: FaqItem[] };

/**
 * SSS (onaylı bölüm planı): başlık + kategori çipleri, kategori başına akordiyon,
 * "Cevabını bulamadınız mı?" şeridi. Tüm sorular tek FAQPage JSON-LD'de.
 */
export default async function FaqPage({ params }: PageProps<"/[locale]/sss">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("faqPage");
  const categories = t.raw("categories") as FaqCategory[];

  return (
    <>
      <PageHeader id="faq" locale={locale}>
        <nav aria-label={t("jumpLabel")}>
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.id}>
                <a
                  href={`#${category.id}`}
                  className="inline-flex h-10 items-center rounded-full border border-chip-border bg-background px-4 text-sm font-semibold text-chip-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:bg-card"
                >
                  {category.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      {categories.map((category, index) => (
        <section
          key={category.id}
          id={category.id}
          aria-labelledby={`${category.id}-baslik`}
          className={index === 0 ? "pt-14 pb-6 md:pt-20 md:pb-8" : "py-6 md:py-8"}
        >
          <Container className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-12">
            <h2
              id={`${category.id}-baslik`}
              className="text-[24px] leading-tight font-extrabold md:text-[28px]"
            >
              {category.title}
            </h2>
            <Reveal className="flex min-w-0 flex-col gap-2.5 md:gap-3">
              <FaqList items={category.items} />
            </Reveal>
          </Container>
        </section>
      ))}

      <section aria-labelledby="sss-destek" className="pt-8 pb-16 md:pt-12 md:pb-28">
        <Container>
          <Reveal className="flex flex-col gap-4 rounded-3xl bg-surface px-6 py-10 md:rounded-[32px] md:px-14 md:py-14">
            <h2
              id="sss-destek"
              className="text-[26px] leading-tight font-extrabold text-balance md:text-[32px]"
            >
              {t("more.title")}
            </h2>
            <p className="max-w-[760px] text-[15px] leading-relaxed text-muted-foreground md:text-[17px]">
              {t("more.text")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
              <ArrowLink href={PAGES.support.href}>{t("more.support")}</ArrowLink>
              <ArrowLink href={PAGES.contact.href}>{t("more.contact")}</ArrowLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <FaqSchema items={categories.flatMap((category) => category.items)} />
    </>
  );
}
