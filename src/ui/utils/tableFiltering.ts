export type TableFilterPrimitive = string | number | boolean | null | undefined;

export interface TableFilterState {
  search?: string;
  equals?: Record<string, string>;
  includes?: Record<string, string[]>;
}

export interface TableFilterConfig<T> {
  searchAccessors?: Array<(row: T) => TableFilterPrimitive>;
  equalsAccessors?: Record<string, (row: T) => TableFilterPrimitive>;
  includesAccessors?: Record<string, (row: T) => TableFilterPrimitive>;
}

export function normalizeFilterText(value: TableFilterPrimitive) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F]/g, "");
}

export function textIncludes(value: TableFilterPrimitive, query: string) {
  const normalizedQuery = normalizeFilterText(query);
  if (!normalizedQuery) return true;
  return normalizeFilterText(value).includes(normalizedQuery);
}

export function applyTableFilters<T>(
  rows: T[],
  state: TableFilterState,
  config: TableFilterConfig<T>
) {
  const query = normalizeFilterText(state.search);
  const equalsEntries = Object.entries(state.equals ?? {}).filter(
    ([, value]) => value && value !== "all"
  );
  const includesEntries = Object.entries(state.includes ?? {}).filter(
    ([, value]) => value.length > 0
  );

  return rows.filter((row) => {
    if (query) {
      const matchesSearch = (config.searchAccessors ?? []).some((accessor) =>
        textIncludes(accessor(row), query)
      );
      if (!matchesSearch) return false;
    }

    for (const [key, expected] of equalsEntries) {
      const accessor = config.equalsAccessors?.[key];
      if (!accessor || String(accessor(row)) !== expected) return false;
    }

    for (const [key, expectedValues] of includesEntries) {
      const accessor = config.includesAccessors?.[key];
      if (!accessor || !expectedValues.includes(String(accessor(row)))) return false;
    }

    return true;
  });
}

export function countOptions<T>(
  rows: T[],
  accessor: (row: T) => TableFilterPrimitive
) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const key = String(accessor(row) ?? "");
    if (!key) return acc;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
