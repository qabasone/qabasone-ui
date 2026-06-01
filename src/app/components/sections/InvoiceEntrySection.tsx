import { useState, useRef, useCallback, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import {
  Plus, Trash2, Copy, ChevronDown, Search, Check,
  Keyboard, FileText, MoreHorizontal,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types & constants
// ─────────────────────────────────────────────────────────────────────────────

const UNIT_GROUPS = [
  { label: "عدد",  units: [{ id: "pcs", abbr: "قطعة" }, { id: "dozen", abbr: "دزينة" }, { id: "box", abbr: "علبة" }, { id: "carton", abbr: "كرتون" }, { id: "crate", abbr: "صندوق" }, { id: "sack", abbr: "كيس" }, { id: "pallet", abbr: "باليت" }] },
  { label: "وزن",  units: [{ id: "g", abbr: "غ" }, { id: "kg", abbr: "كغ" }, { id: "ton", abbr: "طن" }, { id: "lb", abbr: "رطل" }, { id: "q", abbr: "قنطار" }] },
  { label: "حجم",  units: [{ id: "ml", abbr: "مل" }, { id: "l", abbr: "لتر" }, { id: "m3", abbr: "م³" }, { id: "gal", abbr: "غالون" }] },
  { label: "طول",  units: [{ id: "mm", abbr: "مم" }, { id: "cm", abbr: "سم" }, { id: "m", abbr: "م" }] },
];

const ALL_UNITS = UNIT_GROUPS.flatMap(g => g.units);
const unitAbbr = (id: string) => ALL_UNITS.find(u => u.id === id)?.abbr ?? id;

interface CatalogItem {
  id: string;
  name: string;
  unit: string;
  unitPrice: string;
  category: string;
}

const CATALOG: CatalogItem[] = [
  { id: "c01", name: "أرز بسمتي ممتاز", unit: "sack",   unitPrice: "185",    category: "حبوب" },
  { id: "c02", name: "أرز مصري قصير",   unit: "sack",   unitPrice: "140",    category: "حبوب" },
  { id: "c03", name: "قمح صلب",         unit: "ton",    unitPrice: "950",    category: "حبوب" },
  { id: "c04", name: "شعير علف",        unit: "ton",    unitPrice: "720",    category: "حبوب" },
  { id: "c05", name: "دقيق قمح أبيض",  unit: "sack",   unitPrice: "95",     category: "بقالة" },
  { id: "c06", name: "سكر أبيض ناعم",  unit: "sack",   unitPrice: "110",    category: "بقالة" },
  { id: "c07", name: "ملح طعام",        unit: "sack",   unitPrice: "28",     category: "بقالة" },
  { id: "c08", name: "زيت نخيل مكرر",  unit: "l",      unitPrice: "12.50",  category: "زيوت" },
  { id: "c09", name: "زيت ذرة",         unit: "l",      unitPrice: "15.75",  category: "زيوت" },
  { id: "c10", name: "زيت زيتون بكر",  unit: "l",      unitPrice: "48",     category: "زيوت" },
  { id: "c11", name: "عدس أحمر",        unit: "sack",   unitPrice: "165",    category: "بقوليات" },
  { id: "c12", name: "فاصوليا بيضاء",  unit: "sack",   unitPrice: "145",    category: "بقوليات" },
  { id: "c13", name: "حمص مجفف",        unit: "kg",     unitPrice: "8.50",   category: "بقوليات" },
  { id: "c14", name: "سكر خام بني",     unit: "ton",    unitPrice: "890",    category: "بقالة" },
  { id: "c15", name: "شاي أسود ممتاز",  unit: "carton", unitPrice: "320",    category: "مشروبات" },
  { id: "c16", name: "قهوة عربية",       unit: "carton", unitPrice: "480",    category: "مشروبات" },
  { id: "c17", name: "توابل مشكلة",     unit: "box",    unitPrice: "95",     category: "توابل" },
  { id: "c18", name: "صابون غسيل",      unit: "carton", unitPrice: "185",    category: "منظفات" },
  { id: "c19", name: "معكرونة إيطالية", unit: "carton", unitPrice: "240",    category: "بقالة" },
  { id: "c20", name: "بسكويت مشكل",    unit: "carton", unitPrice: "180",    category: "حلويات" },
];

interface InvoiceRow {
  id: string;
  description: string;
  qty: string;
  unit: string;
  unitPrice: string;
  discount: string;
}

type RowField = "description" | "qty" | "unit" | "unitPrice" | "discount";
const FIELDS: RowField[] = ["description", "qty", "unit", "unitPrice", "discount"];

let rowCounter = 0;
const newRow = (overrides?: Partial<InvoiceRow>): InvoiceRow => ({
  id: `row-${++rowCounter}`,
  description: "",
  qty: "",
  unit: "pcs",
  unitPrice: "",
  discount: "",
  ...overrides,
});

const fmt = (v: string, dec = 2) => {
  const n = parseFloat(v);
  if (isNaN(n)) return "";
  return n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
};

const rowTotal = (row: InvoiceRow): number => {
  const qty = parseFloat(row.qty) || 0;
  const price = parseFloat(row.unitPrice) || 0;
  const disc = parseFloat(row.discount) || 0;
  return qty * price * (1 - disc / 100);
};

// ─────────────────────────────────────────────────────────────────────────────
// Product autocomplete popup
// ─────────────────────────────────────────────────────────────────────────────

function CatalogPopup({
  query, triggerRef, onSelect, onClose,
}: {
  query: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  onSelect: (item: CatalogItem) => void;
  onClose: () => void;
}) {
  const results = query.trim()
    ? CATALOG.filter(c => c.name.includes(query) || c.category.includes(query)).slice(0, 8)
    : CATALOG.slice(0, 8);

  const [hi, setHi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const dropH = Math.min(results.length * 40 + 8, 320);
    const below = window.innerHeight - r.bottom;
    const top = below >= dropH ? r.bottom + 2 : r.top - dropH - 2;
    setPos({ top: Math.max(8, top), left: r.left, width: r.width });
  }, [query, results.length, triggerRef]);

  useEffect(() => { setHi(0); }, [query]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setHi(h => Math.min(h + 1, results.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
      if (e.key === "Enter")     { e.preventDefault(); if (results[hi]) { onSelect(results[hi]); } }
      if (e.key === "Escape")    { onClose(); }
    };
    document.addEventListener("keydown", fn, { capture: true });
    return () => document.removeEventListener("keydown", fn, { capture: true });
  }, [hi, results, onSelect, onClose]);

  if (!pos || results.length === 0) return null;

  return createPortal(
    <div
      dir="rtl"
      ref={ref}
      style={{
        position: "fixed", zIndex: 9999,
        top: pos.top, left: pos.left, width: `${pos.width}px`,
        fontFamily: "var(--font-family)",
        boxShadow: "var(--shadow-popover)",
        animation: "ctx-in 0.12s cubic-bezier(0.16,1,0.3,1) both",
        maxHeight: "320px",
        overflowY: "auto",
      }}
      className="bg-card rounded-xl border border-border py-1 dropdown-scroll"
    >
      {results.map((item, i) => (
        <button
          key={item.id}
          onMouseDown={e => { e.preventDefault(); onSelect(item); }}
          onMouseEnter={() => setHi(i)}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-right transition-colors"
          style={{ backgroundColor: hi === i ? "var(--muted)" : "transparent" }}
        >
          <div className="flex-1 min-w-0">
            <p className="truncate text-right" style={{ color: "var(--foreground)", fontWeight: 500 }}>{item.name}</p>
          </div>
          <span className="text-xs px-1.5 py-0.5 rounded-md shrink-0" style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>
            {item.category}
          </span>
          <span className="text-xs shrink-0 amount" style={{ color: "var(--muted-foreground)" }}>
            {fmt(item.unitPrice)} / {unitAbbr(item.unit)}
          </span>
        </button>
      ))}
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Unit picker popup
// ─────────────────────────────────────────────────────────────────────────────

function UnitPopup({
  value, triggerRef, onSelect, onClose,
}: {
  value: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const dropH = 300;
    const below = window.innerHeight - r.bottom;
    const top = below >= dropH ? r.bottom + 2 : r.top - dropH - 2;
    const left = Math.min(r.left, window.innerWidth - 200 - 8);
    setPos({ top: Math.max(8, top), left });
    setTimeout(() => searchRef.current?.focus(), 10);
  }, [triggerRef]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", fn), 50);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", fn); };
  }, [onClose, triggerRef]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const filtered = search.trim()
    ? UNIT_GROUPS.map(g => ({ ...g, units: g.units.filter(u => u.abbr.includes(search)) })).filter(g => g.units.length > 0)
    : UNIT_GROUPS;

  if (!pos) return null;

  return createPortal(
    <div
      dir="rtl"
      ref={ref}
      style={{
        position: "fixed", zIndex: 9999,
        top: pos.top, left: pos.left, width: "200px",
        fontFamily: "var(--font-family)",
        boxShadow: "var(--shadow-popover)",
        animation: "ctx-in 0.12s cubic-bezier(0.16,1,0.3,1) both",
      }}
      className="bg-card rounded-xl border border-border overflow-hidden flex flex-col"
      style2={{ maxHeight: "300px" }}
    >
      <div className="p-1.5 border-b border-border shrink-0">
        <div className="relative">
          <Search size={11} className="absolute top-1/2 -translate-y-1/2 end-2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
          <input
            ref={searchRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث..."
            className="w-full h-7 ps-2 pe-6 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}
          />
        </div>
      </div>
      <div className="overflow-y-auto max-h-64 dropdown-scroll p-1">
        {filtered.map(group => (
          <div key={group.label}>
            <p className="px-2 py-0.5 text-[10px] text-muted-foreground" style={{ fontWeight: 600 }}>{group.label}</p>
            <div className="grid grid-cols-3 gap-0.5 mb-1">
              {group.units.map(unit => (
                <button
                  key={unit.id}
                  onMouseDown={e => { e.preventDefault(); onSelect(unit.id); onClose(); }}
                  className="px-1.5 py-1.5 rounded-lg text-xs text-center transition-colors hover:bg-muted"
                  style={{
                    color: value === unit.id ? "var(--primary)" : "var(--foreground)",
                    fontWeight: value === unit.id ? 700 : 500,
                    backgroundColor: value === unit.id ? "var(--primary-muted)" : "transparent",
                  }}
                >
                  {unit.abbr}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// The table
// ─────────────────────────────────────────────────────────────────────────────

export interface InvoiceEntryTableProps {
  rows: InvoiceRow[];
  onChange: (rows: InvoiceRow[]) => void;
  currency?: string;
  onAddRow?: () => void;
}

export function InvoiceEntryTable({ rows, onChange, currency = "ر.س" }: InvoiceEntryTableProps) {
  // Which cell is focused: rowIdx + field
  const [activeCell, setActiveCell] = useState<{ rowIdx: number; field: RowField } | null>(null);
  // Which rows are selected (for batch ops)
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // Catalog autocomplete open
  const [catalogOpen, setCatalogOpen] = useState(false);
  // Unit picker open: which row
  const [unitPickerRow, setUnitPickerRow] = useState<number | null>(null);

  // refs for every cell input
  const cellRefs = useRef<Map<string, HTMLInputElement>>(new Map());
  // refs for unit buttons (anchor for unit popup)
  const unitBtnRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  // ref for active description input (anchor for catalog popup)
  const descRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  const focusCell = useCallback((rowIdx: number, field: RowField) => {
    if (field === "unit") {
      setUnitPickerRow(rowIdx);
      return;
    }
    const key = `${rowIdx}-${field}`;
    const el = cellRefs.current.get(key);
    if (el) { el.focus(); el.select(); }
    setActiveCell({ rowIdx, field });
  }, []);

  const addRow = useCallback((afterIdx?: number) => {
    const r = newRow();
    if (afterIdx == null) {
      onChange([...rows, r]);
      return rows.length;
    } else {
      const next = [...rows];
      next.splice(afterIdx + 1, 0, r);
      onChange(next);
      return afterIdx + 1;
    }
  }, [rows, onChange]);

  const updateRow = useCallback((idx: number, field: RowField, value: string) => {
    const next = [...rows];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  }, [rows, onChange]);

  const deleteRow = useCallback((idx: number) => {
    if (rows.length === 1) { onChange([newRow()]); return; }
    const next = rows.filter((_, i) => i !== idx);
    onChange(next);
    // focus prev or next row same field
    const nextFocus = Math.min(idx, next.length - 1);
    setTimeout(() => focusCell(nextFocus, activeCell?.field ?? "description"), 10);
  }, [rows, onChange, activeCell, focusCell]);

  const duplicateRow = useCallback((idx: number) => {
    const copy = { ...rows[idx], id: `row-${++rowCounter}` };
    const next = [...rows];
    next.splice(idx + 1, 0, copy);
    onChange(next);
    setTimeout(() => focusCell(idx + 1, "description"), 10);
  }, [rows, onChange, focusCell]);

  const deleteSelected = useCallback(() => {
    if (selected.size === 0) return;
    const next = rows.filter(r => !selected.has(r.id));
    onChange(next.length > 0 ? next : [newRow()]);
    setSelected(new Set());
  }, [rows, selected, onChange]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectAll = () => {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map(r => r.id)));
  };

  // ── Keyboard handler per cell ───────────────────────────────────────────────
  const handleCellKeyDown = useCallback((
    e: React.KeyboardEvent,
    rowIdx: number,
    fieldIdx: number,
  ) => {
    const field = FIELDS[fieldIdx];
    const isLast = fieldIdx === FIELDS.length - 1;
    const isFirst = fieldIdx === 0;

    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      if (isLast) {
        if (rowIdx === rows.length - 1) {
          const nextIdx = addRow();
          setTimeout(() => focusCell(nextIdx, "description"), 20);
        } else {
          focusCell(rowIdx + 1, "description");
        }
      } else {
        focusCell(rowIdx, FIELDS[fieldIdx + 1]);
      }
    } else if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      if (isFirst) {
        if (rowIdx > 0) focusCell(rowIdx - 1, FIELDS[FIELDS.length - 1]);
      } else {
        focusCell(rowIdx, FIELDS[fieldIdx - 1]);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (rowIdx === rows.length - 1) {
        const nextIdx = addRow();
        setTimeout(() => focusCell(nextIdx, field), 20);
      } else {
        focusCell(rowIdx + 1, field);
      }
    } else if (e.key === "ArrowDown" && e.altKey) {
      e.preventDefault();
      if (rowIdx < rows.length - 1) focusCell(rowIdx + 1, field);
    } else if (e.key === "ArrowUp" && e.altKey) {
      e.preventDefault();
      if (rowIdx > 0) focusCell(rowIdx - 1, field);
    } else if ((e.key === "Delete" || e.key === "Backspace") && e.ctrlKey) {
      e.preventDefault();
      deleteRow(rowIdx);
    } else if (e.key === "d" && e.ctrlKey) {
      e.preventDefault();
      duplicateRow(rowIdx);
    } else if (e.key === "Escape") {
      (e.target as HTMLElement).blur();
      setActiveCell(null);
      setCatalogOpen(false);
    }
  }, [rows.length, addRow, focusCell, deleteRow, duplicateRow]);

  // ── Computed totals ─────────────────────────────────────────────────────────
  const subtotal = rows.reduce((s, r) => s + rowTotal(r), 0);
  const totalQty = rows.reduce((s, r) => s + (parseFloat(r.qty) || 0), 0);
  const filledRows = rows.filter(r => r.description || r.qty || r.unitPrice).length;

  // ── Cell style helper ───────────────────────────────────────────────────────
  const isCellActive = (rowIdx: number, field: RowField) =>
    activeCell?.rowIdx === rowIdx && activeCell?.field === field;

  const isRowActive = (rowIdx: number) => activeCell?.rowIdx === rowIdx;
  const isRowSelected = (id: string) => selected.has(id);

  // Shared input style for number cells
  const numInputStyle: React.CSSProperties = {
    direction: "ltr",
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    fontFeatureSettings: '"tnum"',
    color: "var(--foreground)",
    caretColor: "var(--primary)",
    background: "transparent",
    width: "100%",
    height: "100%",
    outline: "none",
    padding: "0 8px",
    fontSize: "13.5px",
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1.5px solid var(--border-strong)", boxShadow: "var(--shadow-card)" }}>

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}>
        {selected.size > 0 ? (
          <>
            <span className="text-xs text-muted-foreground">{selected.size} صف محدد</span>
            <button
              onClick={deleteSelected}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs transition-colors hover:bg-destructive/10"
              style={{ color: "var(--destructive)", fontWeight: 500 }}
            >
              <Trash2 size={12} />حذف المحدد
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="h-7 px-2.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
            >
              إلغاء
            </button>
          </>
        ) : (
          <>
            <span className="text-xs text-muted-foreground">{filledRows} صنف</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground amount">{totalQty.toLocaleString("en-US")} وحدة</span>
          </>
        )}
        <div className="flex-1" />
        <button
          onClick={() => { const idx = addRow(); setTimeout(() => focusCell(idx, "description"), 20); }}
          className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs transition-colors"
          style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", fontWeight: 600 }}
        >
          <Plus size={12} />صف جديد
        </button>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: "720px" }}>
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "32px" }} />
            <col />  {/* description — flex */}
            <col style={{ width: "90px" }} />
            <col style={{ width: "72px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "72px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "36px" }} />
          </colgroup>

          {/* Header */}
          <thead>
            <tr style={{ backgroundColor: "var(--secondary)" }}>
              {/* Checkbox all */}
              <th className="px-2 py-2.5 border-b border-e" style={{ borderColor: "var(--border)" }}>
                <input
                  type="checkbox"
                  checked={selected.size === rows.length && rows.length > 0}
                  onChange={selectAll}
                  className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                />
              </th>
              {/* Row # */}
              <th className="text-center py-2.5 border-b border-e" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 600 }}>#</th>
              {[
                { label: "الصنف / الوصف", align: "right" },
                { label: "الكمية", align: "right" },
                { label: "الوحدة", align: "center" },
                { label: "سعر الوحدة", align: "right" },
                { label: "خصم %", align: "right" },
                { label: "الإجمالي", align: "right" },
              ].map(col => (
                <th
                  key={col.label}
                  className="px-3 py-2.5 border-b border-e"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--muted-foreground)",
                    fontSize: "11px",
                    fontWeight: 600,
                    textAlign: col.align as any,
                    letterSpacing: "0.02em",
                  }}
                >
                  {col.label}
                </th>
              ))}
              {/* Actions col */}
              <th className="border-b" style={{ borderColor: "var(--border)" }} />
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.map((row, rowIdx) => {
              const total = rowTotal(row);
              const rowActive = isRowActive(rowIdx);
              const rowSel = isRowSelected(row.id);

              return (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: rowSel
                      ? "color-mix(in srgb, var(--primary) 6%, transparent)"
                      : rowActive
                      ? "color-mix(in srgb, var(--primary) 3%, var(--card))"
                      : rowIdx % 2 === 1
                      ? "var(--secondary)"
                      : "var(--card)",
                    transition: "background-color 0.1s",
                  }}
                >
                  {/* Checkbox */}
                  <td className="px-2 border-b border-e" style={{ borderColor: "var(--border)", height: "40px" }}>
                    <input
                      type="checkbox"
                      checked={rowSel}
                      onChange={() => toggleSelect(row.id)}
                      className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                    />
                  </td>

                  {/* Row number */}
                  <td className="text-center border-b border-e" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", fontSize: "11px", fontWeight: 600 }}>
                    {rowIdx + 1}
                  </td>

                  {/* Description */}
                  <td className="border-b border-e p-0" style={{ borderColor: "var(--border)", position: "relative" }}>
                    <div
                      className="absolute inset-0 transition-all"
                      style={{
                        outline: isCellActive(rowIdx, "description") ? `2px solid var(--primary)` : "none",
                        outlineOffset: "-1px",
                        borderRadius: "0",
                        zIndex: isCellActive(rowIdx, "description") ? 2 : 0,
                      }}
                    />
                    <input
                      ref={el => {
                        const key = `${rowIdx}-description`;
                        if (el) { cellRefs.current.set(key, el); descRefs.current.set(rowIdx, el); }
                        else { cellRefs.current.delete(key); descRefs.current.delete(rowIdx); }
                      }}
                      type="text"
                      value={row.description}
                      onChange={e => updateRow(rowIdx, "description", e.target.value)}
                      onFocus={() => { setActiveCell({ rowIdx, field: "description" }); setCatalogOpen(true); }}
                      onBlur={() => { setActiveCell(null); setTimeout(() => setCatalogOpen(false), 150); }}
                      onKeyDown={e => {
                        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                          // let catalog handle arrows
                          return;
                        }
                        handleCellKeyDown(e, rowIdx, 0);
                      }}
                      placeholder={rowIdx === 0 ? "اكتب اسم الصنف أو ابحث في الكتالوج..." : "الوصف"}
                      className="h-full w-full px-3 bg-transparent focus:outline-none text-sm"
                      style={{
                        color: "var(--foreground)",
                        caretColor: "var(--primary)",
                        height: "40px",
                        display: "block",
                      }}
                      autoComplete="off"
                    />
                    {/* Catalog popup */}
                    {catalogOpen && activeCell?.rowIdx === rowIdx && activeCell?.field === "description" && (
                      <CatalogPopup
                        query={row.description}
                        triggerRef={{ current: descRefs.current.get(rowIdx) ?? null }}
                        onSelect={item => {
                          const next = [...rows];
                          next[rowIdx] = {
                            ...next[rowIdx],
                            description: item.name,
                            unit: item.unit,
                            unitPrice: item.unitPrice,
                          };
                          onChange(next);
                          setCatalogOpen(false);
                          setTimeout(() => focusCell(rowIdx, "qty"), 20);
                        }}
                        onClose={() => setCatalogOpen(false)}
                      />
                    )}
                  </td>

                  {/* Qty */}
                  <td className="border-b border-e p-0" style={{ borderColor: "var(--border)", position: "relative" }}>
                    <div
                      className="absolute inset-0 transition-all"
                      style={{
                        outline: isCellActive(rowIdx, "qty") ? `2px solid var(--primary)` : "none",
                        outlineOffset: "-1px",
                        zIndex: isCellActive(rowIdx, "qty") ? 2 : 0,
                      }}
                    />
                    <input
                      ref={el => {
                        const key = `${rowIdx}-qty`;
                        if (el) cellRefs.current.set(key, el); else cellRefs.current.delete(key);
                      }}
                      type="text"
                      inputMode="decimal"
                      value={row.qty}
                      onChange={e => updateRow(rowIdx, "qty", e.target.value.replace(/[^0-9.]/g, ""))}
                      onFocus={() => setActiveCell({ rowIdx, field: "qty" })}
                      onBlur={() => setActiveCell(null)}
                      onKeyDown={e => handleCellKeyDown(e, rowIdx, 1)}
                      placeholder="0"
                      style={{ ...numInputStyle, height: "40px", display: "block" }}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </td>

                  {/* Unit */}
                  <td className="border-b border-e p-0" style={{ borderColor: "var(--border)", position: "relative" }}>
                    <button
                      ref={el => { if (el) unitBtnRefs.current.set(rowIdx, el); else unitBtnRefs.current.delete(rowIdx); }}
                      onClick={() => setUnitPickerRow(unitPickerRow === rowIdx ? null : rowIdx)}
                      onKeyDown={e => {
                        if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); focusCell(rowIdx, "unitPrice"); }
                        if (e.key === "Tab" && e.shiftKey) { e.preventDefault(); focusCell(rowIdx, "qty"); }
                        if (e.key === "Enter") { e.preventDefault(); setUnitPickerRow(rowIdx); }
                        if (e.key === "Escape") { setUnitPickerRow(null); }
                      }}
                      className="w-full h-full flex items-center justify-center gap-0.5 px-2 transition-colors hover:bg-muted"
                      style={{
                        color: "var(--foreground)",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        outline: unitPickerRow === rowIdx ? `2px solid var(--primary)` : "none",
                        outlineOffset: "-1px",
                        height: "40px",
                      }}
                    >
                      {unitAbbr(row.unit)}
                      <ChevronDown size={9} style={{ color: "var(--muted-foreground)", opacity: 0.6 }} />
                    </button>
                    {unitPickerRow === rowIdx && (
                      <UnitPopup
                        value={row.unit}
                        triggerRef={{ current: unitBtnRefs.current.get(rowIdx) ?? null }}
                        onSelect={u => {
                          updateRow(rowIdx, "unit", u);
                          setUnitPickerRow(null);
                          setTimeout(() => focusCell(rowIdx, "unitPrice"), 20);
                        }}
                        onClose={() => setUnitPickerRow(null)}
                      />
                    )}
                  </td>

                  {/* Unit Price */}
                  <td className="border-b border-e p-0" style={{ borderColor: "var(--border)", position: "relative" }}>
                    <div
                      className="absolute inset-0 transition-all"
                      style={{
                        outline: isCellActive(rowIdx, "unitPrice") ? `2px solid var(--primary)` : "none",
                        outlineOffset: "-1px",
                        zIndex: isCellActive(rowIdx, "unitPrice") ? 2 : 0,
                      }}
                    />
                    <div className="flex items-center h-full" style={{ height: "40px" }}>
                      <span className="ps-2 text-xs amount shrink-0" style={{ color: "var(--muted-foreground)", fontWeight: 600 }}>{currency}</span>
                      <input
                        ref={el => {
                          const key = `${rowIdx}-unitPrice`;
                          if (el) cellRefs.current.set(key, el); else cellRefs.current.delete(key);
                        }}
                        type="text"
                        inputMode="decimal"
                        value={row.unitPrice}
                        onChange={e => updateRow(rowIdx, "unitPrice", e.target.value.replace(/[^0-9.]/g, ""))}
                        onFocus={() => setActiveCell({ rowIdx, field: "unitPrice" })}
                        onBlur={() => setActiveCell(null)}
                        onKeyDown={e => handleCellKeyDown(e, rowIdx, 3)}
                        placeholder="0.00"
                        style={{ ...numInputStyle, flex: 1, padding: "0 6px" }}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </td>

                  {/* Discount */}
                  <td className="border-b border-e p-0" style={{ borderColor: "var(--border)", position: "relative" }}>
                    <div
                      className="absolute inset-0 transition-all"
                      style={{
                        outline: isCellActive(rowIdx, "discount") ? `2px solid var(--primary)` : "none",
                        outlineOffset: "-1px",
                        zIndex: isCellActive(rowIdx, "discount") ? 2 : 0,
                      }}
                    />
                    <div className="flex items-center h-full" style={{ height: "40px" }}>
                      <input
                        ref={el => {
                          const key = `${rowIdx}-discount`;
                          if (el) cellRefs.current.set(key, el); else cellRefs.current.delete(key);
                        }}
                        type="text"
                        inputMode="decimal"
                        value={row.discount}
                        onChange={e => {
                          const v = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                          updateRow(rowIdx, "discount", e.target.value === "" ? "" : String(v));
                        }}
                        onFocus={() => setActiveCell({ rowIdx, field: "discount" })}
                        onBlur={() => setActiveCell(null)}
                        onKeyDown={e => handleCellKeyDown(e, rowIdx, 4)}
                        placeholder="0"
                        style={{ ...numInputStyle, flex: 1, padding: "0 4px 0 2px" }}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="pe-2 text-xs shrink-0" style={{ color: "var(--muted-foreground)" }}>%</span>
                    </div>
                  </td>

                  {/* Total (readonly) */}
                  <td className="px-3 border-b border-e text-right" style={{ borderColor: "var(--border)", height: "40px" }}>
                    {total > 0 ? (
                      <div className="flex flex-col items-end">
                        <span className="text-sm amount" style={{ fontWeight: 700, color: "var(--foreground)" }}>
                          {fmt(String(total))}
                        </span>
                        {parseFloat(row.discount) > 0 && (
                          <span className="text-[10px] amount" style={{ color: "var(--warning)", opacity: 0.8 }}>
                            −{row.discount}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Row actions */}
                  <td className="border-b" style={{ borderColor: "var(--border)", height: "40px" }}>
                    <div className="flex items-center justify-center gap-0">
                      <button
                        title="تكرار (Ctrl+D)"
                        onClick={() => duplicateRow(rowIdx)}
                        className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                        style={{ color: "var(--muted-foreground)" }}
                        tabIndex={-1}
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        title="حذف (Ctrl+Del)"
                        onClick={() => deleteRow(rowIdx)}
                        className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                        style={{ color: "var(--muted-foreground)" }}
                        tabIndex={-1}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Footer */}
          <tfoot>
            {/* Add row */}
            <tr>
              <td colSpan={9} className="border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}>
                <button
                  onClick={() => { const idx = addRow(); setTimeout(() => focusCell(idx, "description"), 20); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Plus size={13} />
                  <span style={{ fontWeight: 500 }}>إضافة صف جديد</span>
                  <kbd className="ms-auto text-[10px] px-1.5 py-0.5 rounded border border-border amount" style={{ backgroundColor: "var(--card)", fontFamily: "var(--font-family)" }}>
                    Tab
                  </kbd>
                </button>
              </td>
            </tr>

            {/* Totals */}
            <tr style={{ backgroundColor: "var(--secondary)" }}>
              <td colSpan={7} className="px-4 py-3 text-sm border-t text-muted-foreground border-e" style={{ borderColor: "var(--border)", fontWeight: 500, textAlign: "right" }}>
                {filledRows} صنف · {totalQty.toLocaleString("en-US")} وحدة إجمالية
              </td>
              <td className="px-3 py-3 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--primary-muted)" }}>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs" style={{ color: "var(--primary)", fontWeight: 500 }}>المجموع</span>
                  <span className="text-base amount" style={{ fontWeight: 800, color: "var(--primary)" }}>
                    {currency} {fmt(String(subtotal))}
                  </span>
                </div>
              </td>
              <td className="border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--primary-muted)" }} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── hover group for row actions ── */}
      <style>{`
        tbody tr:hover td:last-child button { opacity: 1 !important; }
        tbody tr:hover td:nth-last-child(2) button { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shortcut reference bar
// ─────────────────────────────────────────────────────────────────────────────

function ShortcutBar() {
  const shortcuts = [
    { keys: ["Tab"],        desc: "الخلية التالية / صف جديد" },
    { keys: ["↵ Enter"],   desc: "نفس العمود، صف تالٍ" },
    { keys: ["↓ ↑", "Alt"], desc: "تنقل بين الصفوف" },
    { keys: ["Ctrl", "D"], desc: "تكرار الصف" },
    { keys: ["Ctrl", "⌫"], desc: "حذف الصف" },
    { keys: ["Esc"],        desc: "إلغاء التحديد" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 rounded-xl" style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5 shrink-0">
        <Keyboard size={13} style={{ color: "var(--muted-foreground)" }} />
        <span className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>اختصارات لوحة المفاتيح</span>
      </div>
      {shortcuts.map(s => (
        <div key={s.desc} className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {s.keys.map(k => (
              <kbd key={k} className="text-[10px] px-1.5 py-0.5 rounded-md border border-border amount"
                style={{ backgroundColor: "var(--card)", color: "var(--foreground)", fontFamily: "var(--font-family)", fontWeight: 600 }}>
                {k}
              </kbd>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{s.desc}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────────────

export function InvoiceEntrySection() {
  const [rows, setRows] = useState<InvoiceRow[]>([
    newRow({ description: "أرز بسمتي ممتاز", qty: "50",  unit: "sack",   unitPrice: "185",   discount: "5" }),
    newRow({ description: "زيت نخيل مكرر",  qty: "200", unit: "l",      unitPrice: "12.50", discount: "" }),
    newRow({ description: "سكر أبيض ناعم",  qty: "30",  unit: "sack",   unitPrice: "110",   discount: "10" }),
    newRow({ description: "",               qty: "",    unit: "pcs",    unitPrice: "",      discount: "" }),
  ]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-foreground mb-1">إدخال بيانات الفاتورة</h1>
        <p className="text-muted-foreground">
          جدول إدخال سريع — تنقل بالكيبورد، بحث في الكتالوج، اختيار الوحدة، حساب تلقائي
        </p>
      </div>

      {/* Shortcuts */}
      <ShortcutBar />

      {/* Table */}
      <InvoiceEntryTable rows={rows} onChange={setRows} currency="ر.س" />

      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Search,      title: "بحث تلقائي في الكتالوج", body: "اكتب اسم الصنف في خانة الوصف — تظهر اقتراحات تملأ السعر والوحدة تلقائياً" },
          { icon: FileText,    title: "تنقل بلا ماوس",           body: "Tab للانتقال للخلية التالية، Enter لنفس العمود بالصف الجديد — جدول كامل بدون ماوس" },
          { icon: Copy,        title: "تكرار وحذف سريع",          body: "Ctrl+D لتكرار أي صف، Ctrl+⌫ لحذفه، أو حدد عدة صفوف واحذفها دفعةً واحدة" },
        ].map(tip => (
          <div key={tip.title} className="flex gap-3 p-4 rounded-xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--primary-muted)" }}>
              <tip.icon size={15} style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <p className="text-sm" style={{ fontWeight: 600, color: "var(--foreground)" }}>{tip.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)", lineHeight: 1.55 }}>{tip.body}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
