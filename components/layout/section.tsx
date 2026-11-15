import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Container } from "./container";

const sectionVariants = cva("relative", {
  variants: {
    tone: {
      default: "bg-background text-foreground",
      surface: "bg-surface text-foreground",
      navy: "bg-navy text-navy-foreground",
      hero: "overflow-hidden bg-hero text-navy-foreground",
    },
    spacing: {
      none: "",
      sm: "py-12 md:py-16",
      md: "py-16 md:py-24",
      lg: "py-20 md:py-28",
    },
  },
  defaultVariants: { tone: "default", spacing: "md" },
});

type SectionProps = Omit<ComponentProps<"section">, "title"> &
  VariantProps<typeof sectionVariants> & {
    /** Başlık id'si verilirse section `aria-labelledby` ile bağlanır (6.3). */
    labelledBy?: string;
    /** false ise içerik Container ile sarılmaz. */
    contained?: boolean;
    containerClassName?: string;
    children: ReactNode;
  };

export function Section({
  tone,
  spacing,
  labelledBy,
  contained = true,
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(sectionVariants({ tone, spacing }), className)}
      {...props}
    >
      {contained ? (
        <Container className={containerClassName}>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
}

/** Bölüm başlığı: üst etiket + H2 + açıklama. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "center",
  onDark = false,
  className,
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "start";
  /** Lacivert zeminli bölümlerde (navy / hero) true verilir. */
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "text-sm font-bold tracking-wide uppercase",
            onDark ? "text-accent" : "text-primary",
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        id={id}
        className="text-3xl leading-tight font-extrabold text-balance md:text-[44px]"
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "text-lg leading-relaxed text-pretty",
            onDark ? "text-navy-muted" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
