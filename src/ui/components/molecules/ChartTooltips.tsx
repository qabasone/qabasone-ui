/**
 * Reusable chart tooltip components.
 * They work with Recharts Tooltip `content` prop.
 */

interface ChartPayloadItem {
  dataKey?: string;
  name?: string;
  value?: number | string;
  color?: string;
  stroke?: string;
  fill?: string;
  payload?: Record<string, unknown>;
}

interface BaseTooltipProps {
  active?: boolean;
  payload?: ChartPayloadItem[];
  label?: string | number;
}

function toNumeric(value: number | string | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

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

export interface ChartTooltipProps extends BaseTooltipProps {
  seriesLabels?: Record<string, string>;
  valueFormatter?: (value: number, dataKey: string) => string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  seriesLabels,
  valueFormatter,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <TooltipShell>
      {label != null && <TooltipLabel label={String(label)} />}
      <div className="space-y-1.5">
        {payload.map((p, index) => {
          const dataKey = p.dataKey ?? p.name ?? `series-${index}`;
          const numeric = toNumeric(p.value);
          const rowValue = numeric != null
            ? (valueFormatter ? valueFormatter(numeric, dataKey) : String(numeric))
            : String(p.value ?? "");
          return (
            <TooltipRow
              key={`${dataKey}-${index}`}
              color={p.color ?? p.stroke ?? p.fill ?? "var(--muted-foreground)"}
              name={seriesLabels?.[dataKey] ?? p.name ?? dataKey}
              value={rowValue}
            />
          );
        })}
      </div>
    </TooltipShell>
  );
}

export interface PieTooltipProps extends BaseTooltipProps {
  total?: number;
  valueFormatter?: (value: number, name: string) => string;
}

export function PieTooltip({
  active,
  payload,
  total,
  valueFormatter,
}: PieTooltipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const numeric = toNumeric(p.value);
  const pct = total && numeric != null ? Math.round((numeric / total) * 100) : null;
  const name = p.name ?? p.dataKey ?? "Series";

  return (
    <TooltipShell>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2" style={{ fontWeight: 500 }}>
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.fill ?? p.color ?? "var(--muted-foreground)" }} />
        {name}
      </span>
      <div className="h-px bg-border -mx-0.5 mb-2.5" />
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-foreground amount" style={{ fontSize: "13px", fontWeight: 700 }}>
          {numeric != null
            ? (valueFormatter ? valueFormatter(numeric, name) : String(numeric))
            : String(p.value ?? "")}
        </span>
        {pct != null && (
          <span className="text-xs text-muted-foreground">{pct}%</span>
        )}
      </div>
    </TooltipShell>
  );
}

export interface SingleTooltipProps extends BaseTooltipProps {
  seriesLabel?: string;
  valueFormatter?: (value: number) => string;
}

export function SingleTooltip({
  active,
  payload,
  label,
  seriesLabel,
  valueFormatter,
}: SingleTooltipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const numeric = toNumeric(p.value);

  return (
    <TooltipShell>
      {label != null && <TooltipLabel label={String(label)} />}
      <TooltipRow
        color={p.color ?? p.stroke ?? p.fill ?? "var(--muted-foreground)"}
        name={seriesLabel ?? p.name ?? p.dataKey ?? "Series"}
        value={numeric != null
          ? (valueFormatter ? valueFormatter(numeric) : String(numeric))
          : String(p.value ?? "")}
      />
    </TooltipShell>
  );
}
