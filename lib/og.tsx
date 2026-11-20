// Paylaşım görselleri (Open Graph / Twitter, 1200×630): logo + sayfa başlığı, marka renkleri.
// app/og/[locale]/[...path]/route.tsx build sırasında her sayfa için bir PNG üretir.
//
// ImageResponse (Satori) CSS değişkeni okuyamaz; renkler app/globals.css'teki token'ların
// birebir kopyasıdır (--navy, --navy-glow, --navy-muted, --navy-border, --accent, --primary).
// Token değişirse burası da güncellenir.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import {
  BLOG_POST_LOCALE,
  getActiveCategories,
  getCategoryById,
  postPath,
} from "@/config/blog";
import { getDealerProvinces } from "@/config/dealers";
import { PAGES, type PageEntry, type PageId } from "@/config/navigation";
import { SITE_URL } from "@/config/site";
import { routing, type AppPathname } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog";

export const OG_SIZE = { width: 1200, height: 630 };

const OG_COLORS = {
  navy: "#071a3a",
  navyGlow: "#12336b",
  navyMuted: "#b7c6de",
  navyBorder: "#2a4775",
  accent: "#7fb0ff",
  primary: "#1d4ed8",
  white: "#ffffff",
} as const;

export type OgEntry = {
  locale: Locale;
  /** İç yol (TR slug), ör. "/urunler/bordro" */
  href: AppPathname;
  title: string;
  /** Başlığın üstündeki etiket (ör. "Ürünler", blog kategorisi) */
  eyebrow?: string;
};

/** Görseli üretilen tüm sayfalar: config'teki sayfalar, bayi illeri, blog kategorileri ve yazılar. */
export async function getOgEntries(): Promise<OgEntry[]> {
  const posts = await getAllPosts();
  const entries: OgEntry[] = [];

  for (const locale of routing.locales) {
    const t = await getTranslations({ locale, namespace: "pages" });
    const tb = await getTranslations({ locale, namespace: "blogPage" });
    const td = await getTranslations({ locale, namespace: "dealersPage.province" });

    for (const [id, page] of Object.entries(PAGES) as [PageId, PageEntry][]) {
      entries.push({
        locale,
        href: page.href,
        title: t(`${id}.title`),
        eyebrow:
          id === "home"
            ? undefined
            : page.parent
              ? t(`${page.parent}.label`)
              : t(`${id}.label`),
      });
    }

    for (const province of getDealerProvinces()) {
      entries.push({
        locale,
        href: `/bayiler/${province.slug}` as AppPathname,
        title: td("title", { province: province.name }),
        eyebrow: t("dealers.label"),
      });
    }

    for (const category of getActiveCategories()) {
      entries.push({
        locale,
        href: `/blog/kategori/${category.slug.tr}` as AppPathname,
        title: tb(`categories.${category.id}.h1`),
        eyebrow: t("blog.label"),
      });
    }

    if (locale === BLOG_POST_LOCALE) {
      for (const post of posts) {
        const category = getCategoryById(post.category);
        entries.push({
          locale,
          href: postPath(post.slug) as AppPathname,
          title: post.meta.h1,
          eyebrow: category
            ? `${t("blog.label")} · ${tb(`categories.${category.id}.label`)}`
            : t("blog.label"),
        });
      }
    }
  }

  return entries;
}

/** Route segmentleri ↔ iç yol: ["urunler", "bordro.png"] ↔ "/urunler/bordro", ["index.png"] ↔ "/" */
export function ogPathSegments(href: string) {
  const segments = href === "/" ? ["index"] : href.slice(1).split("/");
  segments[segments.length - 1] += ".png";
  return segments;
}

export function hrefFromSegments(segments: string[]) {
  const joined = segments.join("/");
  if (!joined.endsWith(".png")) return undefined;
  const bare = joined.slice(0, -".png".length);
  return bare === "index" ? "/" : `/${bare}`;
}

type OgAssets = { logo: string; icon: string; fonts: { medium: Buffer; extraBold: Buffer } };
let assets: Promise<OgAssets> | undefined;

const dataUrl = (png: Buffer) => `data:image/png;base64,${png.toString("base64")}`;

function loadAssets() {
  assets ??= (async () => {
    const root = process.cwd();
    const [logo, icon, medium, extraBold] = await Promise.all([
      readFile(path.join(root, "public/logos/logo-sec.png")),
      readFile(path.join(root, "public/logos/icon-white.png")),
      readFile(path.join(root, "assets/fonts/Inter-Medium.ttf")),
      readFile(path.join(root, "assets/fonts/Inter-ExtraBold.ttf")),
    ]);
    return {
      logo: dataUrl(logo),
      icon: dataUrl(icon),
      fonts: { medium, extraBold },
    };
  })();
  return assets;
}

/** Uzun başlıklarda yazı boyutu küçülür (en fazla 3 satır). */
function titleSize(title: string) {
  if (title.length <= 38) return 72;
  if (title.length <= 60) return 60;
  if (title.length <= 84) return 52;
  return 44;
}

export async function renderOgImage({ title, eyebrow }: Pick<OgEntry, "title" | "eyebrow">) {
  const { logo, icon, fonts } = await loadAssets();
  const host = new URL(SITE_URL).host;
  const c = OG_COLORS;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: c.navy,
          backgroundImage: `radial-gradient(ellipse 70% 80% at 90% 20%, ${c.navyGlow} 0%, ${c.navy} 65%)`,
          fontFamily: "Inter",
          color: c.white,
        }}
      >
        {/* Sağ altta soluk, büyük QR Zaman ikonu (süs) */}
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse içinde next/image çalışmaz */}
        <img
          src={icon}
          alt=""
          width={420}
          height={420}
          style={{ position: "absolute", right: -60, bottom: -70, opacity: 0.07 }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse içinde next/image çalışmaz */}
        <img src={logo} alt="" width={254} height={72} style={{ objectFit: "contain" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 1000 }}>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "10px 20px",
                borderRadius: 999,
                backgroundColor: c.primary,
                fontSize: 26,
                fontWeight: 500,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: titleSize(title),
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            fontWeight: 500,
            color: c.navyMuted,
          }}
        >
          <div style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: c.accent }} />
          {host}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Inter", data: fonts.medium, weight: 500, style: "normal" },
        { name: "Inter", data: fonts.extraBold, weight: 800, style: "normal" },
      ],
    },
  );
}
