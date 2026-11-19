import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * İkonlu kart (destek kanalları kartlarıyla aynı görünüm): ikon + H3 + metin + isteğe bağlı alt içerik.
 * Liste öğesi olarak render edilir; <ul> içinde kullanılır.
 */
export function IconCard({
  icon: Icon,
  title,
  text,
  index = 0,
  children,
  className,
}: {
  icon: LucideIcon;
  title: ReactNode;
  text?: ReactNode;
  index?: number;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal
      as="li"
      index={index}
      className={cn(
        "flex flex-col gap-3 rounded-[20px] border border-border p-6 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none md:p-7 dark:bg-surface",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-info text-info-foreground">
        <Icon className="size-[22px]" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
      {text ? (
        <p className="text-[15px] leading-relaxed text-muted-foreground">{text}</p>
      ) : null}
      {children ? <div className="mt-auto pt-1">{children}</div> : null}
    </Reveal>
  );
}

/** Kart içi vurgulu link/değer stili */
export const cardLinkClass =
  "inline-flex items-center gap-1.5 rounded text-base font-bold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-accent";
