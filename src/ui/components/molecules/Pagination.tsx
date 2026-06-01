import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from "lucide-react";

type Direction = "rtl" | "ltr" | "auto";

export interface PaginationLabels {
  rangePrefix: string;
  rangeFromOf: string;
  rowsUnit: string;
  prevPageTitle: string;
  nextPageTitle: string;
  firstPageTitle: string;
  lastPageTitle: string;
  prevShortTitle: string;
  nextShortTitle: string;
  firstShortTitle: string;
  lastShortTitle: string;
}

const DEFAULT_LABELS: PaginationLabels = {
  rangePrefix: "Showing",
  rangeFromOf: "of",
  rowsUnit: "rows",
  prevPageTitle: "Previous page",
  nextPageTitle: "Next page",
  firstPageTitle: "First page",
  lastPageTitle: "Last page",
  prevShortTitle: "Previous",
  nextShortTitle: "Next",
  firstShortTitle: "First",
  lastShortTitle: "Last",
};

export interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  variant?: "full" | "compact" | "minimal";
  renderCount?: (from: number, to: number, total: number) => React.ReactNode;
  dir?: Direction;
  labels?: Partial<PaginationLabels>;
}

function buildPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  if (current > 4) pages.push("...");
  const lo = Math.max(2, current - 1);
  const hi = Math.min(total - 1, current + 1);
  for (let p = lo; p <= hi; p++) pages.push(p);
  if (current < total - 3) pages.push("...");
  pages.push(total);
  return pages;
}

function NavBtn({
  onClick, disabled, children, title,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground border border-border bg-card hover:bg-muted hover:text-foreground transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  variant = "full",
  renderCount,
  dir = "auto",
  labels,
}: PaginationProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to = Math.min(page * pageSize, total);
  const isRtl = dir === "rtl";

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const FirstIcon = isRtl ? ChevronsRight : ChevronsLeft;
  const LastIcon = isRtl ? ChevronsLeft : ChevronsRight;

  const goTo = (p: number) => {
    const clamped = Math.max(1, Math.min(p, totalPages));
    if (clamped !== page) onPageChange(clamped);
  };

  const countLabel = renderCount ? renderCount(from, to, total) : (
    <span className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
      {text.rangePrefix}{" "}
      <span className="text-foreground amount" style={{ fontWeight: 600 }}>
        {from}-{to}
      </span>{" "}
      {text.rangeFromOf}{" "}
      <span className="text-foreground amount" style={{ fontWeight: 600 }}>{total}</span>{" "}
      {text.rowsUnit}
    </span>
  );

  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-between gap-3" dir={dir}>
        {countLabel}
        <div className="flex items-center gap-1.5">
          <NavBtn onClick={() => goTo(page - 1)} disabled={page === 1} title={text.prevPageTitle}>
            <PrevIcon size={14} />
          </NavBtn>
          <span className="text-xs text-muted-foreground px-1" style={{ fontWeight: 500 }}>
            <span className="text-foreground amount" style={{ fontWeight: 600 }}>{page}</span>
            {" / "}
            <span className="amount">{totalPages}</span>
          </span>
          <NavBtn onClick={() => goTo(page + 1)} disabled={page === totalPages} title={text.nextPageTitle}>
            <NextIcon size={14} />
          </NavBtn>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between gap-3 flex-wrap" dir={dir}>
        {countLabel}
        <div className="flex items-center gap-1">
          <NavBtn onClick={() => goTo(1)} disabled={page === 1} title={text.firstPageTitle}>
            <FirstIcon size={13} />
          </NavBtn>
          <NavBtn onClick={() => goTo(page - 1)} disabled={page === 1} title={text.prevShortTitle}>
            <PrevIcon size={14} />
          </NavBtn>
          <span className="h-8 px-3 flex items-center text-xs rounded-lg border border-primary bg-primary/8" style={{ color: "var(--primary)", fontWeight: 600 }}>
            <span className="amount">{page}</span>
            <span className="text-muted-foreground mx-1">/</span>
            <span className="amount text-muted-foreground" style={{ fontWeight: 400 }}>{totalPages}</span>
          </span>
          <NavBtn onClick={() => goTo(page + 1)} disabled={page === totalPages} title={text.nextShortTitle}>
            <NextIcon size={14} />
          </NavBtn>
          <NavBtn onClick={() => goTo(totalPages)} disabled={page === totalPages} title={text.lastPageTitle}>
            <LastIcon size={13} />
          </NavBtn>
        </div>
      </div>
    );
  }

  const pages = buildPages(page, totalPages);

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap" dir={dir}>
      <div className="flex items-center gap-3">
        {countLabel}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">{text.rangePrefix}</span>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
                className="h-7 ps-2.5 pe-6 rounded-lg border border-border bg-card text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                style={{ color: "var(--foreground)", fontWeight: 500 }}
              >
                {pageSizeOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span className="absolute top-1/2 -translate-y-1/2 end-1.5 text-muted-foreground pointer-events-none" style={{ fontSize: "10px" }}>▾</span>
            </div>
            <span className="text-xs text-muted-foreground">{text.rowsUnit}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <NavBtn onClick={() => goTo(1)} disabled={page === 1} title={text.firstShortTitle}>
          <FirstIcon size={13} />
        </NavBtn>
        <NavBtn onClick={() => goTo(page - 1)} disabled={page === 1} title={text.prevShortTitle}>
          <PrevIcon size={14} />
        </NavBtn>

        <div className="flex items-center gap-0.5 mx-0.5">
          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => goTo(p as number)}
                className="w-8 h-8 rounded-lg text-xs transition-all amount"
                style={
                  p === page
                    ? { backgroundColor: "var(--primary)", color: "#fff", fontWeight: 700 }
                    : { color: "var(--muted-foreground)", fontWeight: 500 }
                }
              >
                {p}
              </button>
            )
          )}
        </div>

        <NavBtn onClick={() => goTo(page + 1)} disabled={page === totalPages} title={text.nextShortTitle}>
          <NextIcon size={14} />
        </NavBtn>
        <NavBtn onClick={() => goTo(totalPages)} disabled={page === totalPages} title={text.lastShortTitle}>
          <LastIcon size={13} />
        </NavBtn>
      </div>
    </div>
  );
}
