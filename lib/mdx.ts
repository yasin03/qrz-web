// MDX yardımcıları: yasal metinlerin içindekiler listesi.
// Başlık id'leri rehype-slug ile aynı algoritmayla (github-slugger) üretilir.

import { readFileSync } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";

export type TocItem = { id: string; title: string };

/** Markdown başlığındaki biçimlendirmeyi kaldırır (**kalın**, `kod`, [link](...)) */
const plain = (value: string) =>
  value
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();

/** content/<locale>/<dir>/<slug>.mdx içindeki H2 başlıkları */
export function getToc(locale: string, dir: string, slug: string): TocItem[] {
  const file = path.join(process.cwd(), "content", locale, dir, `${slug}.mdx`);
  const source = readFileSync(file, "utf8");
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  let inCode = false;
  for (const line of source.split("\n")) {
    if (line.startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const title = plain(match[2]);
    const id = slugger.slug(title);
    if (match[1].length === 2) toc.push({ id, title });
  }
  return toc;
}
