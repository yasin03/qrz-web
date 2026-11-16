import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { BrowserFrame } from "@/components/mockups/browser-frame";
import { PhoneFrame } from "@/components/mockups/phone-frame";
import { ToastCard } from "@/components/mockups/toast-card";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink, Pill, richTags } from "@/components/sections/home/parts";
import { SoftwareAppSchema } from "@/components/seo/site-schema";
import { Button } from "@/components/ui/button";
import { PAGES } from "@/config/navigation";
import { PRODUCT_SCREENS, type Shot, type StepVisual } from "@/config/product-screens";
import {
  PRODUCT_CATEGORY_ANCHORS,
  PRODUCT_LINKS,
  getProductById,
  type Product,
} from "@/config/products";
import { getPathname, Link } from "@/i18n/navigation";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { ProductCta } from "./product-cta";

const h2Class = "text-[30px] leading-[1.1] font-extrabold text-balance md:text-[40px]";
const leadClass = "text-[15px] leading-relaxed text-muted-foreground md:text-[17px]";

/**
 * Ürün sayfası şablonu (urun-sayfasi.html). Tüm /urunler/[slug] sayfaları bunu kullanır.
 * Bölümler: hero · 3 fayda kartı · vitrin (her hareketin kayıt altında) · kurulum adımları ·
 * Neler yapabilirsiniz? · İlgili özellikler · CTA.
 * Metinler: pages.<id> (title, description, h1) + productContent.<id>. Görseller: config/product-screens.ts.
 */
export async function ProductPage({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const { id } = product;
  const t = await getTranslations("productContent");
  const tp = await getTranslations("pages");
  const tc = await getTranslations("productPage");
  const tn = await getTranslations("nav.groups");
  const m = await getTranslations("mockups");

  const screens = PRODUCT_SCREENS[id];
  const links = PRODUCT_LINKS[id];
  const alts = t.raw(`${id}.alts`) as {
    hero: string[];
    showcase: string;
    steps: string[];
  };
  const benefits = t.raw(`${id}.benefits`) as {
    eyebrow: string;
    title: string;
    text: string;
  }[];
  const steps = t.raw(`${id}.steps.items`) as string[];
  const capabilities = t.raw(`${id}.capabilities`) as string[];
  const tags = richTags();
  const navyTags = richTags(true);
  const label = tp(`${id}.label`);
  const browserUrl = (path: string) => `${m("browserUrl")}${path === "/" ? "" : path}`;

  const categoryHref = `${getPathname({ locale, href: "/urunler" })}#${PRODUCT_CATEGORY_ANCHORS[product.category][locale]}`;

  return (
    <>
      {/* 1. Hero */}
      <section aria-labelledby="urun-baslik" className="overflow-hidden bg-surface">
        <Container className="flex flex-col gap-8 pt-6 md:pt-7">
          <Breadcrumbs
            id={id}
            locale={locale}
            section={{ label: tn(product.category), href: categoryHref }}
          />
          <div className="flex flex-wrap items-end gap-x-12 gap-y-10">
            <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5 md:gap-[22px] md:pb-20">
              <Pill>{tn(product.category)}</Pill>
              <h1
                id="urun-baslik"
                className="text-[38px] leading-[1.06] font-extrabold text-balance md:text-[56px] md:leading-[1.05]"
              >
                {tp.rich(`${id}.h1`, {
                  accent: (chunks) => (
                    <span className="block text-primary dark:text-accent">{chunks}</span>
                  ),
                })}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-[19px] md:leading-[1.6]">
                {t(`${id}.intro`)}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="xl">
                  <Link href="/demo-talep">
                    {tc("demo")}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="border-chip-border text-chip-foreground dark:border-border dark:text-foreground"
                >
                  <Link href="/fiyatlandirma">{tc("pricing")}</Link>
                </Button>
              </div>
            </div>

            <div className="relative flex min-w-0 flex-[1_1_420px] items-end justify-center gap-3 pb-12 md:gap-5 md:pb-14">
              {screens.hero.kind === "phones" ? (
                screens.hero.shots.map((shot, index) => (
                  <PhoneFrame
                    key={index}
                    aboveFold={index === 0}
                    sizes="(min-width: 768px) 220px, 42vw"
                    className={cn(
                      "w-[min(44vw,220px)] shrink-0 md:w-[220px]",
                      index === 1 && "mb-12",
                    )}
                    screens={[{ src: shot.src, alt: alts.hero[index] }]}
                  />
                ))
              ) : (
                <BrowserFrame
                  aboveFold
                  className="w-full shadow-frame"
                  url={browserUrl(screens.hero.shot.path)}
                  image={{
                    src: screens.hero.shot.src,
                    alt: alts.hero[0],
                    sizes: "(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw",
                  }}
                  darkImage={
                    screens.hero.shot.dark
                      ? { src: screens.hero.shot.dark, alt: alts.hero[0] }
                      : undefined
                  }
                />
              )}
              <ToastCard
                className={cn(
                  "absolute left-0 w-max max-w-[calc(100%-8px)]",
                  screens.hero.kind === "phones"
                    ? "bottom-[120px]"
                    : "bottom-4 md:-left-4",
                )}
                icon={screens.toast.icon}
                tone={screens.toast.tone}
                title={t(`${id}.toast.title`)}
                description={t(`${id}.toast.description`)}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Fayda kartları */}
      <section aria-labelledby="one-cikanlar" className="pt-14 pb-6 md:pt-24 md:pb-12">
        <Container>
          <h2 id="one-cikanlar" className="sr-only">
            {tc("highlights")}
          </h2>
          <ul className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
            {benefits.map((item, index) => (
              <Reveal
                key={item.title}
                as="li"
                index={index}
                className="flex flex-col gap-2.5 rounded-[20px] border border-border p-6 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none md:p-7 dark:bg-surface"
              >
                <span className="text-[15px] font-extrabold text-primary dark:text-accent">
                  {item.eyebrow}
                </span>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 3. Vitrin: her hareketin kayıt altında */}
      <section aria-labelledby="urun-vitrin" className="py-6 md:py-12">
        <Container className="flex flex-col gap-8">
          <Reveal className="flex max-w-[720px] flex-col gap-3">
            <h2 id="urun-vitrin" className={h2Class}>
              {t.rich(`${id}.showcase.title`, tags)}
            </h2>
            <p className={leadClass}>{t(`${id}.showcase.text`)}</p>
          </Reveal>
          <Reveal index={1}>
            <BrowserFrame
              className="shadow-frame"
              url={browserUrl(screens.showcase.path)}
              image={{
                src: screens.showcase.src,
                alt: alts.showcase,
                sizes: "(min-width: 1280px) 1192px, 100vw",
              }}
              darkImage={
                screens.showcase.dark
                  ? { src: screens.showcase.dark, alt: alts.showcase }
                  : undefined
              }
            />
          </Reveal>
        </Container>
      </section>

      {/* 4. Kurulum adımları (lacivert bant) */}
      <section aria-labelledby="urun-adimlar" className="py-6 md:py-12">
        <Container>
          <div className="flex flex-wrap items-end gap-x-12 gap-y-8 overflow-hidden rounded-3xl bg-navy px-6 pt-10 text-navy-foreground md:rounded-[32px] md:px-14 md:pt-16">
            <div
              className={cn(
                "flex min-w-0 flex-[1_1_380px] flex-col gap-[18px]",
                screens.steps.length ? "md:pb-16" : "pb-10 md:pb-16",
              )}
            >
              <h2 id="urun-adimlar" className={h2Class}>
                {t.rich(`${id}.steps.title`, navyTags)}
              </h2>
              <ol className="flex flex-col gap-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
                    >
                      {index + 1}
                    </span>
                    <span className="text-[15px] leading-[1.55] text-navy-link md:text-base">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            {screens.steps.length ? (
              <div className="flex min-w-0 flex-[1.2_1_460px] items-end justify-center gap-4 md:gap-6">
                {screens.steps.map((visual, index) => (
                  <StepImage
                    key={index}
                    visual={visual}
                    index={index}
                    count={screens.steps.length}
                    alt={alts.steps[index]}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* 5. Neler yapabilirsiniz? */}
      <section aria-labelledby="urun-yetenekler" className="py-10 md:py-12">
        <Container className="flex flex-wrap gap-x-12 gap-y-6">
          <Reveal className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
            <h2
              id="urun-yetenekler"
              className="text-[28px] leading-[1.15] font-extrabold md:text-4xl"
            >
              {tc("capabilitiesTitle")}
            </h2>
            <p className={leadClass}>{t(`${id}.capabilitiesText`)}</p>
          </Reveal>
          <ul className="grid min-w-0 flex-[2_1_560px] content-start gap-x-8 gap-y-3.5 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
            {capabilities.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-[15px] leading-normal md:text-base"
              >
                <Check
                  className="size-[22px] shrink-0 text-primary dark:text-accent"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 6. İlgili özellikler (6.4: en az 2 ürün + çözüm + demo linki) */}
      <section aria-labelledby="ilgili-ozellikler" className="py-10 md:py-12">
        <Container className="flex flex-col gap-6 md:gap-8">
          <Reveal className="flex max-w-[720px] flex-col gap-3">
            <h2 id="ilgili-ozellikler" className={h2Class}>
              {tc("relatedTitle")}
            </h2>
            <p className={leadClass}>{tc("relatedText", { product: label })}</p>
          </Reveal>
          <ul className="grid gap-4 md:grid-cols-3">
            {links.related.map((relatedId, index) => (
              <Reveal key={relatedId} as="li" index={index}>
                <ProductCard product={getProductById(relatedId)} />
              </Reveal>
            ))}
          </ul>
          <ArrowLink href={PAGES[links.solution].href}>
            {tc("solution", { solution: tp(`${links.solution}.label`) })}
          </ArrowLink>
        </Container>
      </section>

      {/* 7. CTA */}
      <ProductCta id="urun-cta" title={t.rich(`${id}.cta`, navyTags)} />

      <SoftwareAppSchema
        locale={locale}
        description={tp(`${id}.metaDescription`)}
        url={absoluteUrl(locale, PAGES[id].href)}
        featureList={capabilities}
      />
    </>
  );
}

/** Kurulum bandındaki görsel: afiş, telefon veya tarayıcı çerçevesi; bandın altına yaslanır. */
function StepImage({
  visual,
  index,
  count,
  alt,
}: {
  visual: StepVisual;
  index: number;
  count: number;
  alt: string;
}) {
  const second = index === 1;
  switch (visual.kind) {
    case "poster":
      return (
        <Image
          src={visual.shot.src}
          alt={alt}
          sizes="280px"
          className={cn(
            "block h-auto",
            second
              ? "mb-10 w-[240px] max-w-[42%] rounded-2xl"
              : "w-[280px] max-w-[55%] rounded-t-[14px]",
          )}
        />
      );
    case "phone":
      return (
        <PhoneFrame
          sizes="(min-width: 768px) 200px, 40vw"
          // Bandın altından taşar (overflow-hidden keser); ikinci telefon biraz daha yukarıda durur
          className={cn(
            "w-[min(40vw,200px)] shrink-0 bg-phone-frame-navy shadow-none md:w-[200px]",
            second ? "-mb-6" : "-mb-20",
            count === 1 && "w-[min(56vw,230px)] md:w-[230px]",
          )}
          screens={[{ src: visual.shot.src, alt }]}
        />
      );
    case "browser":
      return <StepBrowser shot={visual.shot} alt={alt} />;
  }
}

function StepBrowser({ shot, alt }: { shot: Shot; alt: string }) {
  return (
    <BrowserFrame
      url={null}
      onDark
      className="w-full max-w-[620px] rounded-b-none border-b-0 shadow-none"
      image={{ src: shot.src, alt, sizes: "(min-width: 1024px) 620px, 100vw" }}
      darkImage={shot.dark ? { src: shot.dark, alt } : undefined}
    />
  );
}
