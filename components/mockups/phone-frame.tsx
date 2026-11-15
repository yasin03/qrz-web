import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export type PhoneScreen = Pick<ImageProps, "src" | "alt">;

type PhoneFrameProps = {
  /**
   * 1 ekran: sabit görünür.
   * 2–3 ekran: her biri 4 sn görünür, yumuşak geçişle sırayla değişir (4.5).
   * Fazlası verilirse ilk 3 ekran kullanılır.
   */
  screens: PhoneScreen[];
  /** Süzülme animasyonu (6 sn döngü) */
  float?: boolean;
  /** Süzülmeyi yarım tur kaydırır (yan yana iki öğe aynı anda hareket etmesin) */
  floatOffset?: boolean;
  /** Ekranın üst kısmındaysa (hero) ilk ekran öncelikli yüklenir */
  aboveFold?: boolean;
  sizes?: string;
  className?: string;
};

const CYCLE_SECONDS = 4;

/** Mobil ekran görüntüleri için telefon çerçevesi. */
export function PhoneFrame({
  screens,
  float = false,
  floatOffset = false,
  aboveFold = false,
  sizes = "(min-width: 1024px) 210px, 45vw",
  className,
}: PhoneFrameProps) {
  const list = screens.slice(0, 3);
  const cycling = list.length > 1;
  const cycleClass = list.length === 3 ? "qz-screen-cycle-3" : "qz-screen-cycle-2";

  return (
    <div
      className={cn(
        "relative w-[210px] rounded-[40px] bg-phone-frame p-2 shadow-phone",
        float && "animate-qz-float",
        float && floatOffset && "[animation-delay:-3s]",
        className,
      )}
    >
      {list.map((screen, index) => (
        <Image
          key={index}
          src={screen.src}
          alt={screen.alt}
          sizes={sizes}
          loading={aboveFold && index === 0 ? "eager" : undefined}
          fetchPriority={aboveFold && index === 0 ? "high" : undefined}
          data-cycle-index={cycling ? index : undefined}
          // Birden fazla ekran varken yalnızca ilk ekran okunur; diğerleri görsel tekrardır
          aria-hidden={cycling && index > 0 ? true : undefined}
          className={cn(
            "block h-auto w-full rounded-[32px]",
            cycling && cycleClass,
            index > 0 && "absolute top-2 left-2 w-[calc(100%-16px)]",
          )}
          style={cycling ? { animationDelay: `${index * CYCLE_SECONDS}s` } : undefined}
        />
      ))}
    </div>
  );
}
