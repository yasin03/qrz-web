import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { CountUp } from "@/components/motion/count-up";
import { CUSTOMER_LOGOS, STATS } from "@/config/site";

const STAT_KEYS = ["companies", "employees", "dailyScans", "provinces"] as const;
/** Yer tutucularla aynı biçim: şirket ve personel "+" ile, okutma ve il düz sayı */
const STAT_SUFFIX: Record<(typeof STAT_KEYS)[number], string> = {
  companies: "+",
  employees: "+",
  dailyScans: "",
  provinces: "",
};
const PLACEHOLDER_LOGOS = 5;
/**
 * Kayan şeridin yarısı geniş ekranı doldursun diye logo listesi tekrarlanır
 * (animasyon -%50 kayar; ikinci yarı birincinin kopyasıdır).
 */
const MIN_LOGOS_PER_HALF = 9;

/**
 * Referanslar: üstte başlık, altında sürekli kayan logo şeridi (CSS animasyonu, JS yok).
 * Hareket azaltma açıkken animasyon durur (globals.css). Logolar: config/site.ts → CUSTOMER_LOGOS.
 * Ana sayfada "Nasıl çalışır" ile "Hesaplama araçları ve SSS" arasında durur.
 */
export async function ReferenceLogos() {
  const t = await getTranslations("home.proof");

  const repeat = Math.max(
    1,
    Math.ceil(MIN_LOGOS_PER_HALF / Math.max(CUSTOMER_LOGOS.length, 1)),
  );
  const half = Array.from({ length: repeat }, () => CUSTOMER_LOGOS).flat();
  const track = [...half, ...half];

  return (
    <section
      aria-labelledby="referanslar"
      className="border-b border-border bg-background py-8 md:py-10"
    >
      <Container>
        <h2
          id="referanslar"
          className="text-center text-sm font-bold text-muted-foreground md:text-base"
        >
          {t("title")}
        </h2>
      </Container>

      {CUSTOMER_LOGOS.length > 0 ? (
        // Kenarlarda yumuşak geçiş (mask), üzerine gelince durur
        <div className="mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] md:mt-6">
          <ul className="flex w-max animate-qz-marquee items-center gap-8 [animation-duration:40s] hover:[animation-play-state:paused] md:gap-14">
            {track.map((logo, index) => {
              // Yalnızca ilk kopya ekran okuyucuya okunur
              const duplicate = index >= CUSTOMER_LOGOS.length;
              return (
                <li
                  key={index}
                  aria-hidden={duplicate ? true : undefined}
                  // Renkli logolar koyu zeminde okunmadığı için koyu temada beyaz kutu içinde
                  className="flex h-11 shrink-0 items-center rounded-lg px-3 md:h-14 md:px-4 dark:bg-white"
                >
                  <Image
                    src={logo.src}
                    alt={duplicate ? "" : logo.name}
                    width={logo.width}
                    height={logo.height}
                    sizes="200px"
                    className="h-6 w-auto max-w-[150px] object-contain md:h-9 md:max-w-[200px]"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <Container>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-4 md:gap-7">
            {Array.from({ length: PLACEHOLDER_LOGOS }, (_, index) => (
              <li
                key={index}
                aria-hidden="true"
                className="flex h-10 w-[132px] items-center justify-center rounded-lg border border-dashed border-chip-border text-xs text-muted-foreground"
              >
                {t("logoPlaceholder")}
              </li>
            ))}
          </ul>
        </Container>
      )}
    </section>
  );
}

/**
 * 3. Rakamlar (hero'nun hemen altında): config/site.ts → STATS.
 * null olan rakam yer tutucuyla gösterilir; uydurma rakam yok.
 */
export async function Proof() {
  const t = await getTranslations("home.proof");

  return (
    <section aria-label={t("statsLabel")} className="bg-surface py-8 md:py-10">
      <Container>
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
                    <CountUp value={value} suffix={STAT_SUFFIX[key]} />
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
