import { Mail, Phone } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { DemoForm } from "@/components/forms/demo-form";
import { FormMessages } from "@/components/forms/form-messages";
import { BrowserFrame } from "@/components/mockups/browser-frame";
import { Reveal } from "@/components/motion/reveal";
import { CheckList } from "@/components/sections/home/parts";
import { CONTACT } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import dashboard from "@/public/screenshots/admin/qr-zaman-yonetici-paneli.webp";
import dashboardDark from "@/public/screenshots/admin/qr-zaman-yonetici-paneli-koyu.webp";

export async function generateMetadata({ params }: PageProps<"/[locale]/demo-talep">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "demo");
}

/** Demo talep (onaylı plan): solda form, sağda "Demoda neler göreceksiniz" + panel görseli. */
export default async function DemoPage({ params }: PageProps<"/[locale]/demo-talep">) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("demoPage");
  const m = await getTranslations("mockups");
  const phone: string = CONTACT.phone;
  const email: string = CONTACT.email;

  return (
    <>
      <PageHeader id="demo" locale={locale} />
      <section aria-labelledby="demo-formu" className="py-14 md:py-20">
        <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2
                id="demo-formu"
                className="text-[26px] leading-tight font-extrabold md:text-[32px]"
              >
                {t("form.title")}
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground md:text-base">
                {t("form.text")}
              </p>
            </div>
            <FormMessages>
              <DemoForm />
            </FormMessages>
          </div>

          <aside
            aria-labelledby="demoda-neler-var"
            className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)]"
          >
            <Reveal className="flex flex-col gap-4 rounded-[20px] bg-surface p-6 md:p-7">
              <h2 id="demoda-neler-var" className="text-xl font-bold">
                {t("includes.title")}
              </h2>
              <CheckList items={t.raw("includes.items") as string[]} />
            </Reveal>
            <Reveal index={1}>
              <BrowserFrame
                className="shadow-frame"
                url={m("browserUrl")}
                image={{
                  src: dashboard,
                  alt: t("alt"),
                  sizes: "(min-width: 1024px) 480px, 100vw",
                }}
                darkImage={{ src: dashboardDark, alt: t("alt") }}
              />
            </Reveal>
            <div className="flex flex-col gap-2 text-[15px]">
              <p className="font-bold">{t("direct")}</p>
              <ul className="flex flex-col gap-1.5 text-muted-foreground">
                <li className="flex items-center gap-2.5">
                  <Phone
                    className="size-4 text-primary dark:text-accent"
                    aria-hidden="true"
                  />
                  {phone ? (
                    <a
                      href={`tel:${phone}`}
                      className="font-semibold text-foreground hover:underline"
                    >
                      {CONTACT.phoneDisplay}
                    </a>
                  ) : (
                    <span>{t("placeholders.phone")}</span>
                  )}
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail
                    className="size-4 text-primary dark:text-accent"
                    aria-hidden="true"
                  />
                  {email ? (
                    <a
                      href={`mailto:${email}`}
                      className="font-semibold text-foreground hover:underline"
                    >
                      {email}
                    </a>
                  ) : (
                    <span>{t("placeholders.email")}</span>
                  )}
                </li>
              </ul>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
