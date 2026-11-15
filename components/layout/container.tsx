import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Sayfa genişliği: tasarımdaki gibi 1240px + 24px yan boşluk. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6", className)}
      {...props}
    />
  );
}
