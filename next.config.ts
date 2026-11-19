import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import { localeRedirects, localeRewrites } from "./i18n/url-rules";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// MDX: yasal metinler (content/{locale}/legal/*.mdx), Faz 8'de blog.
// Turbopack için eklentiler string olarak verilir.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Dil yönlendirmesi (TR öneksiz, EN /en + çevrilmiş slug): i18n/url-rules.ts
  rewrites: async () => localeRewrites(),
  redirects: async () => localeRedirects(),
};

export default withNextIntl(withMDX(nextConfig));
