import type { ReactNode } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Typography";

export type TableFilterValue = string | string[];

export interface TableFilterOption {
  value: string;
  label: string;
  count?: number;
}

export type TableFilterDefinition =
  | {
    id: string;
    type: "search";
    label: string;
    placeholder?: string;
    value: string;
    minWidth?: number;
  }
  | {
    id: string;
    type: "select";
    label: string;
    value: string;
    options: TableFilterOption[];
    allLabel?: string;
    minWidth?: number;
  }
  | {
    id: string;
    type: "multi-select";
    label: string;
    value: string[];
    options: TableFilterOption[];
    minWidth?: number;
  }
  | {
    id: string;
    type: "date";
    label: string;
    value: string;
    minWidth?: number;
  };

export interface TableFilterBarLabels {
  title?: string;
  clearAll?: string;
  activeFilters?: string;
  noFilters?: string;
  results?: (filteredCount: number, totalCount: number) => string;
}

export interface TableFilterBarProps {
  filters: TableFilterDefinition[];
  totalCount: number;
  filteredCount: number;
  onFilterChange: (filterId: string, value: TableFilterValue) => void;
  onClearFilters: () => void;
  labels?: TableFilterBarLabels;
  actions?: ReactNode;
  className?: string;
}

const DEFAULT_LABELS: Required<TableFilterBarLabels> = {
  title: "تصفية الجدول",
  clearAll: "مسح الفلاتر",
  activeFilters: "الفلاتر النشطة",
  noFilters: "لا توجد فلاتر نشطة",
  results: (filteredCount, totalCount) => `${filteredCount} من ${totalCount} نتيجة`,
};

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function isActive(filter: TableFilterDefinition) {
  if (Array.isArray(filter.value)) return filter.value.length > 0;
  return filter.value.trim().length > 0 && filter.value !== "all";
}

function optionLabel(filter: TableFilterDefinition, value: string) {
  if (filter.type !== "select" && filter.type !== "multi-select") return value;
  return filter.options.find((option) => option.value === value)?.label ?? value;
}

function filterSummary(filter: TableFilterDefinition) {
  if (filter.type === "multi-select") {
    return filter.value.length > 0 ? `${filter.value.length} محدد` : "الكل";
  }

  if (filter.type === "select") {
    return filter.value === "all" ? (filter.allLabel ?? "الكل") : optionLabel(filter, filter.value);
  }

  if (filter.type === "date") {
    return filter.value || "أي تاريخ";
  }

  return filter.value;
}

export function TableFilterBar({
  filters,
  totalCount,
  filteredCount,
  onFilterChange,
  onClearFilters,
  labels,
  actions,
  className,
}: TableFilterBarProps) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const activeFilters = filters.filter(isActive);
  const searchFilters = filters.filter((filter) => filter.type === "search");
  const chipFilters = filters.filter((filter) => filter.type !== "search");

  return (
    <section className={cx("border-b border-border bg-card", className)} aria-label={text.title}>
      <div className="grid gap-2 px-3 py-2">
        <div className="flex min-h-9 flex-wrap items-center gap-2">
          {text.title ? (
            <div className="flex items-center gap-4">
              <Text as="h3" variant="body-sm" className="border-b-2 border-primary pb-2 font-semibold text-foreground">
                {text.title}
              </Text>
            </div>
          ) : null}

          <Text as="p" variant="caption" tone="muted" className="sr-only" aria-live="polite">
            {text.results(filteredCount, totalCount)}
          </Text>

          <div className="ms-auto flex flex-wrap items-center gap-1.5">
            {searchFilters.map((filter) => (
              <label key={filter.id} className="qbs-focus qbs-field flex h-8 w-56 items-center gap-2 px-2.5">
                <span className="sr-only">{filter.label}</span>
                <Search size={15} className="text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  value={filter.value}
                  onChange={(event) => onFilterChange(filter.id, event.target.value)}
                  placeholder={filter.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </label>
            ))}
            {actions}
          </div>
        </div>

        {chipFilters.length > 0 || activeFilters.length > 0 ? (
          <div className="flex min-h-9 flex-wrap items-center gap-1.5 border-t border-border pt-2" aria-live="polite">
            {chipFilters.map((filter) => {
              const active = isActive(filter);

              if (filter.type === "multi-select") {
                return (
                  <details key={filter.id} className="group relative">
                  <summary
                    className={cx(
                      "qbs-focus flex h-8 list-none items-center gap-2 rounded-md border px-2.5 text-xs font-medium transition-colors marker:hidden",
                      active ? "border-border bg-secondary text-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span className="text-muted-foreground">{filter.label}</span>
                    {filter.value.length > 0 ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-bold text-primary amount">
                        {filter.value.length}
                      </span>
                    ) : null}
                    <span className="font-semibold text-foreground">{filterSummary(filter)}</span>
                    <ChevronDown size={13} className="text-muted-foreground" aria-hidden="true" />
                  </summary>
                  <div className="qbs-panel absolute start-0 top-full z-50 mt-1.5 w-64 p-2">
                    <fieldset className="space-y-1">
                      <legend className="sr-only">{filter.label}</legend>
                      {filter.options.map((option) => {
                        const checked = filter.value.includes(option.value);
                        return (
                          <label
                            key={option.value}
                            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(event) => {
                                const next = event.target.checked
                                  ? [...filter.value, option.value]
                                  : filter.value.filter((value) => value !== option.value);
                                onFilterChange(filter.id, next);
                              }}
                              className="h-4 w-4 accent-primary"
                            />
                            <span className="flex-1 text-foreground">{option.label}</span>
                            {option.count !== undefined ? (
                              <span className="amount text-xs text-muted-foreground">{option.count}</span>
                            ) : null}
                          </label>
                        );
                      })}
                    </fieldset>
                  </div>
                  </details>
                );
              }

              if (filter.type === "date") {
                return (
                  <label
                  key={filter.id}
                  className={cx(
                    "qbs-focus flex h-8 items-center gap-2 rounded-md border px-2.5 text-xs font-medium",
                    active ? "border-border bg-secondary" : "border-border bg-card text-muted-foreground"
                  )}
                >
                  <span className="text-muted-foreground">{filter.label}</span>
                  <input
                    type="date"
                    value={filter.value}
                    onChange={(event) => onFilterChange(filter.id, event.target.value)}
                    className="bg-transparent text-xs font-semibold text-foreground outline-none"
                  />
                  </label>
                );
              }

              return (
                <label
                key={filter.id}
                className={cx(
                  "qbs-focus relative flex h-8 items-center gap-2 rounded-md border px-2.5 text-xs font-medium",
                  active ? "border-border bg-secondary text-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                <span className="text-muted-foreground">{filter.label}</span>
                {filter.value !== "all" && filter.value ? (
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                ) : null}
                <span className="font-semibold text-foreground">{filterSummary(filter)}</span>
                <select
                  value={filter.value}
                  onChange={(event) => onFilterChange(filter.id, event.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label={filter.label}
                >
                  <option value="all">{filter.allLabel ?? "الكل"}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.count !== undefined ? `${option.label} (${option.count})` : option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="text-muted-foreground" aria-hidden="true" />
                </label>
              );
            })}

            {activeFilters.length > 0 ? (
              <Button size="xs" variant="ghost" startIcon={<X size={12} />} onClick={onClearFilters}>
                {text.clearAll}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
