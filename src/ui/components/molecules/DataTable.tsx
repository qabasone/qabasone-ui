import type { CSSProperties, ReactNode } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "../atoms/Button";
import { Text } from "../atoms/Typography";
import { ContextMenuTrigger, type ContextMenuGroup } from "../ContextMenu";

type Direction = "rtl" | "ltr" | "auto";
type TableAlign = "start" | "center" | "end";

export interface DataTableColumn<TData> {
  id: string;
  header: ReactNode;
  accessor?: keyof TData | ((row: TData) => ReactNode);
  cell?: (row: TData, rowIndex: number) => ReactNode;
  width?: number | string;
  minWidth?: number | string;
  align?: TableAlign;
  hidden?: boolean;
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: (column: DataTableColumn<TData>) => void;
  headerClassName?: string;
  cellClassName?: string | ((row: TData, rowIndex: number) => string | undefined);
}

export interface DataTableAction {
  id: string;
  label: string;
  icon?: ButtonProps["iconComponent"];
  variant?: ButtonProps["variant"];
  action?: ButtonProps["action"];
  disabled?: boolean;
  onClick?: () => void;
}

export interface DataTableSelection<TData> {
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  bulkActions?: ReactNode;
  labels?: {
    selected?: (count: number) => string;
    clear?: string;
    selectRow?: (row: TData) => string;
    selectAll?: string;
  };
}

export interface DataTableLabels {
  emptyTitle?: string;
  emptyDescription?: string;
  loading?: string;
  primaryMenu?: string;
}

export interface DataTableProps<TData> {
  title?: ReactNode;
  subtitle?: ReactNode;
  hideTitle?: boolean;
  primaryAction?: ReactNode;
  primaryActions?: DataTableAction[];
  toolbar?: ReactNode;
  filters?: ReactNode;
  search?: ReactNode;
  beforeTable?: ReactNode;
  afterTable?: ReactNode;
  footer?: ReactNode;
  columns: DataTableColumn<TData>[];
  rows: TData[];
  getRowId: (row: TData, rowIndex: number) => string;
  rowActions?: (row: TData, rowIndex: number) => ReactNode;
  rowClassName?: string | ((row: TData, rowIndex: number) => string | undefined);
  onRowClick?: (row: TData, rowIndex: number) => void;
  selection?: DataTableSelection<TData>;
  loading?: boolean;
  emptyState?: ReactNode;
  labels?: DataTableLabels;
  dir?: Direction;
  className?: string;
  tableClassName?: string;
  style?: CSSProperties;
}

const DEFAULT_LABELS: Required<DataTableLabels> = {
  emptyTitle: "لا توجد بيانات",
  emptyDescription: "لا توجد صفوف مطابقة للعرض الحالي.",
  loading: "جاري تحميل البيانات",
  primaryMenu: "إجراءات إضافية",
};

const DEFAULT_SELECTION_LABELS = {
  selected: (count: number) => `${count} محدد`,
  clear: "إلغاء التحديد",
  selectRow: () => "تحديد الصف",
  selectAll: "تحديد كل الصفوف",
};

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function alignClass(align: TableAlign | undefined) {
  if (align === "center") return "text-center";
  if (align === "end") return "text-end";
  return "text-start";
}

function getCellValue<TData>(row: TData, rowIndex: number, column: DataTableColumn<TData>) {
  if (column.cell) return column.cell(row, rowIndex);
  if (typeof column.accessor === "function") return column.accessor(row);
  if (column.accessor) return row[column.accessor] as ReactNode;
  return null;
}

function DataTablePrimaryActions({
  actions,
  customAction,
  menuLabel,
}: {
  actions?: DataTableAction[];
  customAction?: ReactNode;
  menuLabel: string;
}) {
  if (customAction) return <>{customAction}</>;
  if (!actions?.length) return null;

  const [primary, ...secondary] = actions;
  const PrimaryIcon = primary.icon;
  const menuGroups: ContextMenuGroup[] = [
    {
      items: secondary.map((action) => ({
        id: action.id,
        label: action.label,
        icon: action.icon,
        disabled: action.disabled,
        variant: action.variant === "danger" ? "danger" : action.variant === "primary" ? "featured" : "default",
        onClick: action.onClick,
      })),
    },
  ];

  if (!secondary.length) {
    return (
      <Button
        size="sm"
        action={primary.action}
        variant={primary.variant}
        iconComponent={PrimaryIcon}
        disabled={primary.disabled}
        onClick={primary.onClick}
      >
        {primary.label}
      </Button>
    );
  }

  return (
    <div className="flex overflow-hidden rounded-lg border border-border">
      <Button
        size="sm"
        action={primary.action}
        variant={primary.variant}
        iconComponent={PrimaryIcon}
        disabled={primary.disabled}
        onClick={primary.onClick}
        className="rounded-none border-0"
      >
        {primary.label}
      </Button>
      <div className="w-px bg-border" />
      <ContextMenuTrigger groups={menuGroups} dir="rtl" triggerOn="click">
        <Button
          size="sm"
          variant={primary.variant}
          action={primary.action}
          iconOnly
          aria-label={menuLabel}
          className="rounded-none border-0 px-2"
          startIcon={<ChevronDown size={14} />}
        />
      </ContextMenuTrigger>
    </div>
  );
}

export function DataTable<TData>({
  title,
  subtitle,
  hideTitle = false,
  primaryAction,
  primaryActions,
  toolbar,
  filters,
  search,
  beforeTable,
  afterTable,
  footer,
  columns,
  rows,
  getRowId,
  rowActions,
  rowClassName,
  onRowClick,
  selection,
  loading = false,
  emptyState,
  labels,
  dir = "rtl",
  className,
  tableClassName,
  style,
}: DataTableProps<TData>) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const selectionText = { ...DEFAULT_SELECTION_LABELS, ...selection?.labels };
  const visibleColumns = columns.filter((column) => !column.hidden);
  const rowIds = rows.map(getRowId);
  const selectedSet = new Set(selection?.selectedIds ?? []);
  const allVisibleSelected = rowIds.length > 0 && rowIds.every((id) => selectedSet.has(id));
  const hasSelection = Boolean(selection && selection.selectedIds.length > 0);
  const hasPrimaryAction = Boolean(primaryAction || primaryActions?.length);
  const hasHeader =
    !hideTitle || hasPrimaryAction || toolbar || search || Boolean(selection?.bulkActions);
  const hasTools = search || toolbar || (hasSelection && selection?.bulkActions);
  const hasControlRow = hasPrimaryAction || hasTools;

  const setAllVisible = (checked: boolean) => {
    if (!selection) return;
    const rest = selection.selectedIds.filter((id) => !rowIds.includes(id));
    selection.onChange(checked ? [...rest, ...rowIds] : rest);
  };

  const setRowSelected = (rowId: string, checked: boolean) => {
    if (!selection) return;
    selection.onChange(
      checked
        ? Array.from(new Set([...selection.selectedIds, rowId]))
        : selection.selectedIds.filter((id) => id !== rowId)
    );
  };

  return (
    <section dir={dir} className={cx("qbs-surface overflow-hidden", className)} style={style}>
      {hasHeader ? (
        <header className="grid gap-3 border-b border-border bg-card px-4 py-3">
          {!hideTitle && (title || subtitle) ? (
            <div className="min-w-0 text-start">
              {title ? (
                <Text as="h3" variant="body-lg" className="truncate font-semibold text-foreground">
                  {title}
                </Text>
              ) : null}
              {subtitle ? (
                <Text as="p" variant="body-sm" tone="muted" className="mt-0.5">
                  {subtitle}
                </Text>
              ) : null}
            </div>
          ) : null}

          {hasControlRow ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex shrink-0 items-center">
                <DataTablePrimaryActions
                  customAction={primaryAction}
                  actions={primaryActions}
                  menuLabel={text.primaryMenu}
                />
              </div>

              {search ? (
                <div className="min-w-56 flex-1">
                  {search}
                </div>
              ) : null}

              {hasTools ? (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {toolbar}
                  {hasSelection ? selection?.bulkActions : null}
                  {hasSelection ? (
                    <>
                      <Text as="p" variant="body-sm" className="font-semibold text-primary">
                        {selectionText.selected(selection?.selectedIds.length ?? 0)}
                      </Text>
                      <Button size="xs" variant="ghost" onClick={() => selection?.onChange([])}>
                        {selectionText.clear}
                      </Button>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </header>
      ) : null}

      {filters ? <div className="border-b border-border bg-card">{filters}</div> : null}
      {beforeTable}

      <div className="overflow-x-auto dropdown-scroll">
        <table className={cx("w-full border-collapse text-sm", tableClassName)}>
          <thead className="bg-muted/45">
            <tr>
              {selection ? (
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={(event) => setAllVisible(event.target.checked)}
                    aria-label={selectionText.selectAll}
                    className="h-4 w-4 accent-primary"
                  />
                </th>
              ) : null}
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className={cx(
                    "border-b border-border px-3 py-3 text-xs font-semibold text-muted-foreground",
                    alignClass(column.align),
                    column.headerClassName
                  )}
                  style={{ width: column.width, minWidth: column.minWidth }}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="qbs-focus inline-flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-muted"
                      onClick={() => column.onSort?.(column)}
                    >
                      <span>{column.header}</span>
                      <span className="text-[10px] amount" aria-hidden="true">
                        {column.sortDirection === "asc" ? "▲" : column.sortDirection === "desc" ? "▼" : "↕"}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              {rowActions ? <th className="w-16 border-b border-border px-3 py-3" /> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {loading ? (
              <tr>
                <td colSpan={visibleColumns.length + (selection ? 1 : 0) + (rowActions ? 1 : 0)} className="px-4 py-10">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    {text.loading}
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (selection ? 1 : 0) + (rowActions ? 1 : 0)} className="px-4 py-12">
                  {emptyState ?? (
                    <div className="mx-auto max-w-sm text-center">
                      <Text as="p" variant="body-sm" className="font-semibold text-foreground">
                        {text.emptyTitle}
                      </Text>
                      <Text as="p" variant="caption" tone="muted" className="mt-1">
                        {text.emptyDescription}
                      </Text>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => {
                const rowId = getRowId(row, rowIndex);
                const resolvedRowClassName =
                  typeof rowClassName === "function" ? rowClassName(row, rowIndex) : rowClassName;

                return (
                  <tr
                    key={rowId}
                    onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                    className={cx(
                      "transition-colors hover:bg-muted/55",
                      onRowClick && "cursor-pointer",
                      selectedSet.has(rowId) && "bg-primary/5",
                      resolvedRowClassName
                    )}
                  >
                    {selection ? (
                      <td className="w-10 px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedSet.has(rowId)}
                          onChange={(event) => setRowSelected(rowId, event.target.checked)}
                          onClick={(event) => event.stopPropagation()}
                          aria-label={selectionText.selectRow(row)}
                          className="h-4 w-4 accent-primary"
                        />
                      </td>
                    ) : null}
                    {visibleColumns.map((column) => {
                      const resolvedCellClassName =
                        typeof column.cellClassName === "function"
                          ? column.cellClassName(row, rowIndex)
                          : column.cellClassName;

                      return (
                        <td
                          key={column.id}
                          className={cx("px-3 py-3 text-foreground", alignClass(column.align), resolvedCellClassName)}
                          style={{ width: column.width, minWidth: column.minWidth }}
                        >
                          {getCellValue(row, rowIndex, column)}
                        </td>
                      );
                    })}
                    {rowActions ? (
                      <td className="w-16 px-3 py-3 text-end" onClick={(event) => event.stopPropagation()}>
                        {rowActions(row, rowIndex)}
                      </td>
                    ) : null}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {afterTable}
      {footer ? <footer className="border-t border-border bg-card px-4 py-3">{footer}</footer> : null}
    </section>
  );
}
