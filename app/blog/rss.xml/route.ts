import { getTranslations } from "next-intl/server";
import { BLOG_POST_LOCALE, postPath } from "@/config/blog";
import { SITE_URL } from "@/config/site";
import type { AppPathname } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

// RSS 2.0 beslemesi: /blog/rss.xml. Yazılar yalnızca TR olduğu için tek besleme vardır.
// Noktalı yollar dil yeniden yazımına girmediği için (i18n/url-rules.ts) app/[locale] dışında durur.

export const dynamic = "force-static";

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const rfc822 = (iso: string) => new Date(`${iso}T09:00:00+03:00`).toUTCString();

export async function GET() {
  const locale = BLOG_POST_LOCALE;
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const tp = await getTranslations({ locale, namespace: "pages" });
  const posts = await getAllPosts();
  const blogUrl = absoluteUrl(locale, "/blog");
  const feedUrl = `${SITE_URL}/blog/rss.xml`;
  const lastBuild = posts.map((p) => p.updatedAt).sort().at(-1);

  const items = posts
    .map((post) => {
      const url = absoluteUrl(locale, postPath(post.slug) as AppPathname);
      return `    <item>
      <title>${escape(post.meta.h1)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.meta.excerpt)}</description>
      <category>${escape(t(`categories.${post.category}.label`))}</category>
      <pubDate>${rfc822(post.publishedAt)}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(t("rssTitle"))}</title>
    <link>${blogUrl}</link>
    <description>${escape(tp("blog.metaDescription"))}</description>
    <language>tr-TR</language>
${lastBuild ? `    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>\n` : ""}    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
