import type { Locale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import type { MapProvince } from "./map-data";
import { MAP_PROVINCES, MAP_VIEWBOX } from "./turkey-map-data";

/**
 * Türkiye illeri haritası (inline SVG, Server Component): ilk HTML'de bulunur, JS'siz de görünür.
 * Bayisi olan iller /bayiler/[il] sayfasına giden gerçek <a> linkleridir (klavyeyle gezilir).
 * Renkler: globals.css → .qz-map (data-status, data-selected).
 */
export function TurkeyMap({
  provinces,
  locale,
  label,
}: {
  provinces: MapProvince[];
  locale: Locale;
  /** SVG'nin erişilebilir adı */
  label: string;
}) {
  const byCode = new Map(provinces.map((p) => [p.code, p]));

  return (
    <svg
      viewBox={MAP_VIEWBOX}
      role="group"
      aria-label={label}
      className="qz-map h-auto w-full touch-manipulation select-none"
    >
      {MAP_PROVINCES.map(({ code, d }) => {
        const province = byCode.get(code);
        if (!province) return null;
        const path = (
          <path d={d} data-code={code} data-status={province.status}>
            <title>{province.name}</title>
          </path>
        );
        if (province.status !== "dealer") return <g key={code}>{path}</g>;
        const href = getPathname({
          locale,
          href: `/bayiler/${province.slug}` as AppPathname,
        });
        return (
          <a key={code} href={href} data-code={code} aria-label={province.name}>
            {path}
          </a>
        );
      })}
    </svg>
  );
}
