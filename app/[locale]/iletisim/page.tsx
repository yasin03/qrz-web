import { Headset, Mail, MapPin, MapPinned, Phone, Presentation } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ContactPage as ContactPageSchema } from "schema-dts";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/forms/contact-form";
import { FormMessages } from "@/components/forms/form-messages";
import { ArrowLink } from "@/components/sections/home/parts";
import { IconCard, cardLinkClass } from "@/components/sections/icon-card";
import { JsonLd } from "@/components/seo/json-ld";
import { ORG_ID } from "@/components/seo/site-schema";
import { CONTACT } from "@/config/site";
import type { AppPathname } from "@/i18n/routing";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/iletisim">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "contact");
}

/**
 * İletişim (onaylı plan): iletişim kartları, form + yönlendirme kartları
 * ("Size en yakın bayiyi bulun", destek, demo), ContactPage + Organization/ContactPoint JSON-LD.
 */
export default async function ContactPage({ params }: PageProps<"/[locale]/iletisim">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");
  const phone: string = CONTACT.phone;
  const email: string = CONTACT.email;
  const address: readonly string[] = CONTACT.address.lines;

  const shortcuts: {
    key: "dealers" | "support" | "demo";
    href: AppPathname;
    icon: typeof Phone;
  }[] = [
    { key: "dealers", href: "/bayiler", icon: MapPinned },
    { key: "support", href: "/destek", icon: Headset },
    { key: "demo", href: "/demo-talep", icon: Presentation },
  ];

  return (
    <>
      <PageHeader id="contact" locale={locale} />

      {/* 1. İletişim bilgileri */}
      <section
        aria-labelledby="iletisim-bilgileri"
        className="pt-14 pb-8 md:pt-20 md:pb-12"
      >
        <Container className="flex flex-col gap-6">
          <h2
            id="iletisim-bilgileri"
            className="text-[26px] leading-tight font-extrabold md:text-[32px]"
          >
            {t("channels.title")}
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            <IconCard
              icon={Phone}
              title={t("channels.phone.title")}
              text={t("channels.phone.text")}
            >
              {phone ? (
                <a href={`tel:${phone}`} className={cardLinkClass}>
                  {CONTACT.phoneDisplay}
                </a>
              ) : (
                <span className="font-bold text-muted-foreground">
                  {t("placeholders.phone")}
                </span>
              )}
            </IconCard>
            <IconCard
              icon={Mail}
              index={1}
              title={t("channels.email.title")}
              text={t("channels.email.text")}
            >
              {email ? (
                <a href={`mailto:${email}`} className={cardLinkClass}>
                  {email}
                </a>
              ) : (
                <span className="font-bold text-muted-foreground">
                  {t("placeholders.email")}
                </span>
              )}
            </IconCard>
            <IconCard icon={MapPin} index={2} title={t("channels.address.title")}>
              {address.length ? (
                <address className="text-[15px] leading-relaxed font-semibold not-italic">
                  {address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              ) : (
                <span className="font-bold text-muted-foreground">
                  {t("placeholders.address")}
                </span>
              )}
            </IconCard>
          </ul>
        </Container>
      </section>

      {/* 2. Form + yönlendirmeler */}
      <section aria-labelledby="iletisim-formu" className="py-8 pb-16 md:py-12 md:pb-28">
        <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2
                id="iletisim-formu"
                className="text-[26px] leading-tight font-extrabold md:text-[32px]"
              >
                {t("form.title")}
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground md:text-base">
                {t("form.text")}
              </p>
            </div>
            <FormMessages>
              <ContactForm />
            </FormMessages>
          </div>
          <aside
            aria-labelledby="iletisim-kisayollar"
            className="flex min-w-0 flex-col gap-4"
          >
            <h2 id="iletisim-kisayollar" className="text-xl font-bold">
              {t("shortcuts.title")}
            </h2>
            <ul className="flex flex-col gap-4">
              {shortcuts.map(({ key, href, icon }, index) => (
                <IconCard
                  key={key}
                  icon={icon}
                  index={index}
                  title={t(`shortcuts.${key}.title`)}
                  text={t(`shortcuts.${key}.text`)}
                >
                  <ArrowLink href={href}>{t(`shortcuts.${key}.link`)}</ArrowLink>
                </IconCard>
              ))}
            </ul>
          </aside>
        </Container>
      </section>

      <JsonLd<ContactPageSchema>
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: absoluteUrl(locale, "/iletisim"),
          name: t("schemaName"),
          inLanguage: locale,
          about: { "@id": ORG_ID },
        }}
      />
    </>
  );
}
