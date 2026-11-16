import type { Thing, WithContext } from "schema-dts";

/**
 * JSON-LD yapısal veri (6.5). Tipler schema-dts'ten gelir.
 * "<" kaçışlanır: içerikteki bir "</script>" etiketi script'i erken kapatamaz.
 */
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
