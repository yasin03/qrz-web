// Ürün sayfalarındaki ekran görüntüsü eşlemesi (Faz 4).
// Ayrı dosyada durur: config/products.ts proxy'ye (i18n/routing) girer, görsel import'ları girmemeli.
// Alt metinleri messages → productContent.<id>.alts altında, buradaki sırayla.
// Kendi ekranı olmayan ürünlerde en yakın mevcut ekran kullanılır; liste: docs/eksikler.md.

import type { StaticImageData } from "next/image";
import {
  CircleCheck,
  Clock,
  FileDown,
  Hourglass,
  MapPin,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { ProductId } from "./products";
import a4Poster from "@/public/screenshots/admin/a4-qr-afisi.webp";
import payrollDark from "@/public/screenshots/admin/bordro-hesaplama-detayi-koyu.webp";
import payroll from "@/public/screenshots/admin/bordro-hesaplama-detayi.webp";
import companyTree from "@/public/screenshots/admin/coklu-sirket-sube-yonetimi.webp";
import supportChat from "@/public/screenshots/admin/destek-talebi-mesajlasma.webp";
import support from "@/public/screenshots/admin/destek-talepleri.webp";
import earnings from "@/public/screenshots/admin/ek-odeme-ve-mesai-eklentileri.webp";
import overtime from "@/public/screenshots/admin/fazla-mesai-cizelgesi.webp";
import calendar from "@/public/screenshots/admin/ik-takvimi.webp";
import leavePdf from "@/public/screenshots/admin/izin-listesi-pdf-cikti.webp";
import leaveReport from "@/public/screenshots/admin/izin-raporu.webp";
import leaveApproval from "@/public/screenshots/admin/izin-talebi-onay.webp";
import leave from "@/public/screenshots/admin/izin-yonetimi.webp";
import locationQr from "@/public/screenshots/admin/lokasyon-qr-noktasi.webp";
import locations from "@/public/screenshots/admin/lokasyon-takibi.webp";
import records from "@/public/screenshots/admin/ozluk-dosyasi.webp";
import pdksDetail from "@/public/screenshots/admin/pdks-giris-cikis-detayi.webp";
import employees from "@/public/screenshots/admin/personel-yonetimi-listesi.webp";
import timesheet from "@/public/screenshots/admin/puantaj-cizelgesi.webp";
import timesheetDetail from "@/public/screenshots/admin/puantaj-detayi.webp";
import pdksList from "@/public/screenshots/admin/qr-kodlu-pdks-kayitlari.webp";
import dashboardDark from "@/public/screenshots/admin/qr-zaman-yonetici-paneli-koyu.webp";
import dashboard from "@/public/screenshots/admin/qr-zaman-yonetici-paneli.webp";
import users from "@/public/screenshots/admin/rol-ve-yetki-yonetimi-koyu.webp";
import departments from "@/public/screenshots/admin/sirket-bolum-yonetimi.webp";
import mAdvances from "@/public/screenshots/mobile/mobil-avans-listesi.webp";
import mAdvanceRequest from "@/public/screenshots/mobile/mobil-avans-talebi.webp";
import mEarnings from "@/public/screenshots/mobile/mobil-ek-odemeler.webp";
import mQuickMenu from "@/public/screenshots/mobile/mobil-hizli-menu.webp";
import mLeaveDetail from "@/public/screenshots/mobile/mobil-izin-detayi.webp";
import mLeave from "@/public/screenshots/mobile/mobil-izin-talepleri.webp";
import mDeductions from "@/public/screenshots/mobile/mobil-kesintiler.webp";
import mRecords from "@/public/screenshots/mobile/mobil-ozluk-bilgileri.webp";
import mPdks from "@/public/screenshots/mobile/mobil-pdks-kayitlari.webp";
import mProfile from "@/public/screenshots/mobile/mobil-profil.webp";
import mTimesheet from "@/public/screenshots/mobile/mobil-puantaj.webp";
import mQrSelect from "@/public/screenshots/mobile/mobil-qr-giris-cikis-secimi.webp";
import mQrConfirm from "@/public/screenshots/mobile/mobil-qr-kayit-onayi.webp";
import mHome from "@/public/screenshots/mobile/mobil-uygulama-ana-sayfa.webp";
import mLogin from "@/public/screenshots/mobile/mobil-uygulama-giris.webp";

/** Ekran görüntüsü; koyu tema sürümü varsa dark temada o gösterilir. */
export type Shot = { src: StaticImageData; dark?: StaticImageData };

/** Admin ekranı: tarayıcı çerçevesinde, adres çubuğunda panel yolu görünür. */
export type BrowserShot = Shot & { path: string };

export type StepVisual =
  | { kind: "poster"; shot: Shot } // çerçevesiz görsel (A4 afiş, QR indirme kartı)
  | { kind: "phone"; shot: Shot }
  | { kind: "browser"; shot: Shot };

export type ProductScreens = {
  hero:
    | { kind: "phones"; shots: readonly [Shot, Shot] }
    | { kind: "browser"; shot: BrowserShot };
  toast: { icon: LucideIcon; tone: "info" | "success" | "warning" };
  showcase: BrowserShot;
  /** Kurulum bandındaki görseller (0–2). Boşsa adımlar tam genişlik olur. */
  steps: StepVisual[];
};

const phones = (a: StaticImageData, b: StaticImageData) =>
  ({ kind: "phones", shots: [{ src: a }, { src: b }] }) as const;
const browser = (src: StaticImageData, path: string, dark?: StaticImageData) =>
  ({ kind: "browser", shot: { src, dark, path } }) as const;

const PAYROLL: BrowserShot = { src: payroll, dark: payrollDark, path: "/bordro" };
const DASHBOARD: BrowserShot = { src: dashboard, dark: dashboardDark, path: "/" };

export const PRODUCT_SCREENS: Record<ProductId, ProductScreens> = {
  // Zaman & Devam Takibi
  qrPdks: {
    hero: phones(mQrSelect, mPdks),
    toast: { icon: CircleCheck, tone: "success" },
    showcase: { src: pdksDetail, path: "/pdks" },
    steps: [
      { kind: "poster", shot: { src: a4Poster } },
      { kind: "poster", shot: { src: locationQr } },
    ],
  },
  shiftManagement: {
    hero: browser(pdksList, "/pdks"),
    toast: { icon: Clock, tone: "info" },
    showcase: { src: overtime, path: "/puantaj" },
    steps: [
      { kind: "phone", shot: { src: mPdks } },
      { kind: "phone", shot: { src: mTimesheet } },
    ],
  },
  timesheet: {
    hero: phones(mTimesheet, mHome),
    toast: { icon: CircleCheck, tone: "success" },
    showcase: { src: timesheet, path: "/puantaj" },
    steps: [{ kind: "browser", shot: { src: timesheetDetail } }],
  },
  locationTracking: {
    hero: browser(locations, "/lokasyon"),
    toast: { icon: MapPin, tone: "success" },
    showcase: { src: locationQr, path: "/lokasyon" },
    steps: [
      { kind: "poster", shot: { src: a4Poster } },
      { kind: "phone", shot: { src: mQrConfirm } },
    ],
  },

  // İnsan Kaynakları
  employeeManagement: {
    hero: phones(mProfile, mRecords),
    toast: { icon: CircleCheck, tone: "success" },
    showcase: { src: employees, path: "/personel" },
    steps: [
      { kind: "phone", shot: { src: mLogin } },
      { kind: "phone", shot: { src: mQrConfirm } },
    ],
  },
  employeeRecords: {
    hero: phones(mRecords, mProfile),
    toast: { icon: CircleCheck, tone: "info" },
    showcase: { src: records, path: "/ozluk" },
    steps: [{ kind: "browser", shot: { src: employees } }],
  },
  leaveManagement: {
    hero: phones(mLeave, mLeaveDetail),
    toast: { icon: Hourglass, tone: "warning" },
    showcase: { src: leaveApproval, path: "/izin" },
    steps: [{ kind: "browser", shot: { src: leave } }],
  },
  advanceManagement: {
    hero: phones(mAdvanceRequest, mAdvances),
    toast: { icon: Hourglass, tone: "warning" },
    showcase: PAYROLL,
    steps: [{ kind: "phone", shot: { src: mQuickMenu } }],
  },
  hrDocuments: {
    hero: browser(records, "/ozluk"),
    toast: { icon: FileDown, tone: "info" },
    showcase: { src: leavePdf, path: "/izin" },
    steps: [{ kind: "browser", shot: { src: employees } }],
  },

  // Bordro & Raporlama
  payroll: {
    hero: phones(mHome, mTimesheet),
    toast: { icon: CircleCheck, tone: "success" },
    showcase: PAYROLL,
    steps: [{ kind: "browser", shot: { src: timesheet } }],
  },
  earningsDeductions: {
    hero: phones(mEarnings, mDeductions),
    toast: { icon: CircleCheck, tone: "success" },
    showcase: { src: earnings, path: "/bordro/parametre" },
    steps: [{ kind: "browser", shot: { src: payroll, dark: payrollDark } }],
  },
  compliance: {
    hero: browser(calendar, "/takvim"),
    toast: { icon: CircleCheck, tone: "success" },
    showcase: PAYROLL,
    steps: [],
  },
  reporting: {
    hero: browser(leaveReport, "/raporlar/izin-raporu"),
    toast: { icon: FileDown, tone: "info" },
    showcase: { src: leavePdf, path: "/raporlar/izin-raporu" },
    steps: [{ kind: "phone", shot: { src: mPdks } }],
  },

  // CRM: CRM ekranları henüz yok; platformun ortak ekranları gösterilir (docs/eksikler.md)
  contactManagement: {
    hero: browser(dashboard, "/", dashboardDark),
    toast: { icon: CircleCheck, tone: "success" },
    showcase: { src: employees, path: "/personel" },
    steps: [{ kind: "browser", shot: { src: users } }],
  },
  salesTracking: {
    hero: browser(dashboard, "/", dashboardDark),
    toast: { icon: CircleCheck, tone: "info" },
    showcase: { src: leaveReport, path: "/raporlar/izin-raporu" },
    steps: [{ kind: "browser", shot: { src: companyTree } }],
  },
  quoteManagement: {
    hero: browser(dashboard, "/", dashboardDark),
    toast: { icon: FileDown, tone: "info" },
    showcase: { src: leavePdf, path: "/izin" },
    steps: [{ kind: "browser", shot: { src: support } }],
  },
  taskManagement: {
    hero: browser(calendar, "/takvim"),
    toast: { icon: Clock, tone: "warning" },
    showcase: { src: supportChat, path: "/destek" },
    steps: [{ kind: "browser", shot: { src: users } }],
  },

  // Platform
  mobileApp: {
    hero: phones(mHome, mQrSelect),
    toast: { icon: CircleCheck, tone: "success" },
    showcase: { src: pdksDetail, path: "/pdks" },
    steps: [
      { kind: "phone", shot: { src: mLogin } },
      { kind: "phone", shot: { src: mQrConfirm } },
    ],
  },
  multiCompany: {
    hero: browser(companyTree, "/kurumsal/sirketler"),
    toast: { icon: CircleCheck, tone: "info" },
    showcase: { src: departments, path: "/kurumsal/bolumler" },
    steps: [{ kind: "browser", shot: { src: users } }],
  },
  rolesPermissions: {
    hero: browser(users, "/kurumsal/kullanici-yonetimi"),
    toast: { icon: ShieldCheck, tone: "success" },
    showcase: DASHBOARD,
    steps: [{ kind: "phone", shot: { src: mHome } }],
  },
  dashboard: {
    hero: browser(dashboard, "/", dashboardDark),
    toast: { icon: Hourglass, tone: "warning" },
    showcase: { src: calendar, path: "/takvim" },
    steps: [{ kind: "phone", shot: { src: mHome } }],
  },
};
