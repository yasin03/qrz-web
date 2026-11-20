import type { MetadataRoute } from "next";
import { BLOG_POST_LOCALE, getActiveCategories, postPath } from "@/config/blog";
import { getDealerProvinces } from "@/config/dealers";
import { PAGES } from "@/config/navigation";
import { IS_INDEXABLE } from "@/config/site";
import { routing, type AppPathname } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

/**
 * Sitemap (6.6): config/navigation.ts → PAGES'teki her sayfa, iki dilde ayrı kayıt
 * ve her kayıtta hreflang alternatifleri (tr, en, x-default).
 * Bayisi olan illerin /bayiler/[il] sayfaları (4.7) ve yazısı olan blog kategorileri de eklenir.
 * Blog yazıları yalnızca kendi dillerinde (TR) yer alır; hreflang'leri tr + x-default'tur.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!IS_INDEXABLE) return [];
  const lastModified = new Date();

  const hrefs: AppPathname[] = [
    ...Object.values(PAGES).map((page) => page.href),
    ...getDealerProvinces().map((p) => `/bayiler/${p.slug}` as AppPathname),
    ...getActiveCategories().map((c) => `/blog/kategori/${c.slug.tr}` as AppPathname),
  ];

  const pages = hrefs.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, href),
      lastModified,
      alternates: { languages: languageAlternates(href) },
    })),
  );

  const postLocales = [BLOG_POST_LOCALE] as const;
  const posts = (await getAllPosts()).map((post) => {
    const href = postPath(post.slug) as AppPathname;
    return {
      url: absoluteUrl(BLOG_POST_LOCALE, href),
      lastModified: new Date(`${post.updatedAt}T09:00:00+03:00`),
      alternates: { languages: languageAlternates(href, postLocales) },
    };
  });

  return [...pages, ...posts];
}
