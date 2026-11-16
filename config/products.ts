// Ürün sayfaları (/urunler/[slug] ↔ /en/products/[slug]).
// Başlık, açıklama ve meta metinleri messages/*.json → pages.<id> altında durur.
// Yeni ürün = buraya kayıt + messages'a TR/EN metinler. URL yapısı değişmez.
// Hazır olmayan ürün buraya eklenmez (menü ve sitemap bu listeden üretilir).

import {
  BadgePercent,
  CalendarClock,
  CalendarDays,
  ChartColumn,
  Clock,
  FilePenLine,
  FileText,
  FolderOpen,
  HandCoins,
  LayoutDashboard,
  ListChecks,
  MapPin,
  Network,
  QrCode,
  Scale,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { SolutionId } from "./solutions";

export const PRODUCT_CATEGORIES = ["time", "hr", "payroll", "crm", "platform"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

type ProductDef = {
  /** messages: pages.<id> */
  id: string;
  category: ProductCategory;
  icon: LucideIcon;
  /** Dile özel slug (6.1: küçük harf, Türkçe karakter yok) */
  slug: { tr: string; en: string };
  /** Sayfanın ana anahtar kelimesi (6.7) */
  keyword: { tr: string; en: string };
};

export const PRODUCTS = [
  // Zaman & Devam Takibi
  {
    id: "qrPdks",
    category: "time",
    icon: QrCode,
    slug: { tr: "qr-kodlu-pdks", en: "qr-code-attendance" },
    keyword: { tr: "qr kodlu pdks", en: "qr code attendance system" },
  },
  {
    id: "shiftManagement",
    category: "time",
    icon: Clock,
    slug: { tr: "vardiya-yonetimi", en: "shift-management" },
    keyword: { tr: "vardiya yönetimi", en: "shift management software" },
  },
  {
    id: "timesheet",
    category: "time",
    icon: CalendarDays,
    slug: { tr: "puantaj", en: "timesheet" },
    keyword: { tr: "puantaj takibi", en: "timesheet software" },
  },
  {
    id: "locationTracking",
    category: "time",
    icon: MapPin,
    slug: { tr: "lokasyon-takibi", en: "location-tracking" },
    keyword: { tr: "lokasyon takibi", en: "employee location tracking" },
  },
  // İnsan Kaynakları
  {
    id: "employeeManagement",
    category: "hr",
    icon: Users,
    slug: { tr: "personel-yonetimi", en: "employee-management" },
    keyword: { tr: "personel yönetimi", en: "employee management software" },
  },
  {
    id: "employeeRecords",
    category: "hr",
    icon: FolderOpen,
    slug: { tr: "ozluk-dosyasi", en: "employee-records" },
    keyword: { tr: "özlük dosyası", en: "employee records" },
  },
  {
    id: "leaveManagement",
    category: "hr",
    icon: CalendarClock,
    slug: { tr: "izin-yonetimi", en: "leave-management" },
    keyword: { tr: "izin yönetimi", en: "leave management system" },
  },
  {
    id: "advanceManagement",
    category: "hr",
    icon: HandCoins,
    slug: { tr: "avans-yonetimi", en: "salary-advance" },
    keyword: { tr: "avans yönetimi", en: "salary advance management" },
  },
  {
    id: "hrDocuments",
    category: "hr",
    icon: FileText,
    slug: { tr: "ik-belgeleri", en: "hr-documents" },
    keyword: { tr: "ik belgeleri", en: "hr document templates" },
  },
  // Bordro & Raporlama
  {
    id: "payroll",
    category: "payroll",
    icon: Wallet,
    slug: { tr: "bordro", en: "payroll" },
    keyword: { tr: "bordro hesaplama programı", en: "payroll software" },
  },
  {
    id: "earningsDeductions",
    category: "payroll",
    icon: BadgePercent,
    slug: { tr: "ek-odeme-ve-kesinti", en: "earnings-and-deductions" },
    keyword: { tr: "ek ödeme ve kesinti", en: "payroll earnings and deductions" },
  },
  {
    id: "compliance",
    category: "payroll",
    icon: Scale,
    slug: { tr: "mevzuat-uyumu", en: "compliance" },
    keyword: { tr: "sgk ve vergi mevzuatı", en: "payroll compliance" },
  },
  {
    id: "reporting",
    category: "payroll",
    icon: ChartColumn,
    slug: { tr: "raporlama", en: "reporting" },
    keyword: { tr: "personel raporlama", en: "workforce reporting" },
  },
  // CRM
  {
    id: "contactManagement",
    category: "crm",
    icon: Users,
    slug: { tr: "musteri-yonetimi", en: "contact-management" },
    keyword: { tr: "crm müşteri yönetimi", en: "crm contact management" },
  },
  {
    id: "salesTracking",
    category: "crm",
    icon: TrendingUp,
    slug: { tr: "satis-takibi", en: "sales-tracking" },
    keyword: { tr: "satış takibi", en: "sales tracking software" },
  },
  {
    id: "quoteManagement",
    category: "crm",
    icon: FilePenLine,
    slug: { tr: "teklif-yonetimi", en: "quote-management" },
    keyword: { tr: "teklif yönetimi", en: "quote management" },
  },
  {
    id: "taskManagement",
    category: "crm",
    icon: ListChecks,
    slug: { tr: "gorev-yonetimi", en: "task-management" },
    keyword: { tr: "görev yönetimi", en: "team task management" },
  },
  // Platform
  {
    id: "mobileApp",
    category: "platform",
    icon: Smartphone,
    slug: { tr: "mobil-uygulama", en: "mobile-app" },
    keyword: { tr: "pdks mobil uygulama", en: "attendance mobile app" },
  },
  {
    id: "multiCompany",
    category: "platform",
    icon: Network,
    slug: { tr: "coklu-sirket-sube", en: "multi-company" },
    keyword: { tr: "çoklu şirket ve şube yönetimi", en: "multi-company management" },
  },
  {
    id: "rolesPermissions",
    category: "platform",
    icon: ShieldCheck,
    slug: { tr: "yetki-yonetimi", en: "roles-and-permissions" },
    keyword: { tr: "rol ve yetki yönetimi", en: "roles and permissions" },
  },
  {
    id: "dashboard",
    category: "platform",
    icon: LayoutDashboard,
    slug: { tr: "dashboard", en: "dashboard" },
    keyword: { tr: "yönetici dashboard", en: "hr dashboard" },
  },
] as const satisfies readonly ProductDef[];

export type Product = (typeof PRODUCTS)[number];
export type ProductId = Product["id"];
export type ProductSlug = Product["slug"]["tr"];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug.tr === slug);
}

export function getProductById(id: ProductId) {
  return PRODUCTS.find((p) => p.id === id)!;
}

/**
 * /urunler sayfasındaki kategori bölümlerinin çapa id'leri (dile özel).
 * Ürün sayfası breadcrumb'ındaki kategori adımı bu çapalara gider.
 */
export const PRODUCT_CATEGORY_ANCHORS: Record<
  ProductCategory,
  { tr: string; en: string }
> = {
  time: { tr: "zaman-ve-devam-takibi", en: "time-and-attendance" },
  hr: { tr: "insan-kaynaklari", en: "human-resources" },
  payroll: { tr: "bordro-ve-raporlama", en: "payroll-and-reporting" },
  crm: { tr: "crm", en: "crm" },
  platform: { tr: "platform", en: "platform" },
};

/**
 * İç linkleme (6.4): her ürün sayfası 3 ilgili ürüne ve 1 çözüm sayfasına link verir.
 */
export const PRODUCT_LINKS: Record<
  ProductId,
  { related: readonly [ProductId, ProductId, ProductId]; solution: SolutionId }
> = {
  qrPdks: {
    related: ["locationTracking", "timesheet", "mobileApp"],
    solution: "construction",
  },
  shiftManagement: {
    related: ["timesheet", "qrPdks", "payroll"],
    solution: "manufacturing",
  },
  timesheet: { related: ["qrPdks", "shiftManagement", "payroll"], solution: "hrTeams" },
  locationTracking: {
    related: ["qrPdks", "mobileApp", "multiCompany"],
    solution: "construction",
  },
  employeeManagement: {
    related: ["employeeRecords", "payroll", "hrDocuments"],
    solution: "hrTeams",
  },
  employeeRecords: {
    related: ["employeeManagement", "hrDocuments", "leaveManagement"],
    solution: "hrTeams",
  },
  leaveManagement: {
    related: ["advanceManagement", "timesheet", "mobileApp"],
    solution: "employees",
  },
  advanceManagement: {
    related: ["payroll", "earningsDeductions", "leaveManagement"],
    solution: "employees",
  },
  hrDocuments: {
    related: ["employeeRecords", "employeeManagement", "leaveManagement"],
    solution: "hrTeams",
  },
  payroll: {
    related: ["timesheet", "earningsDeductions", "compliance"],
    solution: "hrTeams",
  },
  earningsDeductions: {
    related: ["payroll", "advanceManagement", "timesheet"],
    solution: "hrTeams",
  },
  compliance: {
    related: ["payroll", "earningsDeductions", "reporting"],
    solution: "hrTeams",
  },
  reporting: { related: ["qrPdks", "leaveManagement", "payroll"], solution: "managers" },
  contactManagement: {
    related: ["salesTracking", "quoteManagement", "taskManagement"],
    solution: "managers",
  },
  salesTracking: {
    related: ["contactManagement", "quoteManagement", "taskManagement"],
    solution: "managers",
  },
  quoteManagement: {
    related: ["salesTracking", "contactManagement", "taskManagement"],
    solution: "managers",
  },
  taskManagement: {
    related: ["contactManagement", "salesTracking", "dashboard"],
    solution: "managers",
  },
  mobileApp: {
    related: ["qrPdks", "leaveManagement", "advanceManagement"],
    solution: "employees",
  },
  multiCompany: {
    related: ["rolesPermissions", "dashboard", "locationTracking"],
    solution: "multiBranch",
  },
  rolesPermissions: {
    related: ["multiCompany", "dashboard", "employeeManagement"],
    solution: "multiBranch",
  },
  dashboard: {
    related: ["reporting", "leaveManagement", "multiCompany"],
    solution: "managers",
  },
};
