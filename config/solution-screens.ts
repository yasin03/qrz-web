// Çözüm sayfalarındaki ekran görüntüsü eşlemesi (Faz 5).
// Ayrı dosyada durur: config/solutions.ts proxy'ye (i18n/routing) girer, görsel import'ları girmemeli.
// Alt metinleri messages → solutionContent.<id>.alts altında, buradaki sırayla:
//   hero: [tarayıcı/1. telefon, 2. telefon], splits: [[...1. blok], [...2. blok]].
// Yeni görsel eklenmez; mevcut maskeli ekranlardan o role/sektöre en uygun olanlar seçilir.

import type { StaticImageData } from "next/image";
import {
  BookOpenCheck,
  Building2,
  CalendarClock,
  CalendarDays,
  CircleCheck,
  Clock,
  Eye,
  FileSpreadsheet,
  FileText,
  Hourglass,
  KeyRound,
  Landmark,
  MapPin,
  MapPinned,
  MessageSquareText,
  Moon,
  Repeat,
  ShieldCheck,
  Smartphone,
  Timer,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { BrowserShot } from "./product-screens";
import type { SolutionId } from "./solutions";
import payrollDark from "@/public/screenshots/admin/bordro-hesaplama-detayi-koyu.webp";
import payroll from "@/public/screenshots/admin/bordro-hesaplama-detayi.webp";
import companyTree from "@/public/screenshots/admin/coklu-sirket-sube-yonetimi.webp";
import earnings from "@/public/screenshots/admin/ek-odeme-ve-mesai-eklentileri.webp";
import overtime from "@/public/screenshots/admin/fazla-mesai-cizelgesi.webp";
import calendar from "@/public/screenshots/admin/ik-takvimi.webp";
import leaveReport from "@/public/screenshots/admin/izin-raporu.webp";
import leaveApproval from "@/public/screenshots/admin/izin-talebi-onay.webp";
import leave from "@/public/screenshots/admin/izin-yonetimi.webp";
import locationQr from "@/public/screenshots/admin/lokasyon-qr-noktasi.webp";
import locations from "@/public/screenshots/admin/lokasyon-takibi.webp";
import pdksDetail from "@/public/screenshots/admin/pdks-giris-cikis-detayi.webp";
import timesheet from "@/public/screenshots/admin/puantaj-cizelgesi.webp";
import pdksList from "@/public/screenshots/admin/qr-kodlu-pdks-kayitlari.webp";
import dashboardDark from "@/public/screenshots/admin/qr-zaman-yonetici-paneli-koyu.webp";
import dashboard from "@/public/screenshots/admin/qr-zaman-yonetici-paneli.webp";
import users from "@/public/screenshots/admin/rol-ve-yetki-yonetimi-koyu.webp";
import departments from "@/public/screenshots/admin/sirket-bolum-yonetimi.webp";
import mAdvanceRequest from "@/public/screenshots/mobile/mobil-avans-talebi.webp";
import mLeave from "@/public/screenshots/mobile/mobil-izin-talepleri.webp";
import mPdks from "@/public/screenshots/mobile/mobil-pdks-kayitlari.webp";
import mTimesheet from "@/public/screenshots/mobile/mobil-puantaj.webp";
import mQrSelect from "@/public/screenshots/mobile/mobil-qr-giris-cikis-secimi.webp";
import mQrConfirm from "@/public/screenshots/mobile/mobil-qr-kayit-onayi.webp";
import mHome from "@/public/screenshots/mobile/mobil-uygulama-ana-sayfa.webp";

/** Görsel: tarayıcı çerçevesinde admin ekranı ya da yan yana iki telefon. */
export type SolutionVisual =
  | { kind: "browser"; shot: BrowserShot }
  | { kind: "phones"; shots: readonly [StaticImageData, StaticImageData] };

export type SolutionScreens = {
  /** Hero: admin ekranı + önünde telefon, ya da iki telefon */
  hero:
    | { kind: "browser"; shot: BrowserShot; phone: StaticImageData }
    | { kind: "phones"; shots: readonly [StaticImageData, StaticImageData] };
  toast: { icon: LucideIcon; tone: "info" | "success" | "warning" };
  /** Sorun girişindeki 3 kartın ikonları (solutionContent.<id>.problems.items sırasıyla) */
  problems: readonly [LucideIcon, LucideIcon, LucideIcon];
  /** "Ekran görüntüleri" bölümündeki iki blok */
  splits: readonly [SolutionVisual, SolutionVisual];
};

const browser = (src: StaticImageData, path: string, dark?: StaticImageData) =>
  ({ kind: "browser", shot: { src, dark, path } }) as const;
const phones = (a: StaticImageData, b: StaticImageData) =>
  ({ kind: "phones", shots: [a, b] }) as const;

export const SOLUTION_SCREENS: Record<SolutionId, SolutionScreens> = {
  // Rollere göre
  managers: {
    problems: [Eye, Hourglass, Wallet],
    hero: { ...browser(dashboard, "/", dashboardDark), phone: mHome },
    toast: { icon: Hourglass, tone: "warning" },
    splits: [browser(leaveApproval, "/izin"), browser(payroll, "/bordro", payrollDark)],
  },
  hrTeams: {
    problems: [FileSpreadsheet, Landmark, Repeat],
    hero: { ...browser(timesheet, "/puantaj"), phone: mTimesheet },
    toast: { icon: CircleCheck, tone: "success" },
    splits: [
      browser(payroll, "/bordro", payrollDark),
      browser(earnings, "/bordro/parametre"),
    ],
  },
  employees: {
    problems: [Smartphone, MessageSquareText, Wallet],
    hero: phones(mQrSelect, mHome),
    toast: { icon: CircleCheck, tone: "success" },
    splits: [phones(mLeave, mAdvanceRequest), phones(mTimesheet, mPdks)],
  },

  // Sektörlere göre
  retail: {
    problems: [MapPin, Repeat, CalendarClock],
    hero: { ...browser(pdksList, "/pdks"), phone: mQrConfirm },
    toast: { icon: MapPin, tone: "success" },
    splits: [browser(locations, "/lokasyon"), browser(overtime, "/puantaj")],
  },
  manufacturing: {
    problems: [Moon, Timer, FileSpreadsheet],
    hero: { ...browser(overtime, "/puantaj"), phone: mPdks },
    toast: { icon: Clock, tone: "info" },
    splits: [browser(pdksDetail, "/pdks"), browser(timesheet, "/puantaj")],
  },
  construction: {
    problems: [MapPinned, ShieldCheck, Users],
    hero: { ...browser(locations, "/lokasyon"), phone: mQrSelect },
    toast: { icon: ShieldCheck, tone: "success" },
    splits: [phones(mQrConfirm, mPdks), browser(pdksDetail, "/pdks")],
  },
  hospitality: {
    problems: [CalendarClock, Clock, Wallet],
    hero: { ...browser(pdksList, "/pdks"), phone: mHome },
    toast: { icon: Clock, tone: "info" },
    splits: [browser(overtime, "/puantaj"), browser(earnings, "/bordro/parametre")],
  },
  healthcare: {
    problems: [Moon, FileText, Users],
    hero: { ...browser(pdksList, "/pdks"), phone: mTimesheet },
    toast: { icon: Clock, tone: "info" },
    splits: [browser(leave, "/izin"), browser(timesheet, "/puantaj")],
  },
  education: {
    problems: [CalendarDays, BookOpenCheck, Building2],
    hero: { ...browser(calendar, "/takvim"), phone: mHome },
    toast: { icon: CircleCheck, tone: "success" },
    splits: [
      browser(leaveReport, "/raporlar/izin-raporu"),
      browser(departments, "/kurumsal/bolumler"),
    ],
  },
  multiBranch: {
    problems: [Building2, KeyRound, FileSpreadsheet],
    hero: { ...browser(companyTree, "/kurumsal/sirketler"), phone: mHome },
    toast: { icon: MapPin, tone: "success" },
    splits: [
      browser(users, "/kurumsal/kullanici-yonetimi"),
      browser(locationQr, "/lokasyon"),
    ],
  },
};
