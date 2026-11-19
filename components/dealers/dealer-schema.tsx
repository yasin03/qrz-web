import type { LocalBusiness } from "schema-dts";
import type { Dealer } from "@/config/dealers";
import { getProvinceByCode } from "@/config/provinces";

/** Bayi → schema.org LocalBusiness (6.5). Yalnızca tanımlı alanlar yazılır. */
export function dealerToLocalBusiness(dealer: Dealer): Exclude<LocalBusiness, string> {
  const province = getProvinceByCode(dealer.provinceCode);
  const served = (dealer.servesProvinces ?? [])
    .map((code) => getProvinceByCode(code)?.name)
    .filter((name): name is string => Boolean(name));
  return {
    "@type": "LocalBusiness",
    name: dealer.name,
    address: {
      "@type": "PostalAddress",
      ...(dealer.address ? { streetAddress: dealer.address } : {}),
      ...(dealer.district ? { addressLocality: dealer.district } : {}),
      ...(province ? { addressRegion: province.name } : {}),
      addressCountry: "TR",
    },
    telephone: dealer.phone,
    ...(dealer.email ? { email: dealer.email } : {}),
    ...(dealer.website ? { url: dealer.website } : {}),
    ...(dealer.coordinates
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: dealer.coordinates.lat,
            longitude: dealer.coordinates.lng,
          },
        }
      : {}),
    areaServed: [province?.name, ...served].filter((n): n is string => Boolean(n)),
  };
}
