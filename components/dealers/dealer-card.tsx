import {
  Building2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Smartphone,
} from "lucide-react";
import type { Dealer } from "@/config/dealers";
import { cn } from "@/lib/utils";

export type DealerCardLabels = {
  headquarters: string;
  directions: string;
  website: string;
  /** İl adı (ilçe ile birlikte gösterilir) */
  province: string;
};

const linkClass =
  "inline-flex items-center gap-1.5 rounded font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:text-accent";

/** Bayi kartı: hook kullanmaz; hem sunucuda (liste, il sayfası) hem istemcide (harita paneli) render edilir. */
export function DealerCard({
  dealer,
  labels,
  headingLevel = "h3",
  className,
}: {
  dealer: Dealer;
  labels: DealerCardLabels;
  headingLevel?: "h3" | "h4";
  className?: string;
}) {
  const Heading = headingLevel;
  const place = [dealer.district, labels.province].filter(Boolean).join(" / ");
  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-[20px] border border-border bg-background p-5 md:p-6 dark:bg-surface",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Heading className="flex items-center gap-2 text-lg font-bold">
          <Building2
            className="size-5 shrink-0 text-primary dark:text-accent"
            aria-hidden="true"
          />
          {dealer.name}
        </Heading>
        {dealer.isHeadquarters ? (
          <span className="rounded-full bg-info px-2.5 py-1 text-xs font-bold text-info-foreground">
            {labels.headquarters}
          </span>
        ) : null}
      </div>
      <ul className="flex flex-col gap-2 text-[15px]">
        <li className="flex items-start gap-2.5">
          <MapPin
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <address className="not-italic">
            {dealer.address ? <span className="block">{dealer.address}</span> : null}
            {place ? <span className="block text-muted-foreground">{place}</span> : null}
          </address>
        </li>
        <li className="flex items-center gap-2.5">
          <Phone className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <a href={`tel:${dealer.phone}`} className={linkClass}>
            {dealer.phoneDisplay ?? dealer.phone}
          </a>
        </li>
        {dealer.mobile ? (
          <li className="flex items-center gap-2.5">
            <Smartphone
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <a href={`tel:${dealer.mobile}`} className={linkClass}>
              {dealer.mobileDisplay ?? dealer.mobile}
            </a>
          </li>
        ) : null}
        {dealer.email ? (
          <li className="flex items-center gap-2.5">
            <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <a href={`mailto:${dealer.email}`} className={cn(linkClass, "break-all")}>
              {dealer.email}
            </a>
          </li>
        ) : null}
        {dealer.website ? (
          <li className="flex items-center gap-2.5">
            <Globe className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <a href={dealer.website} target="_blank" rel="noopener" className={linkClass}>
              {labels.website}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </li>
        ) : null}
      </ul>
      {dealer.mapsUrl ? (
        <a
          href={dealer.mapsUrl}
          target="_blank"
          rel="noopener"
          className={cn(linkClass, "text-sm")}
        >
          {labels.directions}
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      ) : null}
    </article>
  );
}
