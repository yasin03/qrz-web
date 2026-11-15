import Image, { type ImageProps } from "next/image";
import { useId } from "react";
import { QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

type QrPosterProps = {
  image: Pick<ImageProps, "src" | "alt">;
  caption: string;
  /** Dönen rozetteki çember yazısı (sonunda ayraç ile, ör. "OKUT · KAYDET · BORDRO HAZIR · ") */
  badgeText?: string;
  float?: boolean;
  className?: string;
};

/** Tarama çizgisi animasyonlu, hafif eğik A4 QR afişi + dönen rozet. */
export function QrPoster({
  image,
  caption,
  badgeText,
  float = true,
  className,
}: QrPosterProps) {
  const ringId = useId();

  return (
    <figure
      className={cn(
        "relative w-[190px]",
        float && "animate-qz-float [animation-delay:-3s]",
        className,
      )}
    >
      <div className="rotate-[5deg] rounded-[20px] bg-poster p-2.5 shadow-poster">
        <div className="relative overflow-hidden rounded-xl">
          <Image
            src={image.src}
            alt={image.alt}
            sizes="190px"
            className="block h-auto w-full"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-[6%] top-[16%] h-[3px] animate-qz-scan rounded-[3px] bg-scan shadow-scan"
          />
        </div>
        <figcaption className="mt-2 text-center text-xs font-bold text-poster-foreground">
          {caption}
        </figcaption>
      </div>

      {badgeText ? (
        <div
          aria-hidden="true"
          className="absolute -top-[46px] -left-[52px] flex size-[100px] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-badge"
        >
          <svg
            viewBox="0 0 132 132"
            className="absolute inset-0 size-full animate-qz-spin"
          >
            <defs>
              <path id={ringId} d="M66 66m-48 0a48 48 0 1 1 96 0a48 48 0 1 1-96 0" />
            </defs>
            <text fontSize="13" fontWeight="800" letterSpacing="2.4" fill="currentColor">
              <textPath href={`#${ringId}`}>{badgeText}</textPath>
            </text>
          </svg>
          <QrCode className="size-7" />
        </div>
      ) : null}
    </figure>
  );
}
