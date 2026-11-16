import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BrowserFrameProps = {
  /** Adres çubuğunda görünen metin. null ise adres alanı gösterilmez (özellik bölümleri). */
  url?: string | null;
  /** Tek görsel verilirse çerçeve içine yerleştirilir */
  image?: Pick<ImageProps, "src" | "alt" | "sizes" | "quality">;
  /** Koyu tema için ayrı ekran görüntüsü (ör. dashboard-koyu) */
  darkImage?: Pick<ImageProps, "src" | "alt">;
  /**
   * Ekranın üst kısmındaysa (hero / LCP) true. Next 16'da `priority` kaldırıldı:
   * loading="eager" + fetchPriority="high". Açık/koyu çiftinde ikisi de eager yüklenir
   * (tema sunucuda bilinmez; lazy yüklenen LCP görseli daha maliyetlidir).
   */
  aboveFold?: boolean;
  /** Lacivert zemin üzerinde (hero) kenar rengi */
  onDark?: boolean;
  className?: string;
  children?: ReactNode;
};

function lcpProps(aboveFold: boolean) {
  if (!aboveFold) return {};
  return { loading: "eager", fetchPriority: "high" } as const;
}

/** Admin ekran görüntüleri için tarayıcı çerçevesi. */
export function BrowserFrame({
  url = "app.qrzaman.com.tr",
  image,
  darkImage,
  aboveFold = false,
  onDark = false,
  className,
  children,
}: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card shadow-browser",
        onDark ? "border-navy-border" : "border-border",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 border-b border-border bg-browser-bar",
          url === null ? "h-[30px] px-3" : "h-[34px] px-3.5",
        )}
        aria-hidden="true"
      >
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className={cn(
              "rounded-full bg-browser-dot",
              url === null ? "size-[9px]" : "size-2.5",
            )}
          />
        ))}
        {url !== null ? (
          <span className="ml-3.5 truncate rounded-md bg-browser-url px-3 py-[3px] text-[11px] text-muted-foreground">
            {url}
          </span>
        ) : null}
      </div>

      {image ? (
        <>
          <Image
            {...image}
            alt={image.alt}
            {...lcpProps(aboveFold)}
            sizes={image.sizes ?? "(min-width: 1024px) 720px, 100vw"}
            className={cn("block h-auto w-full", darkImage && "dark:hidden")}
          />
          {darkImage ? (
            <Image
              {...image}
              {...lcpProps(aboveFold)}
              src={darkImage.src}
              alt={darkImage.alt}
              sizes={image.sizes ?? "(min-width: 1024px) 720px, 100vw"}
              className="hidden h-auto w-full dark:block"
            />
          ) : null}
        </>
      ) : (
        children
      )}
    </div>
  );
}
