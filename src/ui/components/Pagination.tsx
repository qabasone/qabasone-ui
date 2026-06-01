import { useState } from "react";
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PaginationProps {
  /** Total number of rows/items */
  total: number;
  /** Current active page (1-based) */
  page: number;
  /** Rows per page */
  pageSize: number;
  /** Called when the user changes page */
  onPageChange: (page: number) => void;
  /** Called when the user changes page size */
  onPageSizeChange?: (size: number) => void;
  /** Available page size options. Default: [10, 25, 50, 100] */
  pageSizeOptions?: number[];
  /**
   * Visual variant:
   * - "full"    — count label + page sizes + page buttons (default)
   * - "compact" — count label + prev/next only
   * - "minimal" — prev/next + page indicator only
   */
  variant?: "full" | "compact" | "minimal";
  /** Custom label for the total. Receives (from, to, total). */
  renderCount?: (from: number, to: number, total: number) => React.ReactNode;
}

// ── Helper: page-number list with ellipsis ─────────────────────────────────────

function buildPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [];
  pages.push(1);
  if (current > 4) pages.push("…");
  const lo = Math.max(2, current - 1);
  const hi = Math.min(total - 1, current + 1);
  for (let p = lo; p <= hi; p++) pages.push(p);
  if (current < total - 3) pages.push("…");
  pages.push(total);
  return pages;
}

// ── Icon button helper ─────────────────────────────────────────────────────────

function NavBtn({
  onClick, disabled, children, title,
}: {
  onClick: () => void; disabled: boolean; children: React.ReactNode; title?: string;
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

// ── Main component ─────────────────────────────────────────────────────────────

export function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  variant = "full",
  renderCount,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to = Math.min(page * pageSize, total);

  const goTo = (p: number) => {
    const clamped = Math.max(1, Math.min(p, totalPages));
    if (clamped !== page) onPageChange(clamped);
  };

  const countLabel = renderCount ? renderCount(from, to, total) : (
    <span className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
      عرض{" "}
      <span className="text-foreground amount" style={{ fontWeight: 600 }}>
        {from}–{to}
      </span>{" "}
      من أصل{" "}
      <span className="text-foreground amount" style={{ fontWeight: 600 }}>{total}</span>
    </span>
  );

  // ── minimal ──────────────────────────────────────────────────────────────────
  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-between gap-3">
        {countLabel}
        <div className="flex items-center gap-1.5">
          <NavBtn onClick={() => goTo(page - 1)} disabled={page === 1} title="الصفحة السابقة">
            <ChevronRight size={14} />
          </NavBtn>
          <span className="text-xs text-muted-foreground px-1" style={{ fontWeight: 500 }}>
            <span className="text-foreground amount" style={{ fontWeight: 600 }}>{page}</span>
            {" / "}
            <span className="amount">{totalPages}</span>
          </span>
          <NavBtn onClick={() => goTo(page + 1)} disabled={page === totalPages} title="الصفحة التالية">
            <ChevronLeft size={14} />
          </NavBtn>
        </div>
      </div>
    );
  }

  // ── compact ──────────────────────────────────────────────────────────────────
  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {countLabel}
        <div className="flex items-center gap-1">
          <NavBtn onClick={() => goTo(1)} disabled={page === 1} title="الصفحة الأولى">
            <ChevronsRight size={13} />
          </NavBtn>
          <NavBtn onClick={() => goTo(page - 1)} disabled={page === 1} title="السابق">
            <ChevronRight size={14} />
          </NavBtn>
          <span className="h-8 px-3 flex items-center text-xs rounded-lg border border-primary bg-primary/8"
            style={{ color: "var(--primary)", fontWeight: 600 }}>
            <span className="amount">{page}</span>
            <span className="text-muted-foreground mx-1">/</span>
            <span className="amount text-muted-foreground" style={{ fontWeight: 400 }}>{totalPages}</span>
          </span>
          <NavBtn onClick={() => goTo(page + 1)} disabled={page === totalPages} title="التالي">
            <ChevronLeft size={14} />
          </NavBtn>
          <NavBtn onClick={() => goTo(totalPages)} disabled={page === totalPages} title="الصفحة الأخيرة">
            <ChevronsLeft size={13} />
          </NavBtn>
        </div>
      </div>
    );
  }

  // ── full (default) ────────────────────────────────────────────────────────────
  const pages = buildPages(page, totalPages);

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Left: count + page size */}
      <div className="flex items-center gap-3">
        {countLabel}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">عرض</span>
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
            <span className="text-xs text-muted-foreground">صف</span>
          </div>
        )}
      </div>

      {/* Right: page buttons */}
      <div className="flex items-center gap-1">
        <NavBtn onClick={() => goTo(1)} disabled={page === 1} title="الأولى">
          <ChevronsRight size={13} />
        </NavBtn>
        <NavBtn onClick={() => goTo(page - 1)} disabled={page === 1} title="السابق">
          <ChevronRight size={14} />
        </NavBtn>

        <div className="flex items-center gap-0.5 mx-0.5">
          {pages.map((p, i) =>
            p === "…" ? (
              <span
                key={`ellipsis-${i}`}
                className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground select-none"
              >
                …
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

        <NavBtn onClick={() => goTo(page + 1)} disabled={page === totalPages} title="التالي">
          <ChevronLeft size={14} />
        </NavBtn>
        <NavBtn onClick={() => goTo(totalPages)} disabled={page === totalPages} title="الأخيرة">
          <ChevronsLeft size={13} />
        </NavBtn>
      </div>
    </div>
  );
}
