import {
  ArrowRight,
  ExternalLink,
  Mail,
  MessagesSquare,
  Phone,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { BrowserFrame } from "@/components/mockups/browser-frame";
import { Reveal } from "@/components/motion/reveal";
import { richTags } from "@/components/sections/home/parts";
import { ProductCta } from "@/components/sections/product/product-cta";
import { PAGES, type PageId } from "@/config/navigation";
import { CONTACT, PANEL_URL, SUPPORT_HOURS } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import supportChat from "@/public/screenshots/admin/destek-talebi-mesajlasma.webp";
import supportList from "@/public/screenshots/admin/destek-talepleri.webp";

export async function generateMetadata({ params }: PageProps<"/[locale]/destek">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "support");
}

const RESOURCES: PageId[] = [
  "faq",
  "calculators",
  "mobileApp",
  "security",
  "deleteAccount",
];

/**
 * Destek (onaylı bölüm planı): başlık, destek kanalları (panel talebi, telefon, e-posta),
 * "Panelden destek talebi nasıl açılır?" (3 adım + 2 ekran), yardımcı kaynaklar, CTA.
 * Bilinmeyen bilgi (destek saatleri) yer tutucu metinle gösterilir, link verilmez.
 */
export default async function SupportPage({ params }: PageProps<"/[locale]/destek">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("supportPage");
  const tp = await getTranslations("pages");
  const m = await getTranslations("mockups");
  const steps = t.raw("steps.items") as string[];
  const phone: string = CONTACT.phone;
  const email: string = CONTACT.email;
  const hours: string = SUPPORT_HOURS[locale];

  const channels: {
    key: "panel" | "phone" | "email";
    icon: LucideIcon;
    value: ReactNode;
    href?: string;
    external?: boolean;
  }[] = [
    {
      key: "panel",
      icon: MessagesSquare,
      value: t("channels.panel.cta"),
      href: PANEL_URL,
      external: true,
    },
    {
      key: "phone",
      icon: Phone,
      value: phone ? CONTACT.phoneDisplay : t("placeholders.phone"),
      href: phone ? `tel:${phone}` : undefined,
    },
    {
      key: "email",
      icon: Mail,
      value: email || t("placeholders.email"),
      href: email ? `mailto:${email}` : undefined,
    },
  ];

  return (
    <>
      <PageHeader id="support" locale={locale} />

      {/* 1. Destek kanalları */}
      <section
        aria-labelledby="destek-kanallari"
        className="pt-14 pb-8 md:pt-20 md:pb-12"
      >
        <Container className="flex flex-col gap-6">
          <h2
            id="destek-kanallari"
            className="text-[26px] leading-tight font-extrabold md:text-[32px]"
          >
            {t("channels.title")}
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {channels.map(({ key, icon: Icon, value, href, external }, index) => (
              <Reveal
                key={key}
                as="li"
                index={index}
                className="flex flex-col gap-3 rounded-[20px] border border-border p-6 md:p-7 dark:bg-surface"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-info text-info-foreground">
                  <Icon className="size-[22px]" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold">{t(`channels.${key}.title`)}</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {t(`channels.${key}.text`)}
                </p>
                <div className="mt-auto pt-1">
                  {href ? (
                    <a
                      href={href}
                      {...(external
                        ? { target: "_blank", rel: "nofollow noopener" }
                        : {})}
                      className="inline-flex items-center gap-1.5 rounded text-base font-bold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-accent"
                    >
                      {value}
                      {external ? (
                        <ExternalLink className="size-4" aria-hidden="true" />
                      ) : null}
                    </a>
                  ) : (
                    <span className="text-base font-bold text-muted-foreground">
                      {value}
                    </span>
                  )}
                  {key === "phone" ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {hours || t("placeholders.hours")}
                    </p>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 2. Panelden destek talebi nasıl açılır? */}
      <section aria-labelledby="destek-adimlar" className="py-8 md:py-12">
        <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14">
          <Reveal className="flex min-w-0 flex-col gap-5">
            <h2
              id="destek-adimlar"
              className="text-[28px] leading-[1.15] font-extrabold text-balance md:text-[36px]"
            >
              {t.rich("steps.title", richTags())}
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground md:text-[17px]">
              {t("steps.text")}
            </p>
            <ol className="flex flex-col gap-3.5">
              {steps.map((step, index) => (
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
          <Reveal index={1} className="relative min-w-0 pb-16 md:pb-24">
            <BrowserFrame
              className="shadow-frame"
              url={`${m("browserUrl")}/destek`}
              image={{
                src: supportList,
                alt: t("steps.alts.list"),
                sizes: "(min-width: 1024px) 640px, 100vw",
              }}
            />
            <BrowserFrame
              url={null}
              className="absolute right-0 bottom-0 w-[62%] shadow-frame"
              image={{
                src: supportChat,
                alt: t("steps.alts.chat"),
                sizes: "(min-width: 1024px) 400px, 62vw",
              }}
            />
          </Reveal>
        </Container>
      </section>

      {/* 3. Yardımcı kaynaklar */}
      <section aria-labelledby="destek-kaynaklar" className="py-8 md:py-12">
        <Container className="flex flex-col gap-6">
          <h2
            id="destek-kaynaklar"
            className="text-[26px] leading-tight font-extrabold md:text-[32px]"
          >
            {t("resources.title")}
          </h2>
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            {RESOURCES.map((id) => (
              <li key={id}>
                <Link
                  href={PAGES[id].href}
                  className="group flex h-full flex-col gap-1 rounded-[14px] bg-surface p-4 transition-colors hover:bg-info focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:bg-card"
                >
                  <span className="flex items-center justify-between gap-2 text-[15px] font-bold group-hover:text-info-foreground">
                    {tp(`${id}.label`)}
                    <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t(`resources.items.${id}` as "resources.items.faq")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ProductCta id="destek-cta" title={t.rich("cta", richTags(true))} />
    </>
  );
}
