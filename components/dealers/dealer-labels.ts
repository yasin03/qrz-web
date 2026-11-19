import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { MapExplorerLabels } from "./map-explorer";

/** Harita ve bayi kartı metinleri (messages → dealersPage) */
export async function getDealerLabels(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "dealersPage" });
  const card = {
    headquarters: t("card.headquarters"),
    directions: t("card.directions"),
    website: t("card.website"),
  };
  const map: MapExplorerLabels = {
    search: t("map.search"),
    searchPlaceholder: t("map.searchPlaceholder"),
    noResult: t("map.noResult"),
    clear: t("map.clear"),
    countOne: t("map.countOne"),
    countOther: t.raw("map.countOther") as string,
    noDealer: t("map.noDealer"),
    panelIntro: t("map.panelIntro"),
    emptyTitle: t("map.emptyTitle"),
    emptyText: t("map.emptyText"),
    noDealerInProvince: t("map.noDealerInProvince"),
    nearest: t("map.nearest"),
    allInfo: t("map.allInfo"),
    becomeDealer: t("map.becomeDealer"),
    contact: t("map.contact"),
    legend: {
      label: t("map.legend.label"),
      dealer: t("map.legend.dealer"),
      served: t("map.legend.served"),
      none: t("map.legend.none"),
    },
    card,
  };
  return { card, map };
}
