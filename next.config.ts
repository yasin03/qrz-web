import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

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
};

export default withNextIntl(withMDX(nextConfig));
