// Navigasyonun tek kaynağı (3.2). Header, mobil menü, footer, breadcrumb,
// BreadcrumbList JSON-LD ve sitemap.ts bu dosyadan beslenir.
// Metinler: messages → pages.<id>.{label, short?, description}, nav.top.<id>, nav.groups.<id>.

import type { LucideIcon } from "lucide-react";
import type { AppPathname } from "@/i18n/routing";
import type messages from "@/messages/tr.json";
import { CALCULATORS } from "./calculators";
import { LEGAL_PAGES } from "./legal";
import { PRODUCTS, type ProductCategory } from "./products";
import { SOLUTIONS } from "./solutions";

export { PANEL_LOGIN_URL } from "./site";

export type PageId = keyof (typeof messages)["pages"];

export type PageEntry = {
  href: AppPathname;
  /** Breadcrumb'da bir üst sayfa (yoksa doğrudan Ana Sayfa) */
  parent?: PageId;
};

/* ------------------------------------------------------------------ */
/* Sayfa kaydı: sitedeki her indekslenebilir sayfa                     */
/* ------------------------------------------------------------------ */

const fromConfig = <T extends { id: string; slug: { tr: string } }>(
  items: readonly T[],
  base: string,
  parent?: PageId,
) =>
  Object.fromEntries(
    items.map((item) => [
      item.id,
      { href: `${base}/${item.slug.tr}` as AppPathname, parent },
    ]),
  ) as Record<T["id"], PageEntry>;

export const PAGES = {
  home: { href: "/" },

  products: { href: "/urunler" },
  ...fromConfig(PRODUCTS, "/urunler", "products"),

  solutions: { href: "/cozumler" },
  ...fromConfig(SOLUTIONS, "/cozumler", "solutions"),

  pricing: { href: "/fiyatlandirma" },

  blog: { href: "/blog" },
  faq: { href: "/sss" },
  support: { href: "/destek" },
  calculators: { href: "/hesaplama" },
  ...fromConfig(CALCULATORS, "/hesaplama", "calculators"),

  about: { href: "/hakkimizda" },
  dealers: { href: "/bayiler" },
  partners: { href: "/is-ortakligi" },
  contact: { href: "/iletisim" },
  security: { href: "/guvenlik" },
  demo: { href: "/demo-talep" },

  ...fromConfig(LEGAL_PAGES, "/yasal"),
  deleteAccount: { href: "/hesap-silme" },
} satisfies Record<PageId, PageEntry>;

/** Ana Sayfa'dan sayfaya kadar breadcrumb zinciri (Ana Sayfa dahil). */
export function getBreadcrumbTrail(id: PageId): PageId[] {
  const trail: PageId[] = [];
  let current: PageId | undefined = id;
  while (current && current !== "home") {
    trail.unshift(current);
    current = (PAGES[current] as PageEntry).parent;
  }
  return ["home", ...trail];
}

/* ------------------------------------------------------------------ */
/* Header menüsü                                                       */
/* ------------------------------------------------------------------ */

export type NavLink = { id: PageId; icon?: LucideIcon };

export type NavGroupId =
  ProductCategory | "byRole" | "bySector" | "content" | "calculators" | "corporate";

/**
 * list: ikon/başlık + tek satır açıklama.
 * grid: iki kolonlu kısa başlıklar (pages.<id>.short varsa o kullanılır).
 */
export type NavGroup = {
  id: NavGroupId;
  layout: "list" | "grid";
  /** false ise kolon başlığı gösterilmez (tek gruplu menüler) */
  showLabel?: boolean;
  items: NavLink[];
};

export type NavTopId = "products" | "solutions" | "pricing" | "resources" | "corporate";

export type NavItem =
  | { type: "link"; id: NavTopId; page: PageId }
  | { type: "mega" | "dropdown"; id: NavTopId; groups: NavGroup[] };

const productGroup = (category: ProductCategory): NavGroup => ({
  id: category,
  layout: "list",
  items: PRODUCTS.filter((p) => p.category === category).map((p) => ({
    id: p.id,
    icon: p.icon,
  })),
});

export const MAIN_NAV: NavItem[] = [
  {
    type: "mega",
    id: "products",
    groups: (["time", "hr", "payroll", "crm", "platform"] as const).map(productGroup),
  },
  {
    type: "dropdown",
    id: "solutions",
    groups: [
      {
        id: "byRole",
        layout: "list",
        items: SOLUTIONS.filter((s) => s.group === "role").map((s) => ({ id: s.id })),
      },
      {
        id: "bySector",
        layout: "grid",
        items: SOLUTIONS.filter((s) => s.group === "sector").map((s) => ({ id: s.id })),
      },
    ],
  },
  { type: "link", id: "pricing", page: "pricing" },
  {
    type: "dropdown",
    id: "resources",
    groups: [
      {
        id: "content",
        layout: "list",
        items: [{ id: "blog" }, { id: "faq" }, { id: "support" }],
      },
      {
        id: "calculators",
        layout: "grid",
        items: CALCULATORS.map((c) => ({ id: c.id })),
      },
    ],
  },
  {
    type: "dropdown",
    id: "corporate",
    groups: [
      {
        id: "corporate",
        layout: "list",
        showLabel: false,
        items: [
          { id: "about" },
          { id: "dealers" },
          { id: "partners" },
          { id: "contact" },
          { id: "security" },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export type FooterColumn = { id: NavTopId; items: PageId[] };

/** footer.html'deki 4 kolon. Etiketler pages.<id>.short ?? label. */
export const FOOTER_NAV: FooterColumn[] = [
  {
    id: "products",
    items: [
      "qrPdks",
      "shiftManagement",
      "timesheet",
      "payroll",
      "leaveManagement",
      "advanceManagement",
      "employeeRecords",
      "contactManagement",
      "mobileApp",
    ],
  },
  {
    id: "solutions",
    items: [
      "managers",
      "hrTeams",
      "employees",
      "retail",
      "manufacturing",
      "construction",
      "multiBranch",
    ],
  },
  {
    id: "resources",
    items: ["blog", "calculators", "salaryCalc", "severanceCalc", "faq", "support"],
  },
  {
    id: "corporate",
    items: [
      "about",
      "pricing",
      "dealers",
      "partners",
      "contact",
      "security",
      "deleteAccount",
    ],
  },
];

export const FOOTER_LEGAL: PageId[] = LEGAL_PAGES.map((l) => l.id);
