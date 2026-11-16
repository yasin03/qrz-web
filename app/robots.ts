import type { MetadataRoute } from "next";
import { IS_INDEXABLE, SITE_URL } from "@/config/site";

/** robots.txt (6.6): production'da her şeye izin (/api hariç), staging'de tamamen kapalı. */
export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
