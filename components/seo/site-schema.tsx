import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Organization, SoftwareApplication, WebSite } from "schema-dts";
import { CONTACT, SITE_NAME, SITE_URL, SOCIAL_LINKS, STORE_LINKS } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./json-ld";

const ORG_ID = `${SITE_URL}/#organization`;

/** Tanımlı (boş olmayan) değerler; bilinmeyen bilgi şemaya yazılmaz. */
const defined = (values: string[]) => values.filter(Boolean);

/** Tüm sayfalar (6.5): Organization + WebSite. */
export async function SiteSchema({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const phone: string = CONTACT.phone;
  const email: string = CONTACT.email;
  const sameAs = defined(Object.values(SOCIAL_LINKS));

  return (
    <>
      <JsonLd<Organization>
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": ORG_ID,
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/logos/logo-pri.png`,
          description: t("tagline"),
          ...(sameAs.length ? { sameAs } : {}),
          ...(phone || email
            ? {
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                  ...(phone ? { telephone: phone } : {}),
                  ...(email ? { email } : {}),
                  availableLanguage: ["Turkish", "English"],
                },
              }
            : {}),
        }}
      />
      <JsonLd<WebSite>
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: absoluteUrl(locale, "/"),
          inLanguage: locale,
          publisher: { "@id": ORG_ID },
        }}
      />
    </>
  );
}

/**
 * Ana sayfa ve ürün sayfaları (6.5): SoftwareApplication.
 * TODO: fiyat bilgisi gelince `offers` eklenecek (uydurma fiyat/puan yok).
 */
export async function SoftwareAppSchema({
  locale,
  description,
}: {
  locale: Locale;
  description: string;
}) {
  const downloadUrls = defined([STORE_LINKS.appStore, STORE_LINKS.googlePlay]);
  return (
    <JsonLd<SoftwareApplication>
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        url: absoluteUrl(locale, "/"),
        description,
        inLanguage: locale,
        publisher: { "@id": ORG_ID },
        ...(downloadUrls.length ? { downloadUrl: downloadUrls } : {}),
      }}
    />
  );
}
