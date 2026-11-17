// Çözüm sayfaları (/cozumler/[slug] ↔ /en/solutions/[slug]).
// Sektör listesi Faz 2 öncesinde onaylandı, Faz 5'te aynen teyit edildi.

import {
  Briefcase,
  Factory,
  GraduationCap,
  HardHat,
  Network,
  Stethoscope,
  Store,
  UserRound,
  UsersRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { ProductId } from "./products";

export const SOLUTION_GROUPS = ["role", "sector"] as const;
export type SolutionGroup = (typeof SOLUTION_GROUPS)[number];

/** /cozumler sayfasındaki grup bölümlerinin çapa adları (breadcrumb ara adımı da buraya gider). */
export const SOLUTION_GROUP_ANCHORS: Record<SolutionGroup, { tr: string; en: string }> = {
  role: { tr: "rollere-gore", en: "by-role" },
  sector: { tr: "sektorlere-gore", en: "by-industry" },
};

/** Gruba karşılık gelen menü kolon başlığı (messages → nav.groups.<id>) */
export const SOLUTION_GROUP_NAV = { role: "byRole", sector: "bySector" } as const;

type SolutionDef = {
  /** messages: pages.<id> */
  id: string;
  group: SolutionGroup;
  icon: LucideIcon;
  slug: { tr: string; en: string };
  keyword: { tr: string; en: string };
};

export const SOLUTIONS = [
  // Rollere göre
  {
    id: "managers",
    group: "role",
    icon: Briefcase,
    slug: { tr: "yoneticiler", en: "managers" },
    keyword: {
      tr: "yöneticiler için personel takibi",
      en: "workforce management for managers",
    },
  },
  {
    id: "hrTeams",
    group: "role",
    icon: UsersRound,
    slug: { tr: "ik-ve-bordro", en: "hr-and-payroll" },
    keyword: { tr: "ik ve bordro yazılımı", en: "hr and payroll software" },
  },
  {
    id: "employees",
    group: "role",
    icon: UserRound,
    slug: { tr: "calisanlar", en: "employees" },
    keyword: { tr: "çalışan mobil uygulaması", en: "employee self-service app" },
  },
  // Sektörlere göre
  {
    id: "retail",
    group: "sector",
    icon: Store,
    slug: { tr: "perakende", en: "retail" },
    keyword: { tr: "perakende personel takibi", en: "retail time tracking" },
  },
  {
    id: "manufacturing",
    group: "sector",
    icon: Factory,
    slug: { tr: "uretim", en: "manufacturing" },
    keyword: { tr: "fabrika pdks", en: "manufacturing shift tracking" },
  },
  {
    id: "construction",
    group: "sector",
    icon: HardHat,
    slug: { tr: "insaat-ve-saha", en: "construction-and-field" },
    keyword: { tr: "şantiye personel takibi", en: "construction time tracking" },
  },
  {
    id: "hospitality",
    group: "sector",
    icon: UtensilsCrossed,
    slug: { tr: "restoran-ve-hizmet", en: "hospitality" },
    keyword: { tr: "restoran vardiya takibi", en: "restaurant shift scheduling" },
  },
  {
    id: "healthcare",
    group: "sector",
    icon: Stethoscope,
    slug: { tr: "saglik", en: "healthcare" },
    keyword: { tr: "sağlık personeli vardiya takibi", en: "healthcare staff scheduling" },
  },
  {
    id: "education",
    group: "sector",
    icon: GraduationCap,
    slug: { tr: "egitim", en: "education" },
    keyword: { tr: "okul personel takibi", en: "school staff attendance" },
  },
  {
    id: "multiBranch",
    group: "sector",
    icon: Network,
    slug: { tr: "cok-subeli-isletmeler", en: "multi-branch" },
    keyword: {
      tr: "çok şubeli personel takibi",
      en: "multi-location workforce management",
    },
  },
] as const satisfies readonly SolutionDef[];

export type Solution = (typeof SOLUTIONS)[number];
export type SolutionId = Solution["id"];
export type SolutionSlug = Solution["slug"]["tr"];

export function getSolutionBySlug(slug: string) {
  return SOLUTIONS.find((s) => s.slug.tr === slug);
}

export function getSolutionById(id: SolutionId): Solution {
  return SOLUTIONS.find((s) => s.id === id)!;
}

/**
 * İç linkleme (6.4): her çözüm sayfası o role/sektöre uygun ürünleri ("Uygun özellikler")
 * ve 3 ilgili çözümü gösterir. Ürün açıklamaları: messages → solutionContent.<id>.features.items.<productId>.
 */
export const SOLUTION_LINKS: Record<
  SolutionId,
  {
    products: readonly ProductId[];
    related: readonly [SolutionId, SolutionId, SolutionId];
  }
> = {
  managers: {
    products: [
      "dashboard",
      "leaveManagement",
      "advanceManagement",
      "payroll",
      "reporting",
      "multiCompany",
    ],
    related: ["hrTeams", "employees", "multiBranch"],
  },
  hrTeams: {
    products: [
      "timesheet",
      "payroll",
      "earningsDeductions",
      "compliance",
      "employeeManagement",
      "hrDocuments",
    ],
    related: ["managers", "employees", "manufacturing"],
  },
  employees: {
    products: [
      "mobileApp",
      "qrPdks",
      "leaveManagement",
      "advanceManagement",
      "employeeRecords",
    ],
    related: ["managers", "hrTeams", "retail"],
  },
  retail: {
    products: [
      "qrPdks",
      "locationTracking",
      "shiftManagement",
      "timesheet",
      "multiCompany",
    ],
    related: ["multiBranch", "hospitality", "managers"],
  },
  manufacturing: {
    products: [
      "shiftManagement",
      "qrPdks",
      "timesheet",
      "payroll",
      "earningsDeductions",
      "reporting",
    ],
    related: ["hrTeams", "construction", "multiBranch"],
  },
  construction: {
    products: ["qrPdks", "locationTracking", "mobileApp", "timesheet", "payroll"],
    related: ["manufacturing", "multiBranch", "managers"],
  },
  hospitality: {
    products: [
      "shiftManagement",
      "qrPdks",
      "timesheet",
      "payroll",
      "earningsDeductions",
      "leaveManagement",
    ],
    related: ["retail", "multiBranch", "employees"],
  },
  healthcare: {
    products: [
      "shiftManagement",
      "qrPdks",
      "leaveManagement",
      "timesheet",
      "employeeRecords",
      "payroll",
    ],
    related: ["manufacturing", "hrTeams", "multiBranch"],
  },
  education: {
    products: [
      "qrPdks",
      "leaveManagement",
      "timesheet",
      "payroll",
      "multiCompany",
      "hrDocuments",
    ],
    related: ["multiBranch", "hrTeams", "managers"],
  },
  multiBranch: {
    products: [
      "multiCompany",
      "rolesPermissions",
      "locationTracking",
      "dashboard",
      "reporting",
      "payroll",
    ],
    related: ["retail", "managers", "hospitality"],
  },
};
