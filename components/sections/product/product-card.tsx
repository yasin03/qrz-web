import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PAGES } from "@/config/navigation";
import type { Product } from "@/config/products";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Ürün kartı: ikon + başlık (link) + tek satır açıklama.
 * Ana sayfadaki "Tek platform" kartlarının stilindedir. /urunler ve "İlgili özellikler" kullanır.
 * Kartın tamamı tıklanır (başlık linkinin ::after katmanı), metin yine tek bir <a>'dır.
 */
export async function ProductCard({
  product,
  headingLevel = "h3",
  className,
}: {
  product: Product;
  headingLevel?: "h3" | "h4";
  className?: string;
}) {
  const tp = await getTranslations("pages");
  const t = await getTranslations("productPage");
  const Icon = product.icon;
  const Heading = headingLevel;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col gap-3 rounded-[20px] border border-border bg-background p-6 transition-transform duration-200 focus-within:ring-2 focus-within:ring-ring hover:-translate-y-1 motion-reduce:transition-none dark:bg-surface",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-info text-info-foreground">
        <Icon className="size-[22px]" aria-hidden="true" />
      </span>
      <Heading className="text-lg font-bold">
        <Link
          href={PAGES[product.id].href}
          className="outline-none after:absolute after:inset-0 after:rounded-[20px] after:content-['']"
        >
          {tp(`${product.id}.label`)}
        </Link>
      </Heading>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        {tp(`${product.id}.description`)}
      </p>
      <span
        aria-hidden="true"
        className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-primary dark:text-accent"
      >
        {t("explore")}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </span>
    </article>
  );
}
