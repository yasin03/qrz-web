import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CircleCheck, Clock, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Section, SectionHeading } from "@/components/layout/section";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BrowserFrame } from "@/components/mockups/browser-frame";
import { PhoneFrame } from "@/components/mockups/phone-frame";
import { QrPoster } from "@/components/mockups/qr-poster";
import { ToastCard } from "@/components/mockups/toast-card";
import { Marquee } from "@/components/sections/marquee";
import dashboard from "@/public/screenshots/admin/qr-zaman-yonetici-paneli.webp";
import dashboardDark from "@/public/screenshots/admin/qr-zaman-yonetici-paneli-koyu.webp";
import poster from "@/public/screenshots/admin/a4-qr-afisi.webp";
import phoneHome from "@/public/screenshots/mobile/mobil-uygulama-ana-sayfa.webp";
import phoneQr from "@/public/screenshots/mobile/mobil-qr-giris-cikis-secimi.webp";
import phoneLeave from "@/public/screenshots/mobile/mobil-izin-talepleri.webp";

// Geliştirme amaçlı bileşen vitrini: production'da 404, asla indekslenmez.
export const metadata: Metadata = {
  title: "Bileşenler",
  robots: { index: false, follow: false },
};

export default async function ShowcasePage({
  params,
}: PageProps<"/[locale]/bilesenler">) {
  if (process.env.NODE_ENV === "production") notFound();

  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("showcase");
  const m = await getTranslations("mockups");
  const mq = await getTranslations("marquee");

  const marqueeKeys = [
    "pdks",
    "fakeGps",
    "shift",
    "timesheet",
    "payroll",
    "leaveAdvance",
    "poster",
    "excel",
    "multiCompany",
    "crm",
  ] as const;

  return (
    <main id="icerik">
      <Container className="flex flex-col gap-4 py-12">
        <h1 className="text-4xl font-extrabold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
        <div className="flex flex-wrap items-center gap-4">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </Container>

      <Section spacing="sm" labelledBy="buttons">
        <SectionHeading id="buttons" title={t("buttons")} align="start" />
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="xl">
            {t("primary")} <ArrowRight />
          </Button>
          <Button size="md" variant="outline">
            {t("outline")}
          </Button>
          <Button size="md" variant="ghost">
            {t("ghost")}
          </Button>
        </div>
      </Section>

      <Section tone="hero" spacing="md" labelledBy="frames">
        <SectionHeading id="frames" title={t("frames")} align="start" onDark />
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="xl">
            {t("primary")} <ArrowRight />
          </Button>
          <Button size="xl" variant="inverse">
            {t("inverse")}
          </Button>
          <Button size="md" variant="navy-ghost">
            {t("ghost")}
          </Button>
        </div>

        <div className="relative mt-12 pb-14 pl-0 md:pl-[72px]">
          <BrowserFrame
            onDark
            aboveFold
            url={m("browserUrl")}
            image={{ src: dashboard, alt: t("dashboardAlt") }}
            darkImage={{ src: dashboardDark, alt: t("dashboardAlt") }}
          />
          <PhoneFrame
            float
            className="absolute bottom-0 left-0 hidden md:block"
            screens={[
              { src: phoneHome, alt: t("phoneHomeAlt") },
              { src: phoneQr, alt: t("phoneQrAlt") },
              { src: phoneLeave, alt: t("phoneLeaveAlt") },
            ]}
          />
          <div className="absolute bottom-[120px] left-[170px] hidden md:block">
            <ToastCard
              className="absolute bottom-0 left-0 w-max"
              icon={Clock}
              tone="info"
              title={m("toasts.shiftStarted.title")}
              description={m("toasts.shiftStarted.description")}
              cycle={{ index: 0, total: 3 }}
            />
            <ToastCard
              className="absolute bottom-0 left-0 w-max"
              icon={CircleCheck}
              tone="success"
              title={m("toasts.locationVerified.title")}
              description={m("toasts.locationVerified.description")}
              cycle={{ index: 1, total: 3 }}
            />
            <ToastCard
              className="absolute bottom-0 left-0 w-max"
              icon={Hourglass}
              tone="warning"
              title={m("toasts.pendingApproval.title")}
              description={m("toasts.pendingApproval.description")}
              cycle={{ index: 2, total: 3 }}
            />
          </div>
          <QrPoster
            className="absolute -right-4 -bottom-1.5 z-10 hidden md:block"
            image={{ src: poster, alt: t("posterAlt") }}
            caption={m("posterCaption")}
            badgeText={m("posterBadge")}
          />
        </div>
      </Section>

      <Section spacing="sm" tone="surface" labelledBy="toasts-static">
        <SectionHeading id="toasts-static" title="ToastCard" align="start" />
        <div className="mt-8 flex flex-wrap gap-4">
          <ToastCard
            icon={Clock}
            title={m("toasts.shiftStarted.title")}
            description={m("toasts.shiftStarted.description")}
          />
          <ToastCard
            icon={CircleCheck}
            tone="success"
            title={m("toasts.locationVerified.title")}
            description={m("toasts.locationVerified.description")}
          />
          <ToastCard
            icon={Hourglass}
            tone="warning"
            title={m("toasts.pendingApproval.title")}
            description={m("toasts.pendingApproval.description")}
          />
        </div>
      </Section>

      <Section spacing="sm" contained={false} labelledBy="marquee">
        <Container>
          <SectionHeading id="marquee" title={t("marquee")} align="start" />
        </Container>
        <Marquee
          className="mt-8 border-t"
          label={mq("label")}
          items={marqueeKeys.map((key) => mq(`items.${key}`))}
        />
      </Section>
    </main>
  );
}
