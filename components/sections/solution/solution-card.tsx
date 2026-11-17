import { ArrowRight, CircleCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PAGES } from "@/config/navigation";
import type { Solution } from "@/config/solutions";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Çözüm kartı: ikon + başlık (link) + tek satır açıklama, istenirse 3 madde.
 * ProductCard ile aynı görünüm; /cozumler ve "İlgili çözümler" kullanır.
 * Kartın tamamı tıklanır (başlık linkinin ::after katmanı), metin yine tek bir <a>'dır.
 */
export async function SolutionCard({
  solution,
  points,
  className,
}: {
  solution: Solution;
  points?: string[];
  className?: string;
}) {
  const tp = await getTranslations("pages");
  const t = await getTranslations("solutionPage");
  const Icon = solution.icon;

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
      <h3 className="text-lg font-bold">
        <Link
          href={PAGES[solution.id].href}
          className="outline-none after:absolute after:inset-0 after:rounded-[20px] after:content-['']"
        >
          {tp(`${solution.id}.label`)}
        </Link>
      </h3>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        {tp(`${solution.id}.description`)}
      </p>
      {points?.length ? (
        <ul className="flex flex-col gap-2 pt-1">
          {points.map((point) => (
            <li key={point} className="flex gap-2.5 text-[15px]">
              <CircleCheck
                className="mt-0.5 size-[18px] shrink-0 text-primary dark:text-accent"
                aria-hidden="true"
              />
              {point}
            </li>
          ))}
        </ul>
      ) : null}
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
