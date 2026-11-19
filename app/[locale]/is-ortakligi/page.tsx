import { BadgePercent, Handshake, LayoutDashboard, MapPinned } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { FormMessages } from "@/components/forms/form-messages";
import { PartnerForm } from "@/components/forms/partner-form";
import { BrowserFrame } from "@/components/mockups/browser-frame";
import { Reveal } from "@/components/motion/reveal";
import {
  ArrowLink,
  CheckList,
  Pill,
  h2Class,
  leadClass,
  richTags,
} from "@/components/sections/home/parts";
import { IconCard } from "@/components/sections/icon-card";
import { PROVINCES } from "@/config/provinces";
import { pageMetadata } from "@/lib/seo";
import companies from "@/public/screenshots/admin/coklu-sirket-sube-yonetimi.webp";

export async function generateMetadata({ params }: PageProps<"/[locale]/is-ortakligi">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "partners");
}

const BENEFITS = [
  { key: "panel", icon: LayoutDashboard },
  { key: "crm", icon: Handshake },
  { key: "region", icon: MapPinned },
  { key: "recurring", icon: BadgePercent },
] as const;

/**
 * İş Ortaklığı (onaylı plan): faydalar, bayi paneli (CRM) bölümü, süreç adımları,
 * başvuru formu ve /bayiler bağlantısı (iki yönlü link, 4.7).
 */
export default async function PartnersPage({
  params,
}: PageProps<"/[locale]/is-ortakligi">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("partnersPage");
  const steps = t.raw("steps.items") as { title: string; text: string }[];
  const provinces = PROVINCES.map((p) => ({ value: p.slug, label: p.name }));

  return (
    <>
      <PageHeader id="partners" locale={locale} />

      {/* 1. Neden QR Zaman bayisi? */}
      <section aria-labelledby="neden-bayi" className="pt-14 pb-8 md:pt-24 md:pb-12">
        <Container className="flex flex-col gap-8 md:gap-11">
          <Reveal className="flex max-w-[760px] flex-col gap-3.5">
            <Pill>{t("benefits.eyebrow")}</Pill>
            <h2 id="neden-bayi" className={h2Class}>
              {t.rich("benefits.title", richTags())}
            </h2>
            <p className={leadClass}>{t("benefits.text")}</p>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ key, icon }, index) => (
              <IconCard
                key={key}
                icon={icon}
                index={index}
                title={t(`benefits.items.${key}.title`)}
                text={t(`benefits.items.${key}.text`)}
              />
            ))}
          </ul>
        </Container>
      </section>

      {/* 2. Bayi paneli */}
      <section aria-labelledby="bayi-paneli" className="py-8 md:py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal className="order-2 min-w-0 lg:order-1">
            <BrowserFrame
              className="shadow-frame"
              url={null}
              image={{
                src: companies,
                alt: t("panel.alt"),
                sizes: "(min-width: 1024px) 600px, 100vw",
              }}
            />
          </Reveal>
          <Reveal index={1} className="order-1 flex min-w-0 flex-col gap-5 lg:order-2">
            <h2 id="bayi-paneli" className={h2Class}>
              {t.rich("panel.title", richTags())}
            </h2>
            <p className={leadClass}>{t("panel.text")}</p>
            <CheckList items={t.raw("panel.items") as string[]} />
            <ArrowLink href="/urunler/musteri-yonetimi">{t("panel.link")}</ArrowLink>
          </Reveal>
        </Container>
      </section>

      {/* 3. Süreç */}
      <section aria-labelledby="bayilik-sureci" className="bg-surface py-14 md:py-24">
        <Container className="flex flex-col gap-8 md:gap-11">
          <Reveal className="flex max-w-[760px] flex-col gap-3.5">
            <h2 id="bayilik-sureci" className={h2Class}>
              {t.rich("steps.title", richTags())}
            </h2>
          </Reveal>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal
                key={step.title}
                as="li"
                index={index}
                className="flex flex-col gap-3 rounded-[20px] bg-background p-6 md:p-7 dark:bg-card"
              >
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground"
                >
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* 4. Başvuru formu */}
      <section aria-labelledby="bayilik-basvurusu" className="py-14 md:py-24">
        <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14">
          <Reveal className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <h2 id="bayilik-basvurusu" className={h2Class}>
              {t.rich("form.title", richTags())}
            </h2>
            <p className={leadClass}>{t("form.text")}</p>
            <div className="flex flex-col gap-2 rounded-[20px] bg-surface p-6">
              <p className="font-bold">{t("dealers.title")}</p>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {t("dealers.text")}
              </p>
              <ArrowLink href="/bayiler" className="mt-1">
                {t("dealers.link")}
              </ArrowLink>
            </div>
          </Reveal>
          <div className="min-w-0">
            <FormMessages>
              <PartnerForm provinces={provinces} />
            </FormMessages>
          </div>
        </Container>
      </section>
    </>
  );
}
