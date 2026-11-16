import { CircleCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { StoreBadges } from "@/components/layout/store-badges";
import { PhoneFrame } from "@/components/mockups/phone-frame";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import home from "@/public/screenshots/mobile/mobil-uygulama-ana-sayfa.webp";
import qr from "@/public/screenshots/mobile/mobil-qr-giris-cikis-secimi.webp";
import pdks from "@/public/screenshots/mobile/mobil-pdks-kayitlari.webp";
import advances from "@/public/screenshots/mobile/mobil-avans-listesi.webp";
import earnings from "@/public/screenshots/mobile/mobil-ek-odemeler.webp";
import records from "@/public/screenshots/mobile/mobil-ozluk-bilgileri.webp";
import { Pill, richTags } from "./parts";

const SCREENS = [home, qr, pdks, advances, earnings, records];

/** 6. Mobil uygulama: "QR okut, mesain başlasın." + 6 telefonluk galeri. */
export async function MobileGallery() {
  const t = await getTranslations("home.mobile");
  const alts = t.raw("screens") as string[];

  return (
    <section
      aria-labelledby="mobil-uygulama"
      className="overflow-hidden bg-navy py-12 md:py-28"
    >
      <Container className="flex flex-wrap items-end justify-between gap-6 md:gap-8">
        <Reveal className="flex max-w-[640px] flex-[1_1_520px] flex-col gap-3.5 md:gap-[18px]">
          <Pill>{t("eyebrow")}</Pill>
          <h2
            id="mobil-uygulama"
            className="text-[32px] leading-[1.06] font-extrabold text-navy-foreground md:text-5xl"
          >
            {t.rich("title", richTags(true))}
          </h2>
          <p className="text-[15px] leading-relaxed text-navy-muted md:text-lg">
            {t("description")}
          </p>
          <ul className="grid max-w-[480px] grid-cols-2 gap-3">
            {(t.raw("bullets") as string[]).map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm text-navy-foreground md:text-[15px]"
              >
                <CircleCheck
                  className="size-[18px] shrink-0 text-accent"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <StoreBadges tone="solidLg" className="hidden md:flex" />
      </Container>

      {/* Taşarsa yatay kaydırılır (sayfa değil, yalnızca galeri) */}
      <div
        role="region"
        aria-label={t("galleryLabel")}
        tabIndex={0}
        className="mt-7 overflow-x-auto px-4 pb-2 focus-visible:outline-2 focus-visible:outline-accent sm:px-6 md:mt-16"
      >
        <ul className="mx-auto flex w-max items-start gap-3.5 md:gap-6">
          {SCREENS.map((src, index) => (
            <Reveal key={index} as="li" index={index}>
              <PhoneFrame
                className={cn(
                  "w-[170px] rounded-[32px] bg-phone-frame-navy p-1.5 shadow-none md:w-[196px] md:rounded-[36px] md:p-[7px]",
                  index % 2 === 1 && "md:mt-12",
                )}
                sizes="(min-width: 768px) 196px, 170px"
                screens={[{ src, alt: alts[index] }]}
              />
            </Reveal>
          ))}
        </ul>
      </div>
      {/* Mobilde rozetler galerinin altında (mobil-ana-sayfa.html) */}
      <Container className="pt-6 md:hidden">
        <StoreBadges tone="solidLg" />
      </Container>
    </section>
  );
}
