import type { Locale } from "next-intl";
import type { Post } from "@/lib/blog";
import { PostCard } from "./post-card";

/** Yazı kartları ızgarası: mobilde tek, tablette iki, masaüstünde üç kolon. */
export function PostGrid({ posts, locale }: { posts: Post[]; locale: Locale }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {posts.map((post) => (
        <li key={post.slug} className="flex">
          <PostCard post={post} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
