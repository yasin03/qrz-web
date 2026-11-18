import { ArrowRight, Info } from "lucide-react";
import type { Locale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { CalculatorWidget } from "@/components/calculators/calculator-widget";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { FaqList, FaqSchema, type FaqItem } from "@/components/sections/faq-list";
import { ArrowLink, richTags } from "@/components/sections/home/parts";
import { ProductCard } from "@/components/sections/product/product-card";
import { ProductCta } from "@/components/sections/product/product-cta";
import { CALCULATORS, type Calculator } from "@/config/calculators";
import { PAGES } from "@/config/navigation";
import { getProductById } from "@/config/products";
import { Link } from "@/i18n/navigation";

const h2Class = "text-[28px] leading-[1.15] font-extrabold text-balance md:text-[36px]";
const leadClass = "text-[15px] leading-relaxed text-muted-foreground md:text-[17px]";

type HowTo = {
  title: string;
  paragraphs: string[];
  steps: string[];
  exampleTitle: string;
  example: string;
};

/**
 * Hesaplama aracı sayfası (Faz 6, onaylı bölüm planı). Tüm /hesaplama/[slug] sayfaları bunu kullanır.
 * Bölümler: başlık · hesaplayıcı (form + sonuç, istemci) · nasıl hesaplanır · ilgili ürün ve
 * diğer araçlar · SSS (+ FAQPage) · CTA.
 * Metinler: pages.<id> + calculatorContent.<id>; form metinleri calculatorUi (yalnızca bu sayfada istemciye gider).
 */
export async function CalculatorPage({
  calculator,
  locale,
}: {
  calculator: Calculator;
  locale: Locale;
}) {
  const { id } = calculator;
  const t = await getTranslations("calculatorContent");
  const tc = await getTranslations("calculatorPage");
  const tp = await getTranslations("pages");
  const messages = await getMessages();
  const howTo = t.raw(`${id}.howTo`) as HowTo;
  const faq = t.raw(`${id}.faq`) as FaqItem[];
  const others = CALCULATORS.filter((c) => c.id !== id);

  return (
    <>
      <PageHeader id={id} locale={locale} />

      {/* 1. Hesaplayıcı */}
      <section
        aria-label={tc("calculatorLabel")}
        className="pt-8 pb-10 md:pt-12 md:pb-14"
      >
        <Container className="flex flex-col gap-4">
          <NextIntlClientProvider messages={{ calculatorUi: messages.calculatorUi }}>
            <CalculatorWidget id={id} />
          </NextIntlClientProvider>
          <p className="flex gap-2 text-[13px] leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {tc("disclaimer")}
          </p>
        </Container>
      </section>

      {/* 2. Nasıl hesaplanır? */}
      <section aria-labelledby="nasil-hesaplanir" className="py-10 md:py-14">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14">
          <Reveal className="flex min-w-0 flex-col gap-4">
            <h2 id="nasil-hesaplanir" className={h2Class}>
              {howTo.title}
            </h2>
            {howTo.paragraphs.map((paragraph) => (
              <p key={paragraph} className={leadClass}>
                {paragraph}
              </p>
            ))}
            <ol className="mt-2 flex flex-col gap-3.5">
              {howTo.steps.map((step, index) => (
                <li key={step} className="flex gap-3.5">
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
                  >
                    {index + 1}
                  </span>
                  <span className="pt-1 text-[15px] leading-relaxed md:text-base">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal index={1} className="min-w-0">
            <div className="flex flex-col gap-3 rounded-[20px] bg-surface p-6 md:p-7 dark:bg-card">
              <h3 className="text-lg font-bold">{howTo.exampleTitle}</h3>
              <p className="text-[15px] leading-relaxed whitespace-pre-line text-muted-foreground">
                {howTo.example}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 3. İlgili ürün ve diğer araçlar (6.4) */}
      <section aria-labelledby="ilgili" className="py-10 md:py-12">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12">
          <Reveal className="flex min-w-0 flex-col gap-4">
            <h2 id="ilgili" className={h2Class}>
              {tc("relatedTitle")}
            </h2>
            <p className={leadClass}>{t(`${id}.related`)}</p>
            <ProductCard product={getProductById(calculator.relatedProduct)} />
          </Reveal>
          <Reveal index={1} className="flex min-w-0 flex-col gap-4">
            <h3 className="text-lg font-bold">{tc("otherTools")}</h3>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {others.map((other) => {
                const Icon = other.icon;
                return (
                  <li key={other.id}>
                    <Link
                      href={PAGES[other.id].href}
                      className="group flex h-full items-center gap-3 rounded-[14px] bg-surface p-4 text-[15px] font-bold transition-colors hover:bg-info hover:text-info-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:bg-card"
                    >
                      <Icon
                        className="size-5 shrink-0 text-primary dark:text-accent"
                        aria-hidden="true"
                      />
                      <span className="flex-1">{tp(`${other.id}.label`)}</span>
                      <ArrowRight
                        className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ArrowLink href="/hesaplama">{tc("allTools")}</ArrowLink>
          </Reveal>
        </Container>
      </section>

      {/* 4. SSS */}
      <section aria-labelledby="arac-sss" className="py-10 md:py-14">
        <Container className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <Reveal className="flex min-w-0 flex-[1_1_320px] flex-col gap-3">
            <h2 id="arac-sss" className={h2Class}>
              {tc("faqTitle")}
            </h2>
            <p className={leadClass}>{tc("faqText")}</p>
          </Reveal>
          <Reveal
            index={1}
            className="flex min-w-0 flex-[1.6_1_520px] flex-col gap-2.5 md:gap-3"
          >
            <FaqList items={faq} />
          </Reveal>
        </Container>
      </section>

      {/* 5. CTA */}
      <ProductCta id="arac-cta" title={t.rich(`${id}.cta`, richTags(true))} />

      <FaqSchema items={faq} />
    </>
  );
}
