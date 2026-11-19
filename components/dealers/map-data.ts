// Harita için il durumları ve en yakın bayi hesabı (sunucu ve istemci ortak).

import type { Dealer } from "@/config/dealers";
import { PROVINCES } from "@/config/provinces";
import { MAP_PROVINCES } from "./turkey-map-data";

export type ProvinceStatus = "dealer" | "served" | "none";

export type MapProvince = {
  code: number;
  slug: string;
  name: string;
  status: ProvinceStatus;
  /** O ildeki bayi sayısı */
  count: number;
};

export function buildMapProvinces(dealers: Dealer[]): MapProvince[] {
  return PROVINCES.map((p) => {
    const count = dealers.filter((d) => d.provinceCode === p.code).length;
    const served = dealers.some((d) => d.servesProvinces?.includes(p.code));
    return {
      code: p.code,
      slug: p.slug,
      name: p.name,
      count,
      status: count > 0 ? "dealer" : served ? "served" : "none",
    };
  });
}

const CENTROIDS = new Map(MAP_PROVINCES.map((p) => [p.code, p.c]));

/** İlin ağırlık merkezine göre en yakın bayiler (harita koordinatında; il sırası için yeterli) */
export function nearestDealers(code: number, dealers: Dealer[], limit = 3): Dealer[] {
  const origin = CENTROIDS.get(code);
  if (!origin) return [];
  const distance = (d: Dealer) => {
    const c = CENTROIDS.get(d.provinceCode);
    return c ? Math.hypot(c[0] - origin[0], c[1] - origin[1]) : Infinity;
  };
  return dealers
    .filter((d) => d.provinceCode !== code)
    .map((d) => ({ d, km: distance(d) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit)
    .map(({ d }) => d);
}
