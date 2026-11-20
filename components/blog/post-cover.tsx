import Image from "next/image";
import type { Post } from "@/lib/blog";
import { cn } from "@/lib/utils";

/**
 * Yazı kapağı: Unsplash fotoğrafı (config/blog.ts → cover), 1200×630 oranında kırpılır.
 * Kartlarda başlık zaten link metni olduğu için alt="" verilir; yazı sayfasında meta.coverAlt.
 */
export function PostCover({
  post,
  alt = "",
  sizes,
  priority = false,
  className,
}: {
  post: Post;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={post.cover.src}
      alt={alt}
      width={post.cover.width}
      height={post.cover.height}
      sizes={sizes}
      priority={priority}
      className={cn(
        "aspect-1200/630 w-full rounded-2xl bg-surface object-cover",
        className,
      )}
    />
  );
}
