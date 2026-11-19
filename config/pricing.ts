// Fiyatlandırma paketleri (Faz 7).
// TODO: Fiyatlar ve paket içerikleri geçicidir (kullanıcı onayıyla örnek değer); gerçekleri gelince güncellenecek.
// Metinler: messages → pricingPage.plans.<id>, pricingPage.features.<feature>.
// Fiyatlar uydurma olduğu için SoftwareApplication `offers` JSON-LD'si eklenmedi (6.5).

export const PLAN_IDS = ["starter", "professional", "enterprise"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export type Plan = {
  id: PlanId;
  /** Personel başı aylık fiyat (₺, KDV hariç). TODO: geçici değer */
  monthlyPrice: number;
  /** Kartta öne çıkarılır ("En çok tercih edilen") */
  highlighted?: boolean;
};

export const PLANS: Plan[] = [
  { id: "starter", monthlyPrice: 49 },
  { id: "professional", monthlyPrice: 89, highlighted: true },
  { id: "enterprise", monthlyPrice: 129 },
];

/** Karşılaştırma tablosu grupları (ürün kategorileriyle aynı sıra) */
export const FEATURE_GROUPS = ["time", "hr", "payroll", "crm", "platform", "support"] as const;
export type FeatureGroup = (typeof FEATURE_GROUPS)[number];

export type PlanFeature = {
  /** messages: pricingPage.features.<id> */
  id: string;
  group: FeatureGroup;
  /** Hangi paketlerde var */
  plans: readonly PlanId[];
};

const ALL = PLAN_IDS;
const PRO_UP = ["professional", "enterprise"] as const;
const ENT = ["enterprise"] as const;

// Her özellik docs/ozellikler.md'de karşılığı olan bir yetenektir.
export const PLAN_FEATURES: PlanFeature[] = [
  // Zaman & Devam
  { id: "qrPdks", group: "time", plans: ALL },
  { id: "locationVerify", group: "time", plans: ALL },
  { id: "shifts", group: "time", plans: ALL },
  { id: "timesheet", group: "time", plans: ALL },
  { id: "locations", group: "time", plans: ALL },
  // İnsan Kaynakları
  { id: "employees", group: "hr", plans: ALL },
  { id: "leave", group: "hr", plans: ALL },
  { id: "advance", group: "hr", plans: PRO_UP },
  { id: "records", group: "hr", plans: PRO_UP },
  { id: "hrDocuments", group: "hr", plans: PRO_UP },
  // Bordro & Raporlama
  { id: "payroll", group: "payroll", plans: PRO_UP },
  { id: "earnings", group: "payroll", plans: PRO_UP },
  { id: "compliance", group: "payroll", plans: PRO_UP },
  { id: "reporting", group: "payroll", plans: PRO_UP },
  // CRM
  { id: "crmContacts", group: "crm", plans: ENT },
  { id: "crmSales", group: "crm", plans: ENT },
  { id: "crmQuotes", group: "crm", plans: ENT },
  { id: "crmTasks", group: "crm", plans: ENT },
  // Platform
  { id: "mobileApp", group: "platform", plans: ALL },
  { id: "dashboard", group: "platform", plans: ALL },
  { id: "export", group: "platform", plans: ALL },
  { id: "branches", group: "platform", plans: PRO_UP },
  { id: "multiCompany", group: "platform", plans: ENT },
  { id: "scopes", group: "platform", plans: ENT },
  // Destek
  { id: "supportTickets", group: "support", plans: ALL },
  { id: "phoneSupport", group: "support", plans: PRO_UP },
  { id: "onboarding", group: "support", plans: ENT },
];

/** Paket kartında gösterilen özellikler: bir alt paketten farklı olanlar */
export function planHighlights(id: PlanId): PlanFeature[] {
  const index = PLAN_IDS.indexOf(id);
  const previous = index > 0 ? PLAN_IDS[index - 1] : null;
  return PLAN_FEATURES.filter(
    (f) => f.plans.includes(id) && (!previous || !f.plans.includes(previous)),
  );
}
