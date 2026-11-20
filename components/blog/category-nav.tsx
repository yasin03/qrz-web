import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getActiveCategories, type BlogCategoryId } from "@/config/blog";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Kategori bağlantıları (gerçek linkler, JS gerekmez). Yalnızca yazısı olan kategoriler. */
export async function CategoryNav({
  locale,
  active,
  counts,
}: {
  locale: Locale;
  /** Geçerli kategori; yoksa "Tüm yazılar" seçilidir */
  active?: BlogCategoryId;
  counts: Partial<Record<BlogCategoryId, number>>;
}) {
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const items: { key: string; href: AppPathname; label: string; current: boolean }[] = [
    { key: "all", href: "/blog", label: t("all"), current: !active },
    ...getActiveCategories().map((c) => ({
      key: c.id,
      href: `/blog/kategori/${c.slug.tr}` as AppPathname,
      label: `${t(`categories.${c.id}.label`)} (${counts[c.id] ?? 0})`,
      current: active === c.id,
    })),
  ];

  return (
    <nav aria-label={t("categoriesLabel")}>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={cn(
                "inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                item.current
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-primary hover:text-primary dark:bg-surface dark:hover:text-accent",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
