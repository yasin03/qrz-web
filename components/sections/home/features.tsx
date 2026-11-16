import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { BrowserFrame } from "@/components/mockups/browser-frame";
import { PhoneFrame } from "@/components/mockups/phone-frame";
import { cn } from "@/lib/utils";
import a4Poster from "@/public/screenshots/admin/a4-qr-afisi.webp";
import payrollDark from "@/public/screenshots/admin/bordro-hesaplama-detayi-koyu.webp";
import payroll from "@/public/screenshots/admin/bordro-hesaplama-detayi.webp";
import leaveApproval from "@/public/screenshots/admin/izin-talebi-onay.webp";
import qrDownload from "@/public/screenshots/admin/lokasyon-qr-noktasi.webp";
import pdksDetail from "@/public/screenshots/admin/pdks-giris-cikis-detayi.webp";
import timesheet from "@/public/screenshots/admin/puantaj-cizelgesi.webp";
import companies from "@/public/screenshots/admin/sirket-bolum-yonetimi.webp";
import phoneAdvance from "@/public/screenshots/mobile/mobil-avans-talebi.webp";
import phoneLeave from "@/public/screenshots/mobile/mobil-izin-talepleri.webp";
import phoneTimesheet from "@/public/screenshots/mobile/mobil-puantaj.webp";
import phoneQr from "@/public/screenshots/mobile/mobil-qr-giris-cikis-secimi.webp";
import { FeatureSplit } from "./feature-split";
import { ArrowLink, CheckList, richTags } from "./parts";

const FRAME_SIZES = "(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw";
const frameClass = "shadow-frame";
const overlayPhone =
  "absolute -bottom-10 hidden w-[180px] rounded-[34px] p-[7px] md:block";

/** 5. Özellik bölümleri (sırasıyla): PDKS, Lokasyon & QR, Puantaj, Bordro, İzin & Avans, Çoklu Şirket. */
export async function Features() {
  const t = await getTranslations("home.features");
  const tags = richTags();

  return (
    <>
      {/* PDKS */}
      <FeatureSplit
        id="ozellik-pdks"
        eyebrow={t("pdks.eyebrow")}
        title={t.rich("pdks.title", tags)}
        description={t("pdks.description")}
        visual={
          <div className="relative md:pr-24">
            <BrowserFrame
              url={null}
              className={frameClass}
              image={{ src: pdksDetail, alt: t("pdks.imageAlt"), sizes: FRAME_SIZES }}
            />
            <PhoneFrame
              className={cn(overlayPhone, "right-0")}
              sizes="180px"
              screens={[{ src: phoneQr, alt: t("pdks.phoneAlt") }]}
            />
          </div>
        }
      >
        <CheckList items={t.raw("pdks.bullets") as string[]} />
        <ArrowLink href="/urunler/qr-kodlu-pdks">{t("pdks.link")}</ArrowLink>
      </FeatureSplit>

      {/* Lokasyon & QR */}
      <FeatureSplit
        id="ozellik-lokasyon"
        panel
        reverse
        alignVisualEnd
        eyebrow={t("location.eyebrow")}
        title={t.rich("location.title", tags)}
        description={t("location.description")}
        visual={
          <div className="flex items-end justify-center gap-6">
            <Image
              src={a4Poster}
              alt={t("location.posterAlt")}
              sizes="(min-width: 1024px) 300px, 220px"
              className="block h-auto w-[220px] rounded-t-xl shadow-frame md:w-[300px] md:max-w-[55%] md:rounded-t-[14px]"
            />
            <Image
              src={qrDownload}
              alt={t("location.downloadAlt")}
              sizes="250px"
              className="mb-10 hidden h-auto w-[250px] max-w-[42%] rounded-2xl border border-border shadow-frame md:block"
            />
          </div>
        }
      >
        <CheckList items={t.raw("location.bullets") as string[]} />
      </FeatureSplit>

      {/* Puantaj */}
      <FeatureSplit
        id="ozellik-puantaj"
        reverse
        eyebrow={t("timesheet.eyebrow")}
        title={t.rich("timesheet.title", tags)}
        description={t("timesheet.description")}
        visual={
          <div className="relative md:pl-24">
            <BrowserFrame
              url={null}
              className={frameClass}
              image={{ src: timesheet, alt: t("timesheet.imageAlt"), sizes: FRAME_SIZES }}
            />
            <PhoneFrame
              className={cn(overlayPhone, "left-0")}
              sizes="180px"
              screens={[{ src: phoneTimesheet, alt: t("timesheet.phoneAlt") }]}
            />
          </div>
        }
      >
        <ArrowLink href="/urunler/puantaj">{t("timesheet.link")}</ArrowLink>
      </FeatureSplit>

      {/* Bordro */}
      <FeatureSplit
        id="ozellik-bordro"
        className="md:pt-24"
        eyebrow={t("payroll.eyebrow")}
        title={t.rich("payroll.title", tags)}
        description={t("payroll.description")}
        visual={
          <BrowserFrame
            url={null}
            className={frameClass}
            image={{ src: payroll, alt: t("payroll.imageAlt"), sizes: FRAME_SIZES }}
            darkImage={{ src: payrollDark, alt: t("payroll.imageAlt") }}
          />
        }
      >
        <ArrowLink href="/urunler/bordro">{t("payroll.link")}</ArrowLink>
      </FeatureSplit>

      {/* İzin & Avans */}
      <FeatureSplit
        id="ozellik-izin-avans"
        panel
        eyebrow={t("leave.eyebrow")}
        title={t.rich("leave.title", tags)}
        description={t("leave.description")}
        visual={
          <div className="flex items-center justify-center gap-3 md:gap-5">
            <PhoneFrame
              className="w-[46%] max-w-[200px] shrink-0 rounded-[36px] p-[7px] md:w-[200px] xl:w-[170px]"
              sizes="200px"
              screens={[{ src: phoneLeave, alt: t("leave.leaveAlt") }]}
            />
            <PhoneFrame
              className="mt-16 w-[46%] max-w-[200px] shrink-0 rounded-[36px] p-[7px] md:w-[200px] xl:w-[170px]"
              sizes="200px"
              screens={[{ src: phoneAdvance, alt: t("leave.advanceAlt") }]}
            />
            <Image
              src={leaveApproval}
              alt={t("leave.adminAlt")}
              sizes="250px"
              className="hidden h-auto w-[250px] shrink-0 rounded-[14px] shadow-frame xl:block"
            />
          </div>
        }
      />

      {/* Çoklu Şirket & Şube */}
      <FeatureSplit
        id="ozellik-coklu-sirket"
        className="md:pb-28"
        eyebrow={t("multiCompany.eyebrow")}
        title={t.rich("multiCompany.title", tags)}
        description={t("multiCompany.description")}
        visual={
          <BrowserFrame
            url={null}
            className={frameClass}
            image={{
              src: companies,
              alt: t("multiCompany.imageAlt"),
              sizes: FRAME_SIZES,
            }}
          />
        }
      >
        <ul
          aria-label={t("multiCompany.treeLabel")}
          className="flex max-w-[360px] flex-col gap-2 text-sm"
        >
          {(t.raw("multiCompany.tree") as string[]).map((node, depth, all) => {
            const last = depth === all.length - 1;
            return (
              <li
                key={node}
                style={{ marginLeft: depth * 24 }}
                className={cn(
                  "rounded-[10px] border px-3.5 py-2.5 font-semibold",
                  last
                    ? "border-primary bg-info text-info-foreground"
                    : "border-chip-border text-chip-foreground",
                )}
              >
                {node}
              </li>
            );
          })}
        </ul>
      </FeatureSplit>
    </>
  );
}
