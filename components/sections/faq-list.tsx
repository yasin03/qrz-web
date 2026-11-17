import { ChevronDown } from "lucide-react";
import type { FAQPage } from "schema-dts";
import { JsonLd } from "@/components/seo/json-ld";

export type FaqItem = { q: string; a: string };

/**
 * SSS akordiyonu (native <details>): cevaplar kapalıyken de DOM'dadır (6.3).
 * Ana sayfa ve çözüm sayfaları kullanır. FAQPage JSON-LD aynı metinlerden üretilir.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <>
      {items.map((item, index) => (
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
    </>
  );
}

/** FAQPage JSON-LD (6.5): SSS içeren her sayfada bir kez. */
export function FaqSchema({ items }: { items: FaqItem[] }) {
  return (
    <JsonLd<FAQPage>
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }}
    />
  );
}
