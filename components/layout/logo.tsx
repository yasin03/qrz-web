import Image from "next/image";
import { cn } from "@/lib/utils";
import logoPri from "@/public/logos/logo-pri.png";
import logoSec from "@/public/logos/logo-sec.png";

/**
 * QR Zaman logosu (4.3): açık zeminde logo-pri, koyu zeminde logo-sec.
 * İki görsel de basılır, CSS ile biri gösterilir (tema bilgisi sunucuda yok, hydration hatası yok).
 *
 * auto   → açık temada pri, koyu temada sec
 * header → auto + ana sayfa hero'sunda (data-hero) sec
 * onDark → her zaman sec (footer, lacivert bantlar)
 */
export function Logo({
  variant = "auto",
  alt = "QR Zaman",
  aboveFold = false,
  className,
}: {
  variant?: "auto" | "header" | "onDark";
  alt?: string;
  aboveFold?: boolean;
  className?: string;
}) {
  const common = {
    sizes: "180px",
    loading: aboveFold ? ("eager" as const) : undefined,
    fetchPriority: aboveFold ? ("high" as const) : undefined,
    className: cn("h-full w-auto", className),
  };

  if (variant === "onDark") return <Image src={logoSec} alt={alt} {...common} />;

  return (
    <>
      <Image
        src={logoPri}
        alt={alt}
        {...common}
        className={cn(
          common.className,
          "dark:hidden",
          variant === "header" && "group-data-[hero=true]/header:hidden",
        )}
      />
      <Image
        src={logoSec}
        // İkinci görsel ekran okuyucuya tekrar okunmaz
        alt=""
        {...common}
        aria-hidden="true"
        className={cn(
          common.className,
          "hidden dark:block",
          variant === "header" && "group-data-[hero=true]/header:block",
        )}
      />
    </>
  );
}
