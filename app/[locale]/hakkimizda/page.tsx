import { HeartHandshake, Scale, ShieldCheck, Sparkles } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { BrowserFrame } from "@/components/mockups/browser-frame";
import { Reveal } from "@/components/motion/reveal";
import { Pill, h2Class, leadClass, richTags } from "@/components/sections/home/parts";
import { Platform } from "@/components/sections/home/platform";
import { Proof } from "@/components/sections/home/proof";
import { IconCard } from "@/components/sections/icon-card";
import { ProductCta } from "@/components/sections/product/product-cta";
import { pageMetadata } from "@/lib/seo";
import dashboard from "@/public/screenshots/admin/qr-zaman-yonetici-paneli.webp";
import dashboardDark from "@/public/screenshots/admin/qr-zaman-yonetici-paneli-koyu.webp";

export async function generateMetadata({ params }: PageProps<"/[locale]/hakkimizda">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "about");
}

const VALUES = [
  { key: "simple", icon: Sparkles },
  { key: "compliance", icon: Scale },
  { key: "security", icon: ShieldCheck },
  { key: "support", icon: HeartHandshake },
] as const;

/**
 * Hakkımızda (onaylı plan): hikaye + panel görseli, rakamlar, tek platform (5 kategori),
 * değerler, CTA. TODO: metin geçicidir (kullanıcı onayıyla), gerçek şirket hikayesiyle güncellenecek.
 */
export default async function AboutPage({ params }: PageProps<"/[locale]/hakkimizda">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");
  const m = await getTranslations("mockups");
  const story = t.raw("story.paragraphs") as string[];

  return (
    <>
      <PageHeader id="about" locale={locale} />

      {/* 1. Hikaye */}
      <section aria-labelledby="hikayemiz" className="py-14 md:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal className="flex min-w-0 flex-col gap-5">
            <Pill>{t("story.eyebrow")}</Pill>
            <h2 id="hikayemiz" className={h2Class}>
              {t.rich("story.title", richTags())}
            </h2>
            {story.map((paragraph) => (
              <p key={paragraph} className={leadClass}>
                {paragraph}
              </p>
            ))}
          </Reveal>
          <Reveal index={1} className="min-w-0">
            <BrowserFrame
              className="shadow-frame"
              url={m("browserUrl")}
              image={{
                src: dashboard,
                alt: t("story.alt"),
                sizes: "(min-width: 1024px) 600px, 100vw",
              }}
              darkImage={{ src: dashboardDark, alt: t("story.alt") }}
            />
          </Reveal>
        </Container>
      </section>

      {/* 2. Rakamlar (ana sayfadaki bölüm) */}
      <Proof />

      {/* 3. Ne yapıyoruz: tek platform */}
      <Platform />

      {/* 4. Değerler */}
      <section aria-labelledby="degerlerimiz" className="py-12 md:py-20">
        <Container className="flex flex-col gap-8 md:gap-11">
          <Reveal className="flex max-w-[760px] flex-col gap-3.5">
            <Pill>{t("values.eyebrow")}</Pill>
            <h2 id="degerlerimiz" className={h2Class}>
              {t.rich("values.title", richTags())}
            </h2>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ key, icon }, index) => (
              <IconCard
                key={key}
                icon={icon}
                index={index}
                title={t(`values.items.${key}.title`)}
                text={t(`values.items.${key}.text`)}
              />
            ))}
          </ul>
        </Container>
      </section>

      <ProductCta id="hakkimizda-cta" title={t.rich("cta", richTags(true))} />
    </>
  );
}
