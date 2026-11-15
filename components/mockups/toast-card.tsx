import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneClasses = {
  info: "bg-info text-info-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
} as const;

type ToastCardProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  tone?: keyof typeof toneClasses;
  /**
   * Telefon ekranıyla eşzamanlı döngü: kartın sırası ve toplam kart sayısı.
   * Verilmezse kart sabit durur.
   */
  cycle?: { index: number; total: 2 | 3 };
  className?: string;
};

/** Hero'daki bildirim kartı ("Mesai başladı", "Konum doğrulandı", "Onay bekliyor"). */
export function ToastCard({
  icon: Icon,
  title,
  description,
  tone = "info",
  cycle,
  className,
}: ToastCardProps) {
  return (
    <div
      data-cycle-index={cycle?.index}
      aria-hidden={cycle && cycle.index > 0 ? true : undefined}
      className={cn(
        "flex items-center gap-3 rounded-[18px] border border-toast-border bg-toast py-3.5 pr-[18px] pl-3.5 shadow-toast",
        cycle && (cycle.total === 3 ? "qz-toast-cycle-3" : "qz-toast-cycle-2"),
        className,
      )}
      style={cycle ? { animationDelay: `${cycle.index * 4}s` } : undefined}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          toneClasses[tone],
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        <span className="text-[17px] font-extrabold text-toast-foreground">{title}</span>
        {description ? (
          <span className="text-[13px] text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </div>
  );
}
