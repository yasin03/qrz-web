import NextLink from "next/link";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { BLOG_POST_LOCALE, postPath } from "@/config/blog";
import { getPathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import type { Post } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { PostCover } from "./post-cover";
import { PostMeta } from "./post-meta";

/**
 * Blog yazı kartı. Kartın tamamı tıklanır (başlıktaki link ::after ile kartı kaplar).
 * Yazılar Türkçe olduğu için EN sayfalarda da TR adrese gider; içerik lang="tr" ile işaretlenir.
 * featured: liste başındaki büyük kart (masaüstünde görsel solda, metin sağda).
 */
export async function PostCard({
  post,
  locale,
  featured = false,
  headingLevel = "h3",
}: {
  post: Post;
  locale: Locale;
  featured?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const Heading = headingLevel;
  const postLang = locale === BLOG_POST_LOCALE ? undefined : BLOG_POST_LOCALE;

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-5 rounded-[20px] border border-border p-4 transition-transform duration-200 focus-within:ring-2 focus-within:ring-ring hover:-translate-y-1 motion-reduce:transition-none md:p-5 dark:bg-surface",
        featured && "lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-10",
      )}
    >
      <PostCover
        post={post}
        sizes={
          featured
            ? "(min-width: 1024px) 620px, (min-width: 640px) 90vw, 100vw"
            : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
        }
        priority={featured}
      />
      <div className={cn("flex flex-col gap-3", featured ? "lg:pr-4" : "px-1 pb-1")}>
        <span className="self-start rounded-full bg-info px-3 py-1 text-xs font-bold text-info-foreground">
          {t(`categories.${post.category}.label`)}
        </span>
        <Heading
          lang={postLang}
          className={cn(
            "leading-snug font-extrabold text-balance",
            featured ? "text-2xl md:text-[32px] md:leading-tight" : "text-xl",
          )}
        >
          {/* Kanonik TR adresi (öneksiz); next-intl Link başka dilde /tr önekli adres üretirdi */}
          <NextLink
            href={getPathname({
              locale: BLOG_POST_LOCALE,
              href: postPath(post.slug) as AppPathname,
            })}
            hrefLang={postLang}
            className="rounded transition-colors after:absolute after:inset-0 after:rounded-[20px] after:content-[''] hover:text-primary focus-visible:outline-none dark:hover:text-accent"
          >
            {post.meta.h1}
          </NextLink>
        </Heading>
        <p
          lang={postLang}
          className={cn(
            "leading-relaxed text-muted-foreground",
            featured ? "text-base md:text-[17px]" : "text-[15px]",
          )}
        >
          {post.meta.excerpt}
        </p>
        <PostMeta post={post} locale={locale} showAuthor={featured} className="mt-1" />
      </div>
    </article>
  );
}
