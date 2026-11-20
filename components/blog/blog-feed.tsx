import { Rss } from "lucide-react";
import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { SITE_URL } from "@/config/site";
import { BLOG_POST_LOCALE } from "@/config/blog";

export const RSS_PATH = "/blog/rss.xml";

/** Blog sayfalarının metadata'sına RSS beslemesini ekler (<link rel="alternate" type="application/rss+xml">). */
export function withRss(metadata: Metadata): Metadata {
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      types: { "application/rss+xml": `${SITE_URL}${RSS_PATH}` },
    },
  };
}

/** Liste sayfalarının alt satırı: RSS linki; TR dışındaki dillerde "yazılar Türkçe" notu. */
export async function BlogFooterNote({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "blogPage" });
  return (
    <Container className="flex flex-wrap items-center justify-between gap-3 pb-4 text-sm text-muted-foreground">
      <p>{locale === BLOG_POST_LOCALE ? null : t("languageNotice")}</p>
      <a
        href={RSS_PATH}
        type="application/rss+xml"
        className="inline-flex items-center gap-1.5 rounded font-semibold hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:hover:text-accent"
      >
        <Rss className="size-4" aria-hidden="true" />
        {t("rssLink")}
      </a>
    </Container>
  );
}
