// Blog yazılarının yüklenmesi: yapısal bilgi config/blog.ts'ten, metinler MDX'ten.
// MDX dosyası `export const meta: PostMeta` dışa aktarır; gövde varsayılan dışa aktarımdır.

import { readFileSync } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import {
  BLOG_POST_LOCALE,
  BLOG_POSTS,
  type BlogCategoryId,
  type BlogPost,
  type BlogPostDef,
  getPostDef,
} from "@/config/blog";
import type { FaqItem } from "@/components/sections/faq-list";

/** MDX içindeki `export const meta` */
export type PostMeta = {
  /** <title> (şablonla birlikte 50–60 karakter) */
  title: string;
  /** Sayfadaki H1 (title'dan uzun olabilir) */
  h1: string;
  /** meta description (140–160 karakter) */
  description: string;
  /** Kartlarda ve yazı başında gösterilen kısa özet */
  excerpt: string;
  /** Kapak fotoğrafının alt metni (anahtar kelimeyi içerir, 6.3) */
  coverAlt: string;
  /** Ana anahtar kelime (6.7) */
  keyword: string;
  /** Yazı sonundaki SSS (FAQPage JSON-LD) */
  faq?: FaqItem[];
};

export type Post = Omit<BlogPost, "cover"> & {
  cover: BlogPostDef["cover"];
  meta: PostMeta;
  readingMinutes: number;
};

type PostModule = {
  default: ComponentType<{ components?: MDXComponents }>;
  meta: PostMeta;
};

const contentFile = (slug: string) =>
  path.join(process.cwd(), "content", BLOG_POST_LOCALE, "blog", `${slug}.mdx`);

async function loadModule(slug: string): Promise<PostModule> {
  return import(`@/content/tr/blog/${slug}.mdx`);
}

/**
 * Okuma süresi (dakika, en az 1): `export` bloğu, JSX etiketleri ve markdown işaretleri
 * çıkarıldıktan sonra kalan kelimeler, dakikada 200 kelimeyle.
 */
export function readingMinutes(source: string) {
  const body = source
    .replace(/^export const meta[\s\S]*?^};?\s*$/m, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/[#>*_`|[\]-]/g, " ");
  const words = body.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return Math.max(1, Math.round(words / 200));
}

async function toPost(def: BlogPost): Promise<Post> {
  const { meta } = await loadModule(def.slug);
  const source = readFileSync(contentFile(def.slug), "utf8");
  return { ...def, meta, readingMinutes: readingMinutes(source) };
}

/** Tüm yazılar, en yeniden eskiye (aynı tarihte config sırası korunur). */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await Promise.all(BLOG_POSTS.map(toPost));
  return posts
    .map((post, index) => ({ post, index }))
    .sort(
      (a, b) => b.post.publishedAt.localeCompare(a.post.publishedAt) || a.index - b.index,
    )
    .map(({ post }) => post);
}

export async function getPostsByCategory(category: BlogCategoryId) {
  return (await getAllPosts()).filter((p) => p.category === category);
}

/** Yazı + MDX gövdesi. Bilinmeyen slug için undefined. */
export async function getPost(slug: string) {
  const def = getPostDef(slug);
  if (!def) return undefined;
  const [post, mod] = await Promise.all([toPost(def), loadModule(slug)]);
  return { post, Content: mod.default };
}

/** İlgili yazılar: önce aynı kategori, sonra diğerleri (en yeni önce). */
export async function getRelatedPosts(post: Post, limit = 3) {
  const others = (await getAllPosts()).filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, limit);
}

/** Tarih biçimi: 20 Kasım 2026 / 20 November 2026 */
export function formatPostDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    dateStyle: "long",
    timeZone: "Europe/Istanbul",
  }).format(new Date(`${iso}T12:00:00+03:00`));
}
