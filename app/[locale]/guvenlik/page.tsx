import {
  Camera,
  EyeOff,
  KeyRound,
  LockKeyhole,
  MapPinCheck,
  Smartphone,
  UserCog,
} from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { BrowserFrame } from "@/components/mockups/browser-frame";
import { Reveal } from "@/components/motion/reveal";
import { FaqList, FaqSchema, type FaqItem } from "@/components/sections/faq-list";
import {
  ArrowLink,
  CheckList,
  Pill,
  h2Class,
  leadClass,
  richTags,
} from "@/components/sections/home/parts";
import { IconCard } from "@/components/sections/icon-card";
import { ProductCta } from "@/components/sections/product/product-cta";
import { PAGES, type PageId } from "@/config/navigation";
import { pageMetadata } from "@/lib/seo";
import scopesForm from "@/public/screenshots/admin/kullanici-yetki-alanlari.webp";

export async function generateMetadata({ params }: PageProps<"/[locale]/guvenlik">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "security");
}

// Her madde docs/ozellikler.md ve yayımlanan gizlilik metnindeki gerçek uygulamalara dayanır.
const LAYERS = [
  { key: "roles", icon: UserCog },
  { key: "device", icon: Smartphone },
  { key: "location", icon: MapPinCheck },
  { key: "camera", icon: Camera },
  { key: "encryption", icon: LockKeyhole },
  { key: "noTracking", icon: EyeOff },
] as const;

const LEGAL_LINKS: PageId[] = ["kvkk", "privacy", "cookies", "terms", "deleteAccount"];

/**
 * Güvenlik & KVKK (onaylı plan): giriş + yetki alanları görseli, güvenlik katmanları,
 * KVKK (roller, haklar, yasal metin linkleri), SSS, CTA.
 */
export default async function SecurityPage({ params }: PageProps<"/[locale]/guvenlik">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("securityPage");
  const tp = await getTranslations("pages");
  const faq = t.raw("faq.items") as FaqItem[];

  return (
    <>
      <PageHeader id="security" locale={locale} />

      {/* 1. Giriş */}
      <section aria-labelledby="guvenlik-giris" className="py-14 md:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal className="flex min-w-0 flex-col gap-5">
            <Pill>{t("intro.eyebrow")}</Pill>
            <h2 id="guvenlik-giris" className={h2Class}>
              {t.rich("intro.title", richTags())}
            </h2>
            <p className={leadClass}>{t("intro.text")}</p>
            <CheckList items={t.raw("intro.items") as string[]} />
          </Reveal>
          <Reveal index={1} className="min-w-0">
            <BrowserFrame
              className="shadow-frame"
              url={null}
              image={{
                src: scopesForm,
                alt: t("intro.alt"),
                sizes: "(min-width: 1024px) 600px, 100vw",
              }}
            />
          </Reveal>
        </Container>
      </section>

      {/* 2. Güvenlik katmanları */}
      <section
        aria-labelledby="guvenlik-katmanlari"
        className="bg-surface py-14 md:py-24"
      >
        <Container className="flex flex-col gap-8 md:gap-11">
          <Reveal className="flex max-w-[760px] flex-col gap-3.5">
            <h2 id="guvenlik-katmanlari" className={h2Class}>
              {t.rich("layers.title", richTags())}
            </h2>
            <p className={leadClass}>{t("layers.text")}</p>
          </Reveal>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {LAYERS.map(({ key, icon }, index) => (
              <IconCard
                key={key}
                icon={icon}
                index={index}
                className="bg-background"
                title={t(`layers.items.${key}.title`)}
                text={t(`layers.items.${key}.text`)}
              />
            ))}
          </ul>
        </Container>
      </section>

      {/* 3. KVKK */}
      <section aria-labelledby="kvkk-uyumu" className="py-14 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex min-w-0 flex-col gap-5">
            <Pill>{t("kvkk.eyebrow")}</Pill>
            <h2 id="kvkk-uyumu" className={h2Class}>
              {t.rich("kvkk.title", richTags())}
            </h2>
            {(t.raw("kvkk.paragraphs") as string[]).map((p) => (
              <p key={p} className={leadClass}>
                {p}
              </p>
            ))}
          </Reveal>
          <div className="flex min-w-0 flex-col gap-5">
            <Reveal
              index={1}
              className="flex flex-col gap-4 rounded-[20px] border border-border p-6 md:p-7 dark:bg-surface"
            >
              <h3 className="flex items-center gap-2.5 text-lg font-bold">
                <KeyRound
                  className="size-5 text-primary dark:text-accent"
                  aria-hidden="true"
                />
                {t("kvkk.rightsTitle")}
              </h3>
              <CheckList items={t.raw("kvkk.rights") as string[]} />
            </Reveal>
            <Reveal
              index={2}
              className="flex flex-col gap-3 rounded-[20px] bg-surface p-6 md:p-7"
            >
              <h3 className="text-lg font-bold">{t("kvkk.linksTitle")}</h3>
              <ul className="flex flex-col gap-2.5">
                {LEGAL_LINKS.map((id) => (
                  <li key={id}>
                    <ArrowLink href={PAGES[id].href} className="text-[15px]">
                      {tp(`${id}.label`)}
                    </ArrowLink>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 4. SSS */}
      <section aria-labelledby="guvenlik-sss" className="py-8 md:py-12">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14">
          <Reveal className="flex flex-col gap-3">
            <h2 id="guvenlik-sss" className={h2Class}>
              {t.rich("faq.title", richTags())}
            </h2>
          </Reveal>
          <div className="flex flex-col gap-3">
            <FaqList items={faq} />
          </div>
        </Container>
      </section>
      <FaqSchema items={faq} />

      <ProductCta id="guvenlik-cta" title={t.rich("cta", richTags(true))} />
    </>
  );
}
