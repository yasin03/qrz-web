import { Clock } from "lucide-react";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { formatPostDate, type Post } from "@/lib/blog";
import { cn } from "@/lib/utils";

/** Yazar · tarih · okuma süresi satırı (kartlar ve yazı başlığı). */
export async function PostMeta({
  post,
  locale,
  showAuthor = false,
  className,
}: {
  post: Post;
  locale: Locale;
  showAuthor?: boolean;
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const dot = <span aria-hidden="true">·</span>;

  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground",
        className,
      )}
    >
      {showAuthor ? (
        <>
          <span>
            <span className="sr-only">{t("author")}: </span>
            <span className="font-semibold text-foreground">
              {t(`authors.${post.author}.name`)}
            </span>
          </span>
          {dot}
        </>
      ) : null}
      <span>
        <span className="sr-only">{t("published")}: </span>
        <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time>
      </span>
      {dot}
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3.5" aria-hidden="true" />
        {t("readingTime", { minutes: post.readingMinutes })}
      </span>
    </p>
  );
}
