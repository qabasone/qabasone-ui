import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Download,
  Columns3,
  SlidersHorizontal,
  Printer,
  Pencil,
  Eye,
  Trash2,
  ArrowUpDown,
  MoreHorizontal,
  MoreVertical,
  Copy,
  ExternalLink,
  Archive,
  Send,
  X,
} from "lucide-react";
import {
  Pagination as BasePagination,
  type PaginationLabels,
  type PaginationProps,
} from "@/ui/components/Pagination";
import {
  ContextMenuTrigger as BaseContextMenuTrigger,
  type ContextMenuGroup,
  type ContextMenuTriggerProps,
} from "@/ui/components/ContextMenu";
import { EntityLink } from "@/ui/components/EntityLink";
import { DataTable, TableFilterBar, type DataTableColumn, type TableFilterDefinition, type TableFilterValue } from "@/ui/components";
import { applyTableFilters, countOptions } from "@/ui/utils";

// ── Sample data (30 rows so pagination is meaningful) ─────────────────────────

const AR_PAGINATION_LABELS: PaginationLabels = {
  rangePrefix: "عرض",
  rangeFromOf: "من",
  rowsUnit: "صفوف",
  prevPageTitle: "الصفحة السابقة",
  nextPageTitle: "الصفحة التالية",
  firstPageTitle: "الصفحة الأولى",
  lastPageTitle: "الصفحة الأخيرة",
  prevShortTitle: "السابق",
  nextShortTitle: "التالي",
  firstShortTitle: "الأولى",
  lastShortTitle: "الأخيرة",
};

function Pagination(props: PaginationProps) {
  const { labels, dir, ...restProps } = props;
  return (
    <BasePagination
      {...restProps}
      dir={dir ?? "rtl"}
      labels={{ ...AR_PAGINATION_LABELS, ...labels }}
    />
  );
}

function ContextMenuTrigger(props: ContextMenuTriggerProps) {
  return <BaseContextMenuTrigger {...props} dir={props.dir ?? "rtl"} />;
}

const ALL_INVOICES = [
  {
    id: "INV-2024-0130",
    customer: "شركة النور للتجارة",
    product: "أرز غلا",
    qty: "5 طن",
    amount: "45,500.00",
    status: "paid",
    date: "21/01/2024",
  },
  {
    id: "INV-2024-0129",
    customer: "مصنع الأهرام",
    product: "قمح مطحون",
    qty: "12 طن",
    amount: "28,750.00",
    status: "pending",
    date: "20/01/2024",
  },
  {
    id: "INV-2024-0128",
    customer: "شركة المستقبل",
    product: "أرز أبيض",
    qty: "3 طن",
    amount: "12,300.00",
    status: "overdue",
    date: "19/01/2024",
  },
  {
    id: "INV-2024-0127",
    customer: "تجارة الخير",
    product: "أرز غلا",
    qty: "8 طن",
    amount: "67,200.00",
    status: "draft",
    date: "18/01/2024",
  },
  {
    id: "INV-2024-0126",
    customer: "مؤسسة النيل",
    product: "قمح",
    qty: "20 طن",
    amount: "48,000.00",
    status: "paid",
    date: "17/01/2024",
  },
  {
    id: "INV-2024-0125",
    customer: "شركة الأمل للتجارة",
    product: "سكر أبيض",
    qty: "10 طن",
    amount: "33,000.00",
    status: "paid",
    date: "16/01/2024",
  },
  {
    id: "INV-2024-0124",
    customer: "مصنع الفجر",
    product: "زيت طعام",
    qty: "500 لتر",
    amount: "15,500.00",
    status: "pending",
    date: "15/01/2024",
  },
  {
    id: "INV-2024-0123",
    customer: "شركة الخليج",
    product: "أرز غلا",
    qty: "15 طن",
    amount: "85,000.00",
    status: "paid",
    date: "14/01/2024",
  },
  {
    id: "INV-2024-0122",
    customer: "مؤسسة الرافدين",
    product: "قمح مطحون",
    qty: "7 طن",
    amount: "21,700.00",
    status: "overdue",
    date: "13/01/2024",
  },
  {
    id: "INV-2024-0121",
    customer: "شركة النصر",
    product: "سكر أبيض",
    qty: "5 طن",
    amount: "16,500.00",
    status: "paid",
    date: "12/01/2024",
  },
  {
    id: "INV-2024-0120",
    customer: "تجارة الوفاء",
    product: "أرز أبيض",
    qty: "6 طن",
    amount: "24,000.00",
    status: "draft",
    date: "11/01/2024",
  },
  {
    id: "INV-2024-0119",
    customer: "شركة الفتح",
    product: "زيت طعام",
    qty: "300 لتر",
    amount: "9,300.00",
    status: "paid",
    date: "10/01/2024",
  },
  {
    id: "INV-2024-0118",
    customer: "مصنع القمة",
    product: "قمح",
    qty: "25 طن",
    amount: "60,000.00",
    status: "pending",
    date: "09/01/2024",
  },
  {
    id: "INV-2024-0117",
    customer: "شركة الشرق",
    product: "أرز غلا",
    qty: "4 طن",
    amount: "36,400.00",
    status: "overdue",
    date: "08/01/2024",
  },
  {
    id: "INV-2024-0116",
    customer: "مؤسسة الغرب",
    product: "سكر أبيض",
    qty: "8 طن",
    amount: "26,400.00",
    status: "paid",
    date: "07/01/2024",
  },
  {
    id: "INV-2024-0115",
    customer: "تجارة الجنوب",
    product: "أرز أبيض",
    qty: "9 طن",
    amount: "36,000.00",
    status: "paid",
    date: "06/01/2024",
  },
  {
    id: "INV-2024-0114",
    customer: "شركة الشمال",
    product: "زيت طعام",
    qty: "200 لتر",
    amount: "6,200.00",
    status: "draft",
    date: "05/01/2024",
  },
  {
    id: "INV-2024-0113",
    customer: "مصنع الوسط",
    product: "قمح مطحون",
    qty: "11 طن",
    amount: "34,100.00",
    status: "paid",
    date: "04/01/2024",
  },
  {
    id: "INV-2024-0112",
    customer: "شركة الإخلاص",
    product: "أرز غلا",
    qty: "2 طن",
    amount: "18,200.00",
    status: "pending",
    date: "03/01/2024",
  },
  {
    id: "INV-2024-0111",
    customer: "مؤسسة الصدق",
    product: "سكر أبيض",
    qty: "6 طن",
    amount: "19,800.00",
    status: "overdue",
    date: "02/01/2024",
  },
  {
    id: "INV-2024-0110",
    customer: "تجارة الأمانة",
    product: "أرز أبيض",
    qty: "7 طن",
    amount: "28,000.00",
    status: "paid",
    date: "01/01/2024",
  },
  {
    id: "INV-2024-0109",
    customer: "شركة الثقة",
    product: "قمح",
    qty: "18 طن",
    amount: "43,200.00",
    status: "paid",
    date: "31/12/2023",
  },
  {
    id: "INV-2024-0108",
    customer: "مصنع البركة",
    product: "زيت طعام",
    qty: "400 لتر",
    amount: "12,400.00",
    status: "draft",
    date: "30/12/2023",
  },
  {
    id: "INV-2024-0107",
    customer: "شركة الهداية",
    product: "أرز غلا",
    qty: "13 طن",
    amount: "118,300.00",
    status: "paid",
    date: "29/12/2023",
  },
  {
    id: "INV-2024-0106",
    customer: "مؤسسة الرشاد",
    product: "قمح مطحون",
    qty: "9 طن",
    amount: "27,900.00",
    status: "pending",
    date: "28/12/2023",
  },
  {
    id: "INV-2024-0105",
    customer: "تجارة الحق",
    product: "سكر أبيض",
    qty: "4 طن",
    amount: "13,200.00",
    status: "paid",
    date: "27/12/2023",
  },
  {
    id: "INV-2024-0104",
    customer: "شركة النجاح",
    product: "أرز أبيض",
    qty: "11 طن",
    amount: "44,000.00",
    status: "overdue",
    date: "26/12/2023",
  },
  {
    id: "INV-2024-0103",
    customer: "مصنع الفلاح",
    product: "زيت طعام",
    qty: "600 لتر",
    amount: "18,600.00",
    status: "paid",
    date: "25/12/2023",
  },
  {
    id: "INV-2024-0102",
    customer: "شركة الكرم",
    product: "قمح",
    qty: "30 طن",
    amount: "72,000.00",
    status: "paid",
    date: "24/12/2023",
  },
  {
    id: "INV-2024-0101",
    customer: "مؤسسة الجود",
    product: "أرز غلا",
    qty: "1 طن",
    amount: "9,100.00",
    status: "draft",
    date: "23/12/2023",
  },
];

const statusMap: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  paid: { label: "مدفوعة", bg: "#dcfce7", text: "#15803d" },
  pending: {
    label: "في الانتظار",
    bg: "#fef3c7",
    text: "#92400e",
  },
  overdue: { label: "متأخرة", bg: "#fee2e2", text: "#991b1b" },
  draft: { label: "مسودة", bg: "#f1f5f9", text: "#475569" },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
      style={{
        backgroundColor: s.bg,
        color: s.text,
        fontWeight: 500,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: s.text }}
      />
      {s.label}
    </span>
  );
}

// ── Reusable table body ────────────────────────────────────────────────────────

const COLS = [
  { key: "id", label: "رقم الفاتورة" },
  { key: "customer", label: "العميل" },
  { key: "product", label: "المنتج" },
  { key: "qty", label: "الكمية" },
  { key: "amount", label: "الإجمالي" },
  { key: "date", label: "التاريخ" },
  { key: "status", label: "الحالة" },
] as const;

type InvoiceColumnKey = (typeof COLS)[number]["key"];
type InvoiceColumn = (typeof COLS)[number];

function TableHead({
  sortCol,
  sortDir,
  onSort,
  selected,
  allIds,
  onToggleAll,
  columns,
}: {
  sortCol: string;
  sortDir: "asc" | "desc";
  onSort: (key: string) => void;
  selected: string[];
  allIds: string[];
  onToggleAll: () => void;
  columns: readonly InvoiceColumn[];
}) {
  const allSelected =
    allIds.length > 0 && selected.length === allIds.length;
  return (
    <thead className="bg-muted/40 border-b border-border">
      <tr>
        <th className="p-3 text-start w-10">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleAll}
            aria-label="تحديد كل الصفوف في الصفحة"
            className="h-4 w-4 rounded border-border accent-primary"
          />
        </th>
        {columns.map((col) => (
          <th
            key={col.key}
            className="p-3 text-start text-xs text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground transition-colors"
            style={{ fontWeight: 600 }}
            onClick={() => onSort(col.key)}
          >
            <span className="flex items-center gap-1">
              {col.label}
              {sortCol === col.key ? (
                sortDir === "asc" ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )
              ) : (
                <ArrowUpDown size={11} className="opacity-30" />
              )}
            </span>
          </th>
        ))}
        <th
          className="p-3 text-start text-xs text-muted-foreground w-24"
          style={{ fontWeight: 600 }}
        >
          إجراءات
        </th>
      </tr>
    </thead>
  );
}

function invoiceMenuGroups(
  inv: (typeof ALL_INVOICES)[0],
): ContextMenuGroup[] {
  return [
    {
      items: [
        {
          id: "view",
          label: "عرض التفاصيل",
          icon: Eye,
          onClick: () => { },
        },
        {
          id: "edit",
          label: "تعديل الفاتورة",
          icon: Pencil,
          shortcut: "E",
          onClick: () => { },
        },
        {
          id: "copy",
          label: "نسخ رقم الفاتورة",
          icon: Copy,
          shortcut: "Ctrl+C",
          onClick: () => { },
        },
      ],
    },
    {
      items: [
        {
          id: "send",
          label: "إرسال للعميل",
          icon: Send,
          onClick: () => { },
        },
        {
          id: "duplicate",
          label: "تكرار الفاتورة",
          icon: ExternalLink,
          variant: "featured",
          onClick: () => { },
        },
        {
          id: "archive",
          label: "أرشفة",
          icon: Archive,
          onClick: () => { },
        },
      ],
    },
    {
      items: [
        {
          id: "delete",
          label: "حذف الفاتورة",
          icon: Trash2,
          variant: "danger",
          shortcut: "Del",
          onClick: () => { },
        },
      ],
    },
  ];
}

function TableRows({
  rows,
  selected,
  onToggle,
  columns,
}: {
  rows: typeof ALL_INVOICES;
  selected: string[];
  onToggle: (id: string) => void;
  columns: readonly InvoiceColumn[];
}) {
  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={columns.length + 2}
            className="p-12 text-center text-muted-foreground text-sm"
          >
            لا توجد نتائج مطابقة للبحث
          </td>
        </tr>
      </tbody>
    );
  }
  return (
    <tbody>
      {rows.map((inv) => (
        <tr
          key={inv.id}
          className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${selected.includes(inv.id) ? "bg-primary/5" : ""}`}
        >
          <td className="p-3">
            <input
              type="checkbox"
              checked={selected.includes(inv.id)}
              onChange={() => onToggle(inv.id)}
              aria-label={`تحديد ${inv.id}`}
              className="h-4 w-4 rounded border-border accent-primary"
            />
          </td>
          {columns.map((col) => {
            if (col.key === "id") {
              return (
                <td key={col.key} className="p-3">
                  <EntityLink variant="id" label={inv.id} onClick={() => { }} />
                </td>
              );
            }
            if (col.key === "customer") {
              return (
                <td key={col.key} className="p-3">
                  <EntityLink label={inv.customer} onClick={() => { }} />
                </td>
              );
            }
            if (col.key === "product") {
              return (
                <td key={col.key} className="p-3">
                  <EntityLink variant="badge" label={inv.product} onClick={() => { }} />
                </td>
              );
            }
            if (col.key === "qty") {
              return (
                <td key={col.key} className="p-3 text-sm text-muted-foreground amount">
                  {inv.qty}
                </td>
              );
            }
            if (col.key === "amount") {
              return (
                <td key={col.key} className="p-3 text-sm text-foreground amount" style={{ fontWeight: 600 }}>
                  {inv.amount} ج.م
                </td>
              );
            }
            if (col.key === "date") {
              return (
                <td key={col.key} className="p-3 text-sm text-muted-foreground amount">
                  {inv.date}
                </td>
              );
            }
            return (
              <td key={col.key} className="p-3">
                <StatusBadge status={inv.status} />
              </td>
            );
          })}
          <td className="p-3">
            <ContextMenuTrigger groups={invoiceMenuGroups(inv)}>
              <button className="w-7 h-7 rounded-md flex flex-end items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <MoreVertical size={15} />
              </button>
            </ContextMenuTrigger>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────

export function TablesSection() {
  // ── Table 1: pagination at bottom ──────────────────────────────────────────
  const [search1, setSearch1] = useState("");
  const [statusFilter1, setStatusFilter1] = useState("all");
  const [productFilters1, setProductFilters1] = useState<string[]>([]);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<InvoiceColumnKey[]>(
    () => COLS.map((col) => col.key)
  );
  const [selected1, setSelected1] = useState<string[]>([]);
  const [sortCol1, setSortCol1] = useState("date");
  const [sortDir1, setSortDir1] = useState<"asc" | "desc">(
    "desc",
  );
  const [page1, setPage1] = useState(1);
  const [pageSize1, setPageSize1] = useState(5);

  const statusCounts = countOptions(ALL_INVOICES, (invoice) => invoice.status);
  const productCounts = countOptions(ALL_INVOICES, (invoice) => invoice.product);
  const filtered1 = applyTableFilters(
    ALL_INVOICES,
    {
      search: search1,
      equals: { status: statusFilter1 },
      includes: { product: productFilters1 },
    },
    {
      searchAccessors: [
        (invoice) => invoice.id,
        (invoice) => invoice.customer,
        (invoice) => invoice.product,
      ],
      equalsAccessors: {
        status: (invoice) => invoice.status,
      },
      includesAccessors: {
        product: (invoice) => invoice.product,
      },
    }
  );
  const paged1 = filtered1.slice(
    (page1 - 1) * pageSize1,
    page1 * pageSize1,
  );
  const visibleColumns = COLS.filter((col) => visibleColumnKeys.includes(col.key));

  const toggleSort1 = (key: string) => {
    if (sortCol1 === key)
      setSortDir1((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol1(key);
      setSortDir1("asc");
    }
  };

  const dataTableColumns: DataTableColumn<(typeof ALL_INVOICES)[number]>[] = visibleColumns.map((col) => ({
    id: col.key,
    header: col.label,
    sortable: true,
    sortDirection: sortCol1 === col.key ? sortDir1 : null,
    onSort: () => toggleSort1(col.key),
    cell: (inv) => {
      if (col.key === "id") return <EntityLink variant="id" label={inv.id} onClick={() => { }} />;
      if (col.key === "customer") return <EntityLink label={inv.customer} onClick={() => { }} />;
      if (col.key === "product") return <EntityLink variant="badge" label={inv.product} onClick={() => { }} />;
      if (col.key === "qty") return <span className="amount text-muted-foreground">{inv.qty}</span>;
      if (col.key === "amount") return <span className="amount font-semibold text-foreground">{inv.amount} ج.م</span>;
      if (col.key === "status") return <StatusBadge status={inv.status as keyof typeof statusMap} />;
      return <span className="text-muted-foreground">{inv[col.key]}</span>;
    },
  }));

  const filters1: TableFilterDefinition[] = [
    {
      id: "search",
      type: "search",
      label: "بحث",
      placeholder: "رقم الفاتورة، العميل، أو المنتج...",
      value: search1,
      minWidth: 300,
    },
    {
      id: "status",
      type: "select",
      label: "الحالة",
      value: statusFilter1,
      allLabel: "كل الحالات",
      options: Object.entries(statusMap).map(([value, item]) => ({
        value,
        label: item.label,
        count: statusCounts[value] ?? 0,
      })),
    },
    {
      id: "product",
      type: "multi-select",
      label: "المنتج",
      value: productFilters1,
      minWidth: 320,
      options: Object.entries(productCounts).map(([value, count]) => ({
        value,
        label: value,
        count,
      })),
    },
  ];

  const updateFilter1 = (filterId: string, value: TableFilterValue) => {
    if (filterId === "search") setSearch1(String(value));
    if (filterId === "status") setStatusFilter1(String(value || "all"));
    if (filterId === "product") setProductFilters1(Array.isArray(value) ? value : []);
    setPage1(1);
    setSelected1([]);
  };

  const clearFilters1 = () => {
    setSearch1("");
    setStatusFilter1("all");
    setProductFilters1([]);
    setPage1(1);
    setSelected1([]);
  };

  const toggleColumn = (key: InvoiceColumnKey) => {
    setVisibleColumnKeys((current) => {
      if (current.includes(key)) {
        return current.length === 1 ? current : current.filter((item) => item !== key);
      }
      return [...current, key];
    });
  };

  const selectedBulkGroups: ContextMenuGroup[] = [
    {
      label: `${selected1.length} صف محدد`,
      items: [
        { id: "export-selected", label: "تصدير المحدد", icon: Download, onClick: () => { } },
        { id: "print-selected", label: "طباعة المحدد", icon: Printer, onClick: () => { } },
        { id: "archive-selected", label: "أرشفة المحدد", icon: Archive, onClick: () => { } },
      ],
    },
    {
      items: [
        { id: "clear-selection", label: "إلغاء التحديد", icon: X, onClick: () => setSelected1([]) },
      ],
    },
  ];

  // ── Table 2: pagination at top ──────────────────────────────────────────────
  const [page2, setPage2] = useState(1);
  const [pageSize2, setPageSize2] = useState(5);
  const paged2 = ALL_INVOICES.slice(
    (page2 - 1) * pageSize2,
    page2 * pageSize2,
  );

  // ── Table 3: pagination at top + bottom ────────────────────────────────────
  const [page3, setPage3] = useState(1);
  const PAGE_SIZE_3 = 6;
  const paged3 = ALL_INVOICES.slice(
    (page3 - 1) * PAGE_SIZE_3,
    page3 * PAGE_SIZE_3,
  );

  return (
    <div className="space-y-10">
      <DataTable
        title="جدول الفواتير القابل لإعادة الاستخدام"
        subtitle="هيكل واحد يجمع العنوان، الفلاتر، البحث، التحكم في الأعمدة، الزر الأساسي، تحديد الصفوف، وتذييل الجدول."
        rows={paged1}
        columns={dataTableColumns}
        getRowId={(invoice) => invoice.id}
        primaryActions={[
          { id: "create", label: "إضافة فاتورة", action: "create", onClick: () => { } },
          { id: "export", label: "تصدير الفواتير", icon: Download, action: "export", onClick: () => { } },
          { id: "archive", label: "أرشفة المحدد", icon: Archive, variant: "secondary", onClick: () => { } },
        ]}
        search={(
          <label className="qbs-focus qbs-field flex h-8 w-full items-center gap-2 px-2.5">
            <span className="sr-only">بحث</span>
            <Search size={15} className="text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={search1}
              onChange={(event) => updateFilter1("search", event.target.value)}
              placeholder="بحث في الفواتير..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
        )}
        toolbar={(
          <div className="flex items-center gap-2">
          <details className="relative">
            <summary className="qbs-focus inline-flex h-8 cursor-pointer list-none items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted marker:hidden">
              <Columns3 size={14} />
              الأعمدة
            </summary>
            <div className="qbs-panel absolute end-0 top-full z-50 mt-1.5 w-56 p-2">
              <fieldset className="space-y-1">
                <legend className="px-2 py-1 text-xs font-semibold text-muted-foreground">إظهار الأعمدة</legend>
                {COLS.map((col) => {
                  const checked = visibleColumnKeys.includes(col.key);
                  return (
                    <label key={col.key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={checked && visibleColumnKeys.length === 1}
                        onChange={() => toggleColumn(col.key)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="flex-1 text-foreground">{col.label}</span>
                    </label>
                  );
                })}
              </fieldset>
            </div>
          </details>
          <details className="relative">
            <summary className="qbs-focus inline-flex h-8 cursor-pointer list-none items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted marker:hidden">
              <SlidersHorizontal size={14} />
              الفلاتر
            </summary>
            <div className="qbs-panel absolute end-0 top-full z-50 mt-1.5 w-72 p-3">
              <fieldset className="space-y-2">
                <legend className="text-xs font-semibold text-muted-foreground">الحالة</legend>
                <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                  <input
                    type="radio"
                    name="reusable-invoice-status-filter"
                    checked={statusFilter1 === "all"}
                    onChange={() => updateFilter1("status", "all")}
                    className="h-4 w-4 accent-primary"
                  />
                  كل الحالات
                </label>
                {Object.entries(statusMap).map(([value, item]) => (
                  <label key={value} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                    <input
                      type="radio"
                      name="reusable-invoice-status-filter"
                      checked={statusFilter1 === value}
                      onChange={() => updateFilter1("status", value)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="flex-1">{item.label}</span>
                    <span className="amount text-xs text-muted-foreground">{statusCounts[value] ?? 0}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset className="mt-3 space-y-2 border-t border-border pt-3">
                <legend className="text-xs font-semibold text-muted-foreground">المنتج</legend>
                {Object.entries(productCounts).map(([value, count]) => {
                  const checked = productFilters1.includes(value);
                  return (
                    <label key={value} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          const next = event.target.checked
                            ? [...productFilters1, value]
                            : productFilters1.filter((item) => item !== value);
                          updateFilter1("product", next);
                        }}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="flex-1">{value}</span>
                      <span className="amount text-xs text-muted-foreground">{count}</span>
                    </label>
                  );
                })}
              </fieldset>

              <div className="mt-3 border-t border-border pt-3">
                <button
                  type="button"
                  className="qbs-focus h-8 rounded-md px-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={clearFilters1}
                >
                  مسح الفلاتر
                </button>
              </div>
            </div>
          </details>
          </div>
        )}
        selection={{
          selectedIds: selected1,
          onChange: setSelected1,
          labels: {
            selected: (count) => `${count} صف محدد`,
            clear: "إلغاء التحديد",
            selectAll: "تحديد كل الصفوف في الصفحة",
            selectRow: (invoice) => `تحديد ${invoice.id}`,
          },
          bulkActions: (
            <ContextMenuTrigger groups={selectedBulkGroups}>
              <button className="qbs-focus inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
                <MoreHorizontal size={14} />
                إجراءات المحدد
              </button>
            </ContextMenuTrigger>
          ),
        }}
        rowActions={(inv) => (
          <ContextMenuTrigger groups={invoiceMenuGroups(inv)}>
            <button
              className="qbs-focus flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
              aria-label={`إجراءات ${inv.id}`}
            >
              <MoreVertical size={16} />
            </button>
          </ContextMenuTrigger>
        )}
        footer={(
          <Pagination
            total={filtered1.length}
            page={page1}
            pageSize={pageSize1}
            onPageChange={setPage1}
            onPageSizeChange={(size) => {
              setPageSize1(size);
              setPage1(1);
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            variant="full"
          />
        )}
      />

      <section className="qbs-surface overflow-hidden">
        <div className="border-b border-border px-5 py-3">
          <p className="text-sm font-semibold text-foreground">استخدام DataTable</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            المطور يركب العنوان، الفلاتر، البحث، الزر الأساسي، الصفوف، والتذييل من props مستقلة.
          </p>
        </div>
        <pre className="overflow-x-auto bg-muted/20 p-5 text-xs leading-relaxed text-foreground" dir="ltr">{`<DataTable
  title="الفواتير"
  subtitle="إدارة فواتير البيع"
  rows={rows}
  columns={columns}
  getRowId={(row) => row.id}
  primaryActions={[
    { id: "create", label: "إضافة فاتورة", action: "create", onClick: openCreate },
    { id: "export", label: "تصدير", action: "export", onClick: exportRows },
  ]}
  search={<InvoiceSearch value={query} onChange={setQuery} />}
  filters={<TableFilterBar filters={filters} ... />}
  toolbar={<ColumnsButton columns={columns} onChange={setColumns} />}
  selection={{ selectedIds, onChange: setSelectedIds, bulkActions }}
  rowActions={(row) => <RowActions row={row} />}
  footer={<Pagination total={total} page={page} pageSize={pageSize} />}/>`}</pre>
      </section>

      <div>
        <h1 className="text-foreground mb-1">الجداول</h1>
        <p className="text-muted-foreground">
          جداول بيانات مع ترقيم صفحات مرن — أسفل / أعلى / كلاهما
        </p>
      </div>

      {/* ── Table 1: pagination bottom (full variant) ────────────────────────── */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <p
            className="text-sm text-foreground"
            style={{ fontWeight: 600 }}
          >
            ترقيم الصفحات — أسفل الجدول
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            النمط الكامل مع اختيار حجم الصفحة
          </p>
        </div>

        <TableFilterBar
          filters={filters1.filter((filter) => filter.type === "search")}
          totalCount={ALL_INVOICES.length}
          filteredCount={filtered1.length}
          onFilterChange={updateFilter1}
          onClearFilters={clearFilters1}
          labels={{
            title: "",
            results: (filteredCount, totalCount) => `عرض ${filteredCount} من ${totalCount} فاتورة`,
          }}
          actions={(
            <div className="flex items-center gap-2">
              <details className="relative">
                <summary className="qbs-focus inline-flex h-8 cursor-pointer list-none items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted marker:hidden">
                  <Columns3 size={14} />
                  الأعمدة
                </summary>
                <div className="qbs-panel absolute end-0 top-full z-50 mt-1.5 w-56 p-2">
                  <fieldset className="space-y-1">
                    <legend className="px-2 py-1 text-xs font-semibold text-muted-foreground">إظهار الأعمدة</legend>
                    {COLS.map((col) => {
                      const checked = visibleColumnKeys.includes(col.key);
                      return (
                        <label key={col.key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={checked && visibleColumnKeys.length === 1}
                            onChange={() => toggleColumn(col.key)}
                            className="h-4 w-4 accent-primary"
                          />
                          <span className="flex-1 text-foreground">{col.label}</span>
                        </label>
                      );
                    })}
                  </fieldset>
                </div>
              </details>

              <details className="relative">
                <summary className="qbs-focus inline-flex h-8 cursor-pointer list-none items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted marker:hidden">
                  <SlidersHorizontal size={14} />
                  الفلاتر
                </summary>
                <div className="qbs-panel absolute end-0 top-full z-50 mt-1.5 w-72 p-3">
                  <fieldset className="space-y-2">
                    <legend className="text-xs font-semibold text-muted-foreground">الحالة</legend>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                      <input
                        type="radio"
                        name="invoice-status-filter"
                        checked={statusFilter1 === "all"}
                        onChange={() => updateFilter1("status", "all")}
                        className="h-4 w-4 accent-primary"
                      />
                      كل الحالات
                    </label>
                    {Object.entries(statusMap).map(([value, item]) => (
                      <label key={value} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                        <input
                          type="radio"
                          name="invoice-status-filter"
                          checked={statusFilter1 === value}
                          onChange={() => updateFilter1("status", value)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span className="flex-1">{item.label}</span>
                        <span className="amount text-xs text-muted-foreground">{statusCounts[value] ?? 0}</span>
                      </label>
                    ))}
                  </fieldset>

                  <fieldset className="mt-3 space-y-2 border-t border-border pt-3">
                    <legend className="text-xs font-semibold text-muted-foreground">المنتج</legend>
                    {Object.entries(productCounts).map(([value, count]) => {
                      const checked = productFilters1.includes(value);
                      return (
                        <label key={value} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(event) => {
                              const next = event.target.checked
                                ? [...productFilters1, value]
                                : productFilters1.filter((item) => item !== value);
                              updateFilter1("product", next);
                            }}
                            className="h-4 w-4 accent-primary"
                          />
                          <span className="flex-1">{value}</span>
                          <span className="amount text-xs text-muted-foreground">{count}</span>
                        </label>
                      );
                    })}
                  </fieldset>

                  <div className="mt-3 border-t border-border pt-3">
                    <button
                      type="button"
                      className="qbs-focus h-8 rounded-md px-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={clearFilters1}
                    >
                      مسح الفلاتر
                    </button>
                  </div>
                </div>
              </details>

              <button
                type="button"
                className="qbs-focus inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Download size={15} />
                تصدير
              </button>
            </div>
          )}
        />

        {selected1.length > 0 ? (
          <div className="flex flex-wrap items-center gap-3 border-b border-border bg-primary/5 px-4 py-3">
            <span className="text-sm font-semibold text-foreground">
              {selected1.length} صف محدد
            </span>
            <span className="text-xs text-muted-foreground">
              اختر إجراء مناسب للصفوف المحددة
            </span>
            <div className="ms-auto">
              <ContextMenuTrigger groups={selectedBulkGroups}>
                <button className="qbs-focus inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
                  <MoreHorizontal size={14} />
                  إجراءات المحدد
                </button>
              </ContextMenuTrigger>
            </div>
          </div>
        ) : null}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHead
              sortCol={sortCol1}
              sortDir={sortDir1}
              onSort={toggleSort1}
              selected={selected1}
              allIds={paged1.map((i) => i.id)}
              columns={visibleColumns}
              onToggleAll={() =>
                setSelected1(
                  selected1.length === paged1.length
                    ? []
                    : paged1.map((i) => i.id),
                )
              }
            />
            <TableRows
              rows={paged1}
              selected={selected1}
              columns={visibleColumns}
              onToggle={(id) =>
                setSelected1((prev) =>
                  prev.includes(id)
                    ? prev.filter((x) => x !== id)
                    : [...prev, id],
                )
              }
            />
          </table>
        </div>

        {/* Pagination — bottom */}
        <div className="px-4 py-3 border-t border-border">
          <Pagination
            total={filtered1.length}
            page={page1}
            pageSize={pageSize1}
            onPageChange={setPage1}
            onPageSizeChange={(size) => {
              setPageSize1(size);
              setPage1(1);
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            variant="full"
          />
        </div>
      </section>

      {/* ── Table 2: pagination top (compact variant) ───────────────────────── */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <p
            className="text-sm text-foreground"
            style={{ fontWeight: 600 }}
          >
            ترقيم الصفحات — أعلى الجدول
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            النمط المضغوط — مناسب لأعلى الجدول
          </p>
        </div>

        {/* Pagination — top */}
        <div className="px-4 py-3 border-b border-border bg-muted/20">
          <Pagination
            total={ALL_INVOICES.length}
            page={page2}
            pageSize={pageSize2}
            onPageChange={setPage2}
            onPageSizeChange={(size) => {
              setPageSize2(size);
              setPage2(1);
            }}
            pageSizeOptions={[5, 10, 25]}
            variant="compact"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHead
              sortCol="date"
              sortDir="desc"
              onSort={() => { }}
              selected={[]}
              allIds={paged2.map((i) => i.id)}
              columns={COLS}
              onToggleAll={() => { }}
            />
            <TableRows
              rows={paged2}
              selected={[]}
              columns={COLS}
              onToggle={() => { }}
            />
          </table>
        </div>
      </section>

      {/* ── Table 3: pagination top + bottom (minimal top, full bottom) ─────── */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <p
            className="text-sm text-foreground"
            style={{ fontWeight: 600 }}
          >
            ترقيم الصفحات — أعلى وأسفل الجدول
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            النمط البسيط في الأعلى + الكامل في الأسفل
          </p>
        </div>

        {/* Pagination — top minimal */}
        <div className="px-4 py-2.5 border-b border-border">
          <Pagination
            total={ALL_INVOICES.length}
            page={page3}
            pageSize={PAGE_SIZE_3}
            onPageChange={setPage3}
            variant="minimal"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHead
              sortCol="date"
              sortDir="desc"
              onSort={() => { }}
              selected={[]}
              allIds={paged3.map((i) => i.id)}
              columns={COLS}
              onToggleAll={() => { }}
            />
            <TableRows
              rows={paged3}
              selected={[]}
              columns={COLS}
              onToggle={() => { }}
            />
          </table>
        </div>

        {/* Pagination — bottom full */}
        <div className="px-4 py-3 border-t border-border">
          <Pagination
            total={ALL_INVOICES.length}
            page={page3}
            pageSize={PAGE_SIZE_3}
            onPageChange={setPage3}
            variant="full"
          />
        </div>
      </section>

      {/* ── Context menu showcase ───────────────────────────────────────────── */}
      <div>
        <h2 className="text-foreground mb-1">قائمة السياق</h2>
        <p className="text-muted-foreground text-sm">
          مكوّن قابل لإعادة الاستخدام — اضغط على أي زر •••
          لمعاينة الحالة
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Variant 1: Invoice actions (full groups + danger) */}
        <section className="bg-card rounded-2xl border border-border p-5">
          <p
            className="text-xs text-muted-foreground mb-3"
            style={{ fontWeight: 600 }}
          >
            فاتورة — إجراءات كاملة
          </p>
          <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3">
            <span
              className="text-sm text-foreground"
              style={{ fontWeight: 500 }}
            >
              INV-2024-0130
            </span>
            <ContextMenuTrigger
              groups={[
                {
                  items: [
                    {
                      id: "view",
                      label: "عرض التفاصيل",
                      icon: Eye,
                      onClick: () => { },
                    },
                    {
                      id: "edit",
                      label: "تعديل الفاتورة",
                      icon: Pencil,
                      shortcut: "E",
                      onClick: () => { },
                    },
                    {
                      id: "copy",
                      label: "نسخ الرابط",
                      icon: Copy,
                      shortcut: "Ctrl+C",
                      onClick: () => { },
                    },
                  ],
                },
                {
                  items: [
                    {
                      id: "send",
                      label: "إرسال للعميل",
                      icon: Send,
                      onClick: () => { },
                    },
                    {
                      id: "dup",
                      label: "تكرار",
                      icon: ExternalLink,
                      variant: "featured",
                      onClick: () => { },
                    },
                    {
                      id: "archive",
                      label: "أرشفة",
                      icon: Archive,
                      onClick: () => { },
                    },
                  ],
                },
                {
                  items: [
                    {
                      id: "delete",
                      label: "حذف الفاتورة",
                      icon: Trash2,
                      variant: "danger",
                      shortcut: "Del",
                      onClick: () => { },
                    },
                  ],
                },
              ]}
            >
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <MoreHorizontal size={15} />
              </button>
            </ContextMenuTrigger>
          </div>
        </section>

        {/* Variant 2: Customer quick actions */}
        <section className="bg-card rounded-2xl border border-border p-5">
          <p
            className="text-xs text-muted-foreground mb-3"
            style={{ fontWeight: 600 }}
          >
            عميل — إجراءات سريعة
          </p>
          <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3">
            <span
              className="text-sm text-foreground"
              style={{ fontWeight: 500 }}
            >
              شركة النور للتجارة
            </span>
            <ContextMenuTrigger
              groups={[
                {
                  items: [
                    {
                      id: "view",
                      label: "ملف العميل",
                      icon: Eye,
                      onClick: () => { },
                    },
                    {
                      id: "edit",
                      label: "تعديل البيانات",
                      icon: Pencil,
                      onClick: () => { },
                    },
                    {
                      id: "invoices",
                      label: "فواتير العميل",
                      icon: ExternalLink,
                      onClick: () => { },
                    },
                  ],
                },
                {
                  items: [
                    {
                      id: "suspend",
                      label: "تعليق الحساب",
                      icon: Archive,
                      disabled: false,
                      onClick: () => { },
                    },
                    {
                      id: "delete",
                      label: "حذف العميل",
                      icon: Trash2,
                      variant: "danger",
                      onClick: () => { },
                    },
                  ],
                },
              ]}
            >
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <MoreHorizontal size={15} />
              </button>
            </ContextMenuTrigger>
          </div>
        </section>

        {/* Variant 3: with group labels + disabled item */}
        <section className="bg-card rounded-2xl border border-border p-5">
          <p
            className="text-xs text-muted-foreground mb-3"
            style={{ fontWeight: 600 }}
          >
            صنف — مع عناوين مجموعات
          </p>
          <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3">
            <span
              className="text-sm text-foreground"
              style={{ fontWeight: 500 }}
            >
              أرز غلا — كيلو
            </span>
            <ContextMenuTrigger
              groups={[
                {
                  label: "إجراءات",
                  items: [
                    {
                      id: "view",
                      label: "عرض الصنف",
                      icon: Eye,
                      onClick: () => { },
                    },
                    {
                      id: "edit",
                      label: "تعديل السعر",
                      icon: Pencil,
                      shortcut: "E",
                      onClick: () => { },
                    },
                    {
                      id: "stock",
                      label: "حركة المخزون",
                      icon: ExternalLink,
                      onClick: () => { },
                    },
                  ],
                },
                {
                  label: "تصدير",
                  items: [
                    {
                      id: "export",
                      label: "تصدير Excel",
                      icon: Download,
                      shortcut: "Ctrl+E",
                      onClick: () => { },
                    },
                    {
                      id: "print",
                      label: "طباعة بطاقة الصنف",
                      icon: Printer,
                      onClick: () => { },
                    },
                    {
                      id: "archive",
                      label: "أرشفة (متوقف)",
                      icon: Archive,
                      disabled: true,
                      onClick: () => { },
                    },
                  ],
                },
                {
                  items: [
                    {
                      id: "delete",
                      label: "حذف الصنف",
                      icon: Trash2,
                      variant: "danger",
                      onClick: () => { },
                    },
                  ],
                },
              ]}
            >
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <MoreHorizontal size={15} />
              </button>
            </ContextMenuTrigger>
          </div>
        </section>

        {/* Variant 4: shortcuts-only + featured item */}
        <section className="bg-card rounded-2xl border border-border p-5">
          <p
            className="text-xs text-muted-foreground mb-3"
            style={{ fontWeight: 600 }}
          >
            قيد محاسبي — مع اختصارات لوحة مفاتيح
          </p>
          <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3">
            <span
              className="text-sm text-foreground"
              style={{ fontWeight: 500 }}
            >
              JRN-2024-0044
            </span>
            <ContextMenuTrigger
              groups={[
                {
                  items: [
                    {
                      id: "view",
                      label: "عرض القيد",
                      icon: Eye,
                      shortcut: "V",
                      onClick: () => { },
                    },
                    {
                      id: "approve",
                      label: "اعتماد القيد",
                      icon: Send,
                      shortcut: "A",
                      variant: "featured",
                      onClick: () => { },
                    },
                    {
                      id: "copy",
                      label: "نسخ القيد",
                      icon: Copy,
                      shortcut: "Ctrl+D",
                      onClick: () => { },
                    },
                    {
                      id: "print",
                      label: "طباعة",
                      icon: Printer,
                      shortcut: "Ctrl+P",
                      onClick: () => { },
                    },
                  ],
                },
                {
                  items: [
                    {
                      id: "delete",
                      label: "حذف القيد",
                      icon: Trash2,
                      shortcut: "Del",
                      variant: "danger",
                      onClick: () => { },
                    },
                  ],
                },
              ]}
            >
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <MoreHorizontal size={15} />
              </button>
            </ContextMenuTrigger>
          </div>
        </section>

        {/* Variant 5: minimal — no icons, no shortcuts */}
        <section className="bg-card rounded-2xl border border-border p-5">
          <p
            className="text-xs text-muted-foreground mb-3"
            style={{ fontWeight: 600 }}
          >
            بسيط — بدون أيقونات أو اختصارات
          </p>
          <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3">
            <span
              className="text-sm text-foreground"
              style={{ fontWeight: 500 }}
            >
              تقرير المبيعات
            </span>
            <ContextMenuTrigger
              groups={[
                {
                  items: [
                    {
                      id: "open",
                      label: "فتح التقرير",
                      onClick: () => { },
                    },
                    {
                      id: "share",
                      label: "مشاركة",
                      onClick: () => { },
                    },
                    {
                      id: "rename",
                      label: "إعادة التسمية",
                      onClick: () => { },
                    },
                  ],
                },
                {
                  items: [
                    {
                      id: "delete",
                      label: "حذف التقرير",
                      variant: "danger",
                      onClick: () => { },
                    },
                  ],
                },
              ]}
            >
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <MoreHorizontal size={15} />
              </button>
            </ContextMenuTrigger>
          </div>
        </section>

        {/* Variant 6: many groups (status change) */}
        <section className="bg-card rounded-2xl border border-border p-5">
          <p
            className="text-xs text-muted-foreground mb-3"
            style={{ fontWeight: 600 }}
          >
            طلب شراء — تغيير الحالة
          </p>
          <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3">
            <span
              className="text-sm text-foreground"
              style={{ fontWeight: 500 }}
            >
              PO-2024-0017
            </span>
            <ContextMenuTrigger
              groups={[
                {
                  items: [
                    {
                      id: "view",
                      label: "عرض الطلب",
                      icon: Eye,
                      onClick: () => { },
                    },
                    {
                      id: "edit",
                      label: "تعديل",
                      icon: Pencil,
                      onClick: () => { },
                    },
                  ],
                },
                {
                  label: "تغيير الحالة",
                  items: [
                    {
                      id: "approve",
                      label: "اعتماد الطلب",
                      icon: Send,
                      variant: "featured",
                      onClick: () => { },
                    },
                    {
                      id: "send_sup",
                      label: "إرسال للمورد",
                      icon: ExternalLink,
                      onClick: () => { },
                    },
                    {
                      id: "receive",
                      label: "تسجيل الاستلام",
                      icon: Archive,
                      onClick: () => { },
                    },
                  ],
                },
                {
                  items: [
                    {
                      id: "cancel",
                      label: "إلغاء الطلب",
                      icon: Archive,
                      variant: "danger",
                      onClick: () => { },
                    },
                  ],
                },
              ]}
            >
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <MoreHorizontal size={15} />
              </button>
            </ContextMenuTrigger>
          </div>
        </section>
      </div>

      {/* ── EntityLink showcase ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-foreground mb-1">روابط الكيانات</h2>
        <p className="text-muted-foreground text-sm">مكوّن قابل لإعادة الاستخدام — مرّر المؤشر فوق أي قيمة لترى أثر التنقل</p>
      </div>

      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Live preview table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                {["النوع", "مثال حي", "السلوك", "الاستخدام المقترح"].map(h => (
                  <th key={h} className="p-4 text-right text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground" style={{ fontWeight: 500 }}>default</span>
                </td>
                <td className="p-4">
                  <EntityLink label="شركة النور للتجارة" onClick={() => { }} />
                </td>
                <td className="p-4 text-xs text-muted-foreground">لون أساسي + خط سفلي عند التحويم</td>
                <td className="p-4 text-xs text-muted-foreground">اسم عميل، اسم مورد، عنوان تقرير</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground" style={{ fontWeight: 500 }}>id</span>
                </td>
                <td className="p-4">
                  <EntityLink variant="id" label="INV-2024-0130" onClick={() => { }} />
                </td>
                <td className="p-4 text-xs text-muted-foreground">خط عرضي + أيقونة صغيرة عند التحويم</td>
                <td className="p-4 text-xs text-muted-foreground">رقم فاتورة، رقم قيد، رقم طلب شراء</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground" style={{ fontWeight: 500 }}>badge</span>
                </td>
                <td className="p-4">
                  <EntityLink variant="badge" label="أرز غلا — كيلو" onClick={() => { }} />
                </td>
                <td className="p-4 text-xs text-muted-foreground">بادج خفيف يتحول للأساسي عند التحويم</td>
                <td className="p-4 text-xs text-muted-foreground">اسم صنف، تصنيف، وحدة قياس</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground" style={{ fontWeight: 500 }}>href</span>
                </td>
                <td className="p-4">
                  <EntityLink label="مصنع الأهرام" href="#" />
                </td>
                <td className="p-4 text-xs text-muted-foreground">رابط حقيقي — يفتح الصفحة مباشرة</td>
                <td className="p-4 text-xs text-muted-foreground">التوجيه عبر URL / React Router</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground" style={{ fontWeight: 500 }}>external</span>
                </td>
                <td className="p-4">
                  <EntityLink label="تقرير المبيعات" href="#" external />
                </td>
                <td className="p-4 text-xs text-muted-foreground">يفتح في تبويب جديد مع أيقونة ExternalLink</td>
                <td className="p-4 text-xs text-muted-foreground">روابط خارجية، مستندات، ملفات PDF</td>
              </tr>
              <tr className="hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground" style={{ fontWeight: 500 }}>plain</span>
                </td>
                <td className="p-4">
                  <EntityLink label="حساب بدون رابط" />
                </td>
                <td className="p-4 text-xs text-muted-foreground">نص عادي — لا تحويم، لا أيقونة</td>
                <td className="p-4 text-xs text-muted-foreground">قيم غير قابلة للتنقل في نفس المكوّن</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Code snippet */}
        <div className="border-t border-border bg-muted/20 px-6 py-4">
          <p className="text-xs text-muted-foreground mb-2" style={{ fontWeight: 600 }}>مثال على الاستخدام</p>
          <pre className="text-xs text-foreground leading-relaxed overflow-x-auto" dir="ltr">{`import { EntityLink } from "@qabasone/qabasone-ui/components/EntityLink";

// ID column — SPA callback
<EntityLink variant="id" label="INV-2024-0130" onClick={() => openInvoice(id)} />

// Name column — React Router href
<EntityLink label="شركة النور للتجارة" href={\`/customers/\${id}\`} />

// Product — badge style + callback
<EntityLink variant="badge" label="أرز غلا" onClick={() => filterByProduct(id)} />

// External document link
<EntityLink label="تقرير الربع الأول" href="/reports/q1.pdf" external />

// No link — renders as plain text (same component, consistent layout)
<EntityLink label="قيمة بدون تنقل" />`}</pre>
        </div>
      </section>

      {/* Usage snippet */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3>
            الاستخدام —{" "}
            <code className="text-sm text-primary bg-primary/8 px-1.5 py-0.5 rounded-md">
              ContextMenuTrigger
            </code>
          </h3>
        </div>
        <pre
          className="text-xs text-foreground leading-relaxed overflow-x-auto p-6 bg-muted/20"
          dir="ltr"
        >{`import { ContextMenuTrigger } from "@qabasone/qabasone-ui/components/ContextMenu";

// Wrap any trigger element
<ContextMenuTrigger groups={[
  {
    items: [
      { id: "view",   label: "عرض", icon: Eye,   onClick: () => {} },
      { id: "edit",   label: "تعديل", icon: Pencil, shortcut: "E" },
    ]
  },
  {
    label: "خطر",
    items: [
      { id: "delete", label: "حذف", icon: Trash2, variant: "danger" },
    ]
  },
]}>
  <button>···</button>
</ContextMenuTrigger>

// For right-click on rows, use the hook:
import { useContextMenu } from "@qabasone/qabasone-ui/components/ContextMenu";

const { open, menuElement } = useContextMenu(groups);
<tr onContextMenu={e => { e.preventDefault(); open(e.clientX, e.clientY); }}>
  ...
  {menuElement}
</tr>`}</pre>
      </section>

      {/* Loading skeleton */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="h-9 w-64 bg-muted rounded-lg animate-pulse" />
          <div className="h-9 w-9 bg-muted rounded-lg animate-pulse ms-auto" />
        </div>
        <div className="p-2 space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex gap-4 p-2 animate-pulse"
            >
              <div className="h-4 w-4 bg-muted rounded" />
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded ms-auto" />
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center justify-between animate-pulse">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 bg-muted rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
