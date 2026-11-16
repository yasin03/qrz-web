import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { CountUp } from "@/components/motion/count-up";
import { CUSTOMER_LOGOS, STATS } from "@/config/site";

const STAT_KEYS = ["companies", "employees", "dailyScans", "provinces"] as const;
const PLACEHOLDER_LOGOS = 5;

/**
 * 3. Referanslar ve rakamlar. Gerçek veri gelene kadar (TODO, config/site.ts)
 * logolar ve rakamlar tasarımdaki yer tutucularla gösterilir; uydurma rakam yok.
 */
export async function Proof() {
  const t = await getTranslations("home.proof");

  return (
    <section aria-labelledby="referanslar" className="bg-surface py-7 md:py-10">
      <Container className="flex flex-col gap-7">
        <div className="hidden flex-wrap items-center justify-center gap-x-7 gap-y-4 md:flex">
          <h2 id="referanslar" className="text-sm font-bold text-muted-foreground">
            {t("title")}
          </h2>
          {CUSTOMER_LOGOS.length > 0
            ? CUSTOMER_LOGOS.map((logo) => (
                <Image
                  key={logo.name}
                  src={logo.src}
                  alt={logo.name}
                  width={132}
                  height={40}
                  className="h-10 w-[132px] object-contain"
                />
              ))
            : Array.from({ length: PLACEHOLDER_LOGOS }, (_, index) => (
                <span
                  key={index}
                  aria-hidden="true"
                  className="flex h-10 w-[132px] items-center justify-center rounded-lg border border-dashed border-chip-border text-xs text-muted-foreground"
                >
                  {t("logoPlaceholder")}
                </span>
              ))}
        </div>
        <dl className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          {STAT_KEYS.map((key) => {
            const value = STATS[key];
            return (
              <div key={key} className="flex flex-col-reverse">
                <dt className="text-[13px] text-muted-foreground md:text-sm">
                  {t(`stats.${key}.label`)}
                </dt>
                <dd className="text-[26px] font-extrabold text-foreground md:text-4xl">
                  {value === null ? (
                    t(`stats.${key}.placeholder`)
                  ) : (
                    <CountUp value={value} suffix="+" />
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
