import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Features } from "@/components/sections/home/features";
import { Hero } from "@/components/sections/home/hero";
import { MobileGallery } from "@/components/sections/home/mobile-gallery";
import { Platform } from "@/components/sections/home/platform";
import { Proof, ReferenceLogos } from "@/components/sections/home/proof";
import { Steps } from "@/components/sections/home/steps";
import { ToolsFaq } from "@/components/sections/home/tools-faq";
import { Marquee } from "@/components/sections/marquee";
import { SoftwareAppSchema } from "@/components/seo/site-schema";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  return pageMetadata(locale as Locale, "home");
}

const MARQUEE_KEYS = [
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

/** Ana sayfa (4.4, ana-sayfa-acik.html). 9. bölüm (footer) layout'tadır. */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const mq = await getTranslations("marquee");
  const tp = await getTranslations("pages.home");

  return (
    <>
      <Hero />
      <Proof />
      <Platform />
      <ReferenceLogos />
      <Features />
      <MobileGallery />
      <Steps />
      <ToolsFaq />
      {/* Kayan özellik şeridi: sayfanın en altında, footer'ın hemen üstünde */}
      <Marquee
        label={mq("label")}
        items={MARQUEE_KEYS.map((key) => mq(`items.${key}`))}
        className="border-t border-b-0"
      />
      <SoftwareAppSchema locale={locale as Locale} description={tp("metaDescription")} />
    </>
  );
}
