import { ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { FAQPage } from "schema-dts";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { CALCULATORS } from "@/config/calculators";
import { PAGES } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLink } from "./parts";

type FaqItem = { q: string; a: string };

/**
 * 8. Hesaplama araçları (6 link) + SSS (5 soru, akordiyon) ve FAQPage JSON-LD.
 * Cevaplar kapalıyken de DOM'dadır (native <details>), JSON-LD aynı metinlerden üretilir.
 */
export async function ToolsFaq() {
  const t = await getTranslations("home");
  const tp = await getTranslations("pages");
  const faq = t.raw("faq.items") as FaqItem[];

  return (
    <div className="pb-12 md:pb-28">
      <Container className="flex flex-col gap-12 lg:flex-row">
        <Reveal
          as="section"
          labelledBy="hesaplama-araclari"
          className="flex min-w-0 flex-[1_1_360px] flex-col gap-4"
        >
          <h2
            id="hesaplama-araclari"
            className="text-[26px] font-extrabold md:text-[32px]"
          >
            {t("tools.title")}
          </h2>
          <p className="text-base text-muted-foreground">{t("tools.description")}</p>
          <ul className="grid grid-cols-2 gap-2.5">
            {CALCULATORS.map((calc) => (
              <li key={calc.id}>
                <Link
                  href={PAGES[calc.id].href}
                  className="flex h-full items-center rounded-[14px] bg-surface p-4 text-[15px] font-bold transition-colors hover:bg-info hover:text-info-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {tp(`${calc.id}.short`)}
                </Link>
              </li>
            ))}
          </ul>
          <ArrowLink href="/hesaplama">{t("tools.all")}</ArrowLink>
        </Reveal>

        <Reveal
          as="section"
          labelledBy="sss"
          index={1}
          className="flex min-w-0 flex-[1.4_1_480px] flex-col gap-2.5 md:gap-3"
        >
          <h2
            id="sss"
            className="mb-1.5 text-[26px] font-extrabold md:mb-1 md:text-[32px]"
          >
            {t("faq.title")}
          </h2>
          {faq.map((item, index) => (
            <details
              key={item.q}
              open={index === 0}
              className="group rounded-[14px] border border-border px-4 py-3.5 md:rounded-2xl md:px-[22px] md:py-[18px] dark:bg-surface"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded text-[15px] font-bold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:text-base [&::-webkit-details-marker]:hidden">
                <h3>{item.q}</h3>
                <ChevronDown
                  className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-2.5 md:text-[15px]">
                {item.a}
              </p>
            </details>
          ))}
        </Reveal>
      </Container>

      <JsonLd<FAQPage>
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </div>
  );
}
