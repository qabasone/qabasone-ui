/**
 * Reusable chart tooltip components.
 * All accept Recharts' injected props (active, payload, label)
 * plus optional config props for formatting and labelling.
 *
 * Usage:
 *   <Tooltip content={<ChartTooltip seriesLabels={{ revenue: "الإيرادات" }} valueFormatter={fmt} />} />
 *   <Tooltip content={<PieTooltip total={142300} valueFormatter={fmt} />} />
 *   <Tooltip content={<SingleTooltip label="القيمة" valueFormatter={fmt} />} />
 */

// ── shared shell ──────────────────────────────────────────────────────────────

function TooltipShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-card border border-border rounded-xl px-3.5 py-3 min-w-[160px] text-sm"
      style={{ boxShadow: "var(--shadow-popover)", fontFamily: "var(--font-family)" }}
    >
      {children}
    </div>
  );
}

function TooltipLabel({ label }: { label: string }) {
  return (
    <>
      <p className="text-xs text-muted-foreground mb-2" style={{ fontWeight: 500 }}>
        {label}
      </p>
      <div className="h-px bg-border -mx-0.5 mb-2.5" />
    </>
  );
}

function TooltipRow({
  color,
  name,
  value,
}: {
  color: string;
  name: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        {name}
      </span>
      <span
        className="text-foreground amount"
        style={{ fontSize: "12px", fontWeight: 600, tabularNums: true } as React.CSSProperties}
      >
        {value}
      </span>
    </div>
  );
}

// ── ChartTooltip — area / bar / line charts ───────────────────────────────────

export function ChartTooltip({
  active,
  payload,
  label,
  seriesLabels,
  valueFormatter,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  /** Map dataKey → Arabic display name */
  seriesLabels?: Record<string, string>;
  /** Format a raw numeric value to display string */
  valueFormatter?: (value: number, dataKey: string) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <TooltipShell>
      {label && <TooltipLabel label={String(label)} />}
      <div className="space-y-1.5">
        {payload.map((p: any) => (
          <TooltipRow
            key={p.dataKey}
            color={p.color ?? p.stroke ?? p.fill}
            name={seriesLabels?.[p.dataKey] ?? p.name ?? p.dataKey}
            value={
              valueFormatter
                ? valueFormatter(p.value, p.dataKey)
                : String(p.value)
            }
          />
        ))}
      </div>
    </TooltipShell>
  );
}

// ── PieTooltip — pie / donut charts ──────────────────────────────────────────

export function PieTooltip({
  active,
  payload,
  total,
  valueFormatter,
}: {
  active?: boolean;
  payload?: any[];
  /** Pass the sum of all values to show percentage */
  total?: number;
  valueFormatter?: (value: number, name: string) => string;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const pct = total ? Math.round((p.value / total) * 100) : null;

  return (
    <TooltipShell>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2" style={{ fontWeight: 500 }}>
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.payload?.fill ?? p.color }} />
        {p.name}
      </span>
      <div className="h-px bg-border -mx-0.5 mb-2.5" />
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-foreground amount" style={{ fontSize: "13px", fontWeight: 700 }}>
          {valueFormatter ? valueFormatter(p.value, p.name) : p.value}
        </span>
        {pct != null && (
          <span className="text-xs text-muted-foreground">{pct}%</span>
        )}
      </div>
    </TooltipShell>
  );
}

// ── SingleTooltip — single-series sparklines / mini charts ───────────────────

export function SingleTooltip({
  active,
  payload,
  label,
  seriesLabel,
  valueFormatter,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  seriesLabel?: string;
  valueFormatter?: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];

  return (
    <TooltipShell>
      {label && <TooltipLabel label={String(label)} />}
      <TooltipRow
        color={p.color ?? p.stroke ?? p.fill}
        name={seriesLabel ?? p.name ?? p.dataKey}
        value={valueFormatter ? valueFormatter(p.value) : String(p.value)}
      />
    </TooltipShell>
  );
}
