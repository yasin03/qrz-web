import { ArrowRight } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { BrowserFrame } from "@/components/mockups/browser-frame";
import { PhoneFrame } from "@/components/mockups/phone-frame";
import { ToastCard } from "@/components/mockups/toast-card";
import { Reveal } from "@/components/motion/reveal";
import { FaqList, FaqSchema, type FaqItem } from "@/components/sections/faq-list";
import { FeatureSplit } from "@/components/sections/home/feature-split";
import { CheckList, Pill, richTags } from "@/components/sections/home/parts";
import { ProductCard } from "@/components/sections/product/product-card";
import { ProductCta } from "@/components/sections/product/product-cta";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/config/products";
import { SOLUTION_SCREENS, type SolutionVisual } from "@/config/solution-screens";
import {
  SOLUTION_GROUP_ANCHORS,
  SOLUTION_GROUP_NAV,
  SOLUTION_LINKS,
  getSolutionById,
  type Solution,
} from "@/config/solutions";
import { getPathname, Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { SolutionCard } from "./solution-card";

const h2Class = "text-[30px] leading-[1.1] font-extrabold text-balance md:text-[40px]";
const leadClass = "text-[15px] leading-relaxed text-muted-foreground md:text-[17px]";

type Split = { eyebrow: string; title: string; text: string; points: string[] };

/**
 * Çözüm sayfası şablonu (Faz 5, onaylı bölüm planı). Tüm /cozumler/[slug] sayfaları bunu kullanır.
 * Bölümler: hero · sorun girişi (3 kart) · uygun özellikler (ürün kartları) ·
 * ekran görüntüleri (2 FeatureSplit) · SSS (+ FAQPage) · ilgili çözümler · CTA.
 * Metinler: pages.<id> (title, metaDescription, h1) + solutionContent.<id>.
 * Görseller: config/solution-screens.ts.
 */
export async function SolutionPage({
  solution,
  locale,
}: {
  solution: Solution;
  locale: Locale;
}) {
  const { id } = solution;
  const t = await getTranslations("solutionContent");
  const tp = await getTranslations("pages");
  const ts = await getTranslations("solutionPage");
  const tn = await getTranslations("nav.groups");
  const m = await getTranslations("mockups");

  const screens = SOLUTION_SCREENS[id];
  const links = SOLUTION_LINKS[id];
  const alts = t.raw(`${id}.alts`) as { hero: string[]; splits: string[][] };
  const problems = t.raw(`${id}.problems.items`) as { title: string; text: string }[];
  const featureTexts = t.raw(`${id}.features.items`) as Record<string, string>;
  const splits = t.raw(`${id}.splits`) as Split[];
  const faq = t.raw(`${id}.faq`) as FaqItem[];
  const tags = richTags();
  const navyTags = richTags(true);
  const groupLabel = tn(SOLUTION_GROUP_NAV[solution.group]);
  const browserUrl = (path: string) => `${m("browserUrl")}${path === "/" ? "" : path}`;
  const groupHref = `${getPathname({ locale, href: "/cozumler" })}#${SOLUTION_GROUP_ANCHORS[solution.group][locale]}`;
  const hero = screens.hero;

  return (
    <>
      {/* 1. Hero */}
      <section aria-labelledby="cozum-baslik" className="overflow-hidden bg-surface">
        <Container className="flex flex-col gap-8 pt-6 md:pt-7">
          <Breadcrumbs
            id={id}
            locale={locale}
            section={{ label: groupLabel, href: groupHref }}
          />
          <div className="flex flex-wrap items-end gap-x-12 gap-y-10">
            <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5 md:gap-[22px] md:pb-20">
              <Pill>{groupLabel}</Pill>
              <h1
                id="cozum-baslik"
                className="text-[36px] leading-[1.08] font-extrabold text-balance md:text-[52px] md:leading-[1.06]"
              >
                {tp(`${id}.h1`)}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-[19px] md:leading-[1.6]">
                {t(`${id}.intro`)}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="xl">
                  <Link href="/demo-talep">
                    {ts("demo")}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="border-chip-border text-chip-foreground dark:border-border dark:text-foreground"
                >
                  <Link href="/fiyatlandirma">{ts("pricing")}</Link>
                </Button>
              </div>
            </div>

            {hero.kind === "phones" ? (
              <div className="relative flex min-w-0 flex-[1_1_420px] items-end justify-center gap-3 pb-12 md:gap-5 md:pb-14">
                {hero.shots.map((src, index) => (
                  <PhoneFrame
                    key={index}
                    aboveFold={index === 0}
                    sizes="(min-width: 768px) 220px, 42vw"
                    className={cn(
                      "w-[min(44vw,220px)] shrink-0 md:w-[220px]",
                      index === 1 && "mb-12",
                    )}
                    screens={[{ src, alt: alts.hero[index] }]}
                  />
                ))}
                <ToastCard
                  className="absolute bottom-[120px] left-0 w-max max-w-[calc(100%-8px)]"
                  icon={screens.toast.icon}
                  tone={screens.toast.tone}
                  title={t(`${id}.toast.title`)}
                  description={t(`${id}.toast.description`)}
                />
              </div>
            ) : (
              <div className="relative min-w-0 flex-[1_1_420px] pr-[22%] pb-16 sm:pr-24 md:pb-14">
                <BrowserFrame
                  aboveFold
                  className="w-full shadow-frame"
                  url={browserUrl(hero.shot.path)}
                  image={{
                    src: hero.shot.src,
                    alt: alts.hero[0],
                    sizes: "(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 78vw",
                  }}
                  darkImage={
                    hero.shot.dark
                      ? { src: hero.shot.dark, alt: alts.hero[0] }
                      : undefined
                  }
                />
                <PhoneFrame
                  sizes="(min-width: 640px) 170px, 30vw"
                  className="absolute right-0 bottom-10 w-[30%] max-w-[170px] p-1.5 sm:w-[170px] sm:p-2 md:bottom-8"
                  screens={[{ src: hero.phone, alt: alts.hero[1] }]}
                />
                <ToastCard
                  className="absolute bottom-0 left-0 w-max max-w-[calc(100%-8px)] md:bottom-3 md:-left-4"
                  icon={screens.toast.icon}
                  tone={screens.toast.tone}
                  title={t(`${id}.toast.title`)}
                  description={t(`${id}.toast.description`)}
                />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 2. Sorun girişi: role/sektöre özel 3 zorluk */}
      <section aria-labelledby="cozum-zorluklar" className="pt-14 pb-6 md:pt-24 md:pb-12">
        <Container className="flex flex-col gap-8">
          <Reveal className="flex max-w-[760px] flex-col gap-3">
            <h2 id="cozum-zorluklar" className={h2Class}>
              {t.rich(`${id}.problems.title`, tags)}
            </h2>
            <p className={leadClass}>{t(`${id}.problems.text`)}</p>
          </Reveal>
          <ul className="grid gap-4 md:grid-cols-3">
            {problems.map((item, index) => {
              const Icon = screens.problems[index];
              return (
                <Reveal
                  key={item.title}
                  as="li"
                  index={index}
                  className="flex flex-col gap-3 rounded-[20px] border border-border p-6 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none md:p-7 dark:bg-surface"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-info text-info-foreground">
                    <Icon className="size-[22px]" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* 3. Uygun özellikler: ürün sayfalarına linkli kartlar (6.4) */}
      <section aria-labelledby="cozum-ozellikler" className="py-10 md:py-12">
        <Container className="flex flex-col gap-6 md:gap-8">
          <Reveal className="flex max-w-[760px] flex-col gap-3">
            <h2 id="cozum-ozellikler" className={h2Class}>
              {t.rich(`${id}.features.title`, tags)}
            </h2>
            <p className={leadClass}>{t(`${id}.features.text`)}</p>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.products.map((productId, index) => (
              <Reveal key={productId} as="li" index={index}>
                <ProductCard
                  product={getProductById(productId)}
                  description={featureTexts[productId]}
                />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 4. Ekran görüntüleri: metin + görsel, yer değiştirerek */}
      {splits.map((split, index) => (
        <FeatureSplit
          key={split.title}
          id={`cozum-ekran-${index + 1}`}
          eyebrow={split.eyebrow}
          // next-intl dizi yollarında (splits.0) etiket tiplerini çıkaramıyor; anahtar metni aynıdır
          title={t.rich(
            `${id}.splits.${index}.title` as `${typeof id}.problems.title`,
            tags,
          )}
          description={split.text}
          reverse={index === 1}
          panel={screens.splits[index].kind === "phones"}
          visual={
            <SplitVisual
              visual={screens.splits[index]}
              alts={alts.splits[index]}
              browserUrl={browserUrl}
            />
          }
        >
          <CheckList items={split.points} />
        </FeatureSplit>
      ))}

      {/* 5. SSS (FAQPage JSON-LD) */}
      <section aria-labelledby="cozum-sss" className="py-10 md:py-14">
        <Container className="flex flex-col gap-12 lg:flex-row">
          <Reveal className="flex min-w-0 flex-[1_1_320px] flex-col gap-3">
            <h2 id="cozum-sss" className={h2Class}>
              {ts("faqTitle")}
            </h2>
            <p className={leadClass}>{ts("faqText", { solution: tp(`${id}.label`) })}</p>
          </Reveal>
          <Reveal
            index={1}
            className="flex min-w-0 flex-[1.6_1_520px] flex-col gap-2.5 md:gap-3"
          >
            <FaqList items={faq} />
          </Reveal>
        </Container>
      </section>

      {/* 6. İlgili çözümler */}
      <section aria-labelledby="ilgili-cozumler" className="py-10 md:py-12">
        <Container className="flex flex-col gap-6 md:gap-8">
          <Reveal className="flex max-w-[720px] flex-col gap-3">
            <h2 id="ilgili-cozumler" className={h2Class}>
              {ts("relatedTitle")}
            </h2>
            <p className={leadClass}>{ts("relatedText")}</p>
          </Reveal>
          <ul className="grid gap-4 md:grid-cols-3">
            {links.related.map((relatedId, index) => (
              <Reveal key={relatedId} as="li" index={index}>
                <SolutionCard solution={getSolutionById(relatedId)} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 7. CTA */}
      <ProductCta id="cozum-cta" title={t.rich(`${id}.cta`, navyTags)} />

      <FaqSchema items={faq} />
    </>
  );
}

/** Ekran görüntüleri bölümündeki görsel: tarayıcı çerçevesi ya da yan yana iki telefon. */
function SplitVisual({
  visual,
  alts,
  browserUrl,
}: {
  visual: SolutionVisual;
  alts: string[];
  browserUrl: (path: string) => string;
}) {
  if (visual.kind === "browser") {
    return (
      <BrowserFrame
        className="shadow-frame"
        url={browserUrl(visual.shot.path)}
        image={{
          src: visual.shot.src,
          alt: alts[0],
          sizes: "(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw",
        }}
        darkImage={visual.shot.dark ? { src: visual.shot.dark, alt: alts[0] } : undefined}
      />
    );
  }
  return (
    <div className="flex items-start justify-center gap-4 md:gap-6">
      {visual.shots.map((src, index) => (
        <PhoneFrame
          key={index}
          sizes="(min-width: 768px) 220px, 42vw"
          className={cn(
            "w-[min(42vw,220px)] shrink-0 md:w-[220px]",
            index === 1 && "mt-10",
          )}
          screens={[{ src, alt: alts[index] }]}
        />
      ))}
    </div>
  );
}
