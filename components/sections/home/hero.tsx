import { ArrowRight, CircleCheck, Clock, Hourglass } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/section";
import { StoreBadges } from "@/components/layout/store-badges";
import { BrowserFrame } from "@/components/mockups/browser-frame";
import { PhoneFrame } from "@/components/mockups/phone-frame";
import { QrPoster } from "@/components/mockups/qr-poster";
import { ToastCard } from "@/components/mockups/toast-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import dashboard from "@/public/screenshots/admin/qr-zaman-yonetici-paneli.webp";
import dashboardDark from "@/public/screenshots/admin/qr-zaman-yonetici-paneli-koyu.webp";
import poster from "@/public/screenshots/admin/a4-qr-afisi.webp";
import phoneHome from "@/public/screenshots/mobile/mobil-uygulama-ana-sayfa.webp";
import phoneQr from "@/public/screenshots/mobile/mobil-qr-giris-cikis-secimi.webp";
import phoneLeave from "@/public/screenshots/mobile/mobil-izin-talepleri.webp";

const TOASTS = [
  { key: "shiftStarted", icon: Clock, tone: "info" },
  { key: "locationVerified", icon: CircleCheck, tone: "success" },
  { key: "pendingApproval", icon: Hourglass, tone: "warning" },
] as const;

/**
 * 1. Hero (lacivert): sol metin + CTA + mağaza rozetleri; sağda tarayıcıda panel,
 * önünde ekranları değişen telefon, eşzamanlı bildirim kartları, eğik A4 QR afişi
 * ve dönen rozet. Mobilde (mobil-ana-sayfa.html) yalnızca telefon + bildirim kartı.
 */
export async function Hero() {
  const t = await getTranslations("home.hero");
  const tp = await getTranslations("pages.home");
  const m = await getTranslations("mockups");

  return (
    <Section
      tone="hero"
      spacing="none"
      labelledBy="hero-baslik"
      // Sticky header hero'nun üzerinde şeffaf durur
      className="-mt-(--header-h) pt-(--header-h)"
      containerClassName="flex flex-wrap items-center gap-12 pt-7 pb-0 md:pt-16 md:pb-26"
    >
      <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-[18px] md:gap-6">
        <span className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground md:px-3.5 md:py-2 md:text-sm">
          {t("badge")}
        </span>
        <h1
          id="hero-baslik"
          className="text-[38px] leading-[1.06] font-extrabold text-navy-foreground md:text-[64px] md:leading-[1.04]"
        >
          {tp.rich("h1", {
            accent: (chunks) => <span className="block text-accent">{chunks}</span>,
          })}
        </h1>
        <p className="max-w-[540px] text-base leading-relaxed text-navy-muted md:text-[19px]">
          {tp("metaDescription")}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild size="xl" className="h-[52px] md:h-[54px]">
            <Link href="/demo-talep">
              {t("primaryCta")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="inverse" className="h-[52px] md:h-[54px]">
            <Link href="/urunler">{t("secondaryCta")}</Link>
          </Button>
        </div>
        <div className="hidden flex-wrap items-center gap-3 md:flex">
          <StoreBadges tone="hero" />
          <span className="text-sm text-navy-muted">{t("platforms")}</span>
        </div>
      </div>

      {/* Ürün görselleri */}
      <div className="relative h-[420px] w-full min-w-0 flex-[1.3_1_560px] md:h-auto md:pb-14 md:pl-[72px]">
        <BrowserFrame
          onDark
          aboveFold
          className="hidden md:block"
          url={m("browserUrl")}
          image={{
            src: dashboard,
            alt: t("dashboardAlt"),
            // Mobilde gizli: en küçük varyant seçilsin, gereksiz indirme olmasın
            sizes: "(min-width: 1280px) 680px, (min-width: 768px) 80vw, 16px",
          }}
          darkImage={{ src: dashboardDark, alt: t("dashboardAlt") }}
        />
        <PhoneFrame
          float
          aboveFold
          sizes="(min-width: 768px) 210px, 230px"
          className="relative mx-auto w-[230px] md:absolute md:bottom-0 md:left-0 md:mx-0 md:w-[210px]"
          screens={[
            { src: phoneHome, alt: t("phoneHomeAlt") },
            { src: phoneQr, alt: t("phoneQrAlt") },
            { src: phoneLeave, alt: t("phoneLeaveAlt") },
          ]}
        />
        <div className="absolute top-[240px] left-2 md:top-auto md:bottom-[120px] md:left-[170px]">
          {TOASTS.map(({ key, icon, tone }, index) => (
            <ToastCard
              key={key}
              className="absolute top-0 left-0 w-max md:top-auto md:bottom-0"
              icon={icon}
              tone={tone}
              title={m(`toasts.${key}.title`)}
              description={m(`toasts.${key}.description`)}
              cycle={{ index, total: 3 }}
            />
          ))}
        </div>
        <QrPoster
          className="absolute -right-4 -bottom-1.5 z-10 hidden md:block"
          image={{ src: poster, alt: t("posterAlt") }}
          caption={m("posterCaption")}
          badgeText={m("posterBadge")}
        />
      </div>
    </Section>
  );
}
