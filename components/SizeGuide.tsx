import {
  BLANK_ORIGIN_COPY,
  CARE_COPY,
  FULFILLMENT_COPY,
  SIZE_CHART,
  SIZES,
} from "@/lib/types";

export function SizeGuide({ compact = false }: { compact?: boolean }) {
  return (
    <details className="group mt-3">
      <summary className="cursor-pointer font-mono text-[10px] tracking-[0.18em] text-cyan uppercase">
        Size guide
      </summary>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[280px] text-left text-xs text-muted">
          <thead>
            <tr className="font-mono text-[10px] tracking-[0.14em] text-white/70 uppercase">
              <th className="pb-2 pr-3 font-normal">Size</th>
              <th className="pb-2 pr-3 font-normal">US men</th>
              <th className="pb-2 pr-3 font-normal">US women</th>
              <th className="pb-2 pr-3 font-normal">EU</th>
              <th className="pb-2 font-normal">UK</th>
            </tr>
          </thead>
          <tbody>
            {SIZES.map((size) => {
              const row = SIZE_CHART[size];
              return (
                <tr key={size} className="border-t border-white/8">
                  <td className="py-1.5 pr-3 font-mono text-white">{size}</td>
                  <td className="py-1.5 pr-3">{row.usMen}</td>
                  <td className="py-1.5 pr-3">{row.usWomen}</td>
                  <td className="py-1.5 pr-3">{row.eu}</td>
                  <td className="py-1.5">{row.uk}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!compact ? (
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            Printful Black Foot Sublimated Socks — M, L, XL only. {FULFILLMENT_COPY}{" "}
            {CARE_COPY} {BLANK_ORIGIN_COPY}
          </p>
        ) : null}
      </div>
    </details>
  );
}
