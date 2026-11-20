import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// MDX içeriğinin (yasal metinler, blog yazıları) görünümü. Başlık id'leri rehype-slug'dan gelir.
const components: MDXComponents = {
  h2: ({ className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={cn(
        "mt-12 scroll-mt-[calc(var(--header-h)+1.5rem)] text-2xl leading-tight font-extrabold first:mt-0 md:text-[28px]",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-8 scroll-mt-[calc(var(--header-h)+1.5rem)] text-lg font-bold",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentProps<"p">) => (
    <p
      className={cn("mt-4 text-[15px] leading-relaxed md:text-base", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ComponentProps<"ul">) => (
    <ul
      className={cn(
        "mt-4 flex list-disc flex-col gap-2 pl-6 text-[15px] leading-relaxed md:text-base",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={cn(
        "mt-4 flex list-decimal flex-col gap-2 pl-6 text-[15px] leading-relaxed md:text-base",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: ComponentProps<"a">) => (
    <a
      className={cn(
        "font-semibold break-words text-primary underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-accent",
        className,
      )}
      {...props}
    />
  ),
  // Blog: bilgilendirme notu
  blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "mt-8 rounded-2xl border border-border bg-surface px-5 py-1 text-muted-foreground [&>p]:mt-3 [&>p]:mb-3 [&>p]:text-sm md:[&>p]:text-[15px]",
        className,
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }: ComponentProps<"strong">) => (
    <strong className={cn("font-bold text-foreground", className)} {...props} />
  ),
  table: ({ className, ...props }: ComponentProps<"table">) => (
    <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
      <table
        className={cn(
          "w-full min-w-[520px] border-collapse text-left text-[15px]",
          className,
        )}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }: ComponentProps<"thead">) => (
    <thead className={cn("bg-surface", className)} {...props} />
  ),
  th: ({ className, ...props }: ComponentProps<"th">) => (
    <th className={cn("px-4 py-3 text-sm font-bold", className)} {...props} />
  ),
  td: ({ className, ...props }: ComponentProps<"td">) => (
    <td
      className={cn(
        "border-t border-border px-4 py-3 align-top leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
