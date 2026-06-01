import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown, Plus, Minus, ArrowLeftRight, AlertCircle,
  RefreshCw, Percent, Check, Info,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CURRENCIES = [
  { code: "SAR", symbol: "ر.س", name: "ريال سعودي" },
  { code: "USD", symbol: "$",   name: "دولار أمريكي" },
  { code: "EUR", symbol: "€",   name: "يورو" },
  { code: "EGP", symbol: "ج.م", name: "جنيه مصري" },
  { code: "AED", symbol: "د.إ", name: "درهم إماراتي" },
  { code: "KWD", symbol: "د.ك", name: "دينار كويتي" },
  { code: "QAR", symbol: "ر.ق", name: "ريال قطري" },
  { code: "JOD", symbol: "د.أ", name: "دينار أردني" },
];

const UNIT_GROUPS = [
  {
    label: "عدد",
    units: [
      { id: "pcs",    abbr: "قطعة",   label: "قطعة",      factor: 1 },
      { id: "dozen",  abbr: "دزينة",  label: "دزينة",     factor: 12 },
      { id: "box",    abbr: "علبة",   label: "علبة",      factor: 1 },
      { id: "carton", abbr: "كرتون",  label: "كرتون",     factor: 1 },
      { id: "crate",  abbr: "صندوق",  label: "صندوق",     factor: 1 },
      { id: "sack",   abbr: "كيس",    label: "كيس",       factor: 1 },
      { id: "pallet", abbr: "باليت",  label: "باليت",     factor: 1 },
    ],
  },
  {
    label: "وزن",
    units: [
      { id: "g",   abbr: "غ",      label: "غرام",      factor: 0.001 },
      { id: "kg",  abbr: "كغ",     label: "كيلوغرام",  factor: 1 },
      { id: "ton", abbr: "طن",     label: "طن",        factor: 1000 },
      { id: "lb",  abbr: "رطل",    label: "رطل",       factor: 0.453592 },
      { id: "q",   abbr: "قنطار",  label: "قنطار",     factor: 100 },
    ],
  },
  {
    label: "حجم",
    units: [
      { id: "ml",  abbr: "مل",     label: "مليلتر",    factor: 0.001 },
      { id: "l",   abbr: "لتر",    label: "لتر",       factor: 1 },
      { id: "m3",  abbr: "م³",     label: "متر مكعب",  factor: 1000 },
      { id: "gal", abbr: "غالون",  label: "غالون",     factor: 3.785 },
    ],
  },
  {
    label: "طول",
    units: [
      { id: "mm",  abbr: "مم",     label: "ميليمتر",   factor: 0.001 },
      { id: "cm",  abbr: "سم",     label: "سنتيمتر",   factor: 0.01 },
      { id: "m",   abbr: "م",      label: "متر",       factor: 1 },
    ],
  },
];

const ALL_UNITS = UNIT_GROUPS.flatMap(g => g.units);

function getUnit(id: string) {
  return ALL_UNITS.find(u => u.id === id) ?? ALL_UNITS[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatAmount(raw: string, decimals = 2): string {
  const n = parseFloat(raw.replace(/,/g, ""));
  if (isNaN(n)) return raw;
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function stripFormat(v: string) {
  return v.replace(/,/g, "");
}

// ─────────────────────────────────────────────────────────────────────────────
// Field wrapper
// ─────────────────────────────────────────────────────────────────────────────

function Field({
  label, required, hint, error, children,
}: {
  label?: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm text-foreground" style={{ fontWeight: 500 }}>
          {label}
          {required && <span className="text-destructive me-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs flex items-center gap-1 text-muted-foreground">
          <Info size={10} className="shrink-0" />{hint}
        </p>
      )}
      {error && (
        <p className="text-xs flex items-center gap-1" style={{ color: "var(--destructive)" }}>
          <AlertCircle size={11} className="shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UnitDropdown — searchable portal dropdown for unit selection
// ─────────────────────────────────────────────────────────────────────────────

function UnitDropdown({
  value, onChange, triggerRef, onClose,
}: {
  value: string;
  onChange: (id: string) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const dropH = 320;
    const spaceBelow = window.innerHeight - r.bottom;
    const top = spaceBelow >= dropH ? r.bottom + 4 : r.top - dropH - 4;
    setPos({ top: Math.max(8, top), left: r.left, width: Math.max(r.width, 200) });
  }, [triggerRef]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", fn), 60);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", fn); };
  }, [onClose, triggerRef]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const filtered = search.trim()
    ? UNIT_GROUPS.map(g => ({ ...g, units: g.units.filter(u => u.label.includes(search) || u.abbr.includes(search)) })).filter(g => g.units.length > 0)
    : UNIT_GROUPS;

  if (!pos) return null;

  return createPortal(
    <div
      dir="rtl"
      ref={ref}
      style={{
        position: "fixed", zIndex: 9999,
        top: pos.top, left: pos.left, width: `${pos.width}px`,
        animation: "ctx-in 0.15s cubic-bezier(0.16,1,0.3,1) both",
        fontFamily: "var(--font-family)",
        boxShadow: "var(--shadow-modal)",
      }}
      className="bg-card rounded-xl border border-border overflow-hidden max-h-80 flex flex-col"
    >
      <div className="p-2 border-b border-border shrink-0">
        <input
          autoFocus
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث عن وحدة..."
          className="w-full h-8 px-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}
        />
      </div>
      <div className="overflow-y-auto flex-1 dropdown-scroll p-1">
        {filtered.map(group => (
          <div key={group.label}>
            <p className="px-2 py-1 text-[10px] text-muted-foreground" style={{ fontWeight: 600, letterSpacing: "0.06em" }}>
              {group.label}
            </p>
            {group.units.map(unit => (
              <button
                key={unit.id}
                onClick={() => { onChange(unit.id); onClose(); }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-right hover:bg-muted transition-colors"
                style={{ color: value === unit.id ? "var(--primary)" : "var(--foreground)", fontWeight: value === unit.id ? 600 : 400 }}
              >
                <span className="w-8 text-xs text-muted-foreground amount shrink-0">{unit.abbr}</span>
                <span className="flex-1">{unit.label}</span>
                {value === unit.id && <Check size={13} style={{ color: "var(--primary)" }} />}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CurrencyDropdown
// ─────────────────────────────────────────────────────────────────────────────

function CurrencyDropdown({
  value, onChange, triggerRef, onClose,
}: {
  value: string;
  onChange: (c: string) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const w = 220;
    const dropH = CURRENCIES.length * 40 + 16;
    const spaceBelow = window.innerHeight - r.bottom;
    const top = spaceBelow >= dropH ? r.bottom + 4 : r.top - dropH - 4;
    const right = window.innerWidth - r.right;
    setPos({ top: Math.max(8, top), right: Math.min(right, window.innerWidth - w - 8) });
  }, [triggerRef]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", fn), 60);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", fn); };
  }, [onClose, triggerRef]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  if (!pos) return null;

  return createPortal(
    <div
      dir="rtl"
      ref={ref}
      style={{
        position: "fixed", zIndex: 9999,
        top: pos.top, right: pos.right, width: "220px",
        animation: "ctx-in 0.15s cubic-bezier(0.16,1,0.3,1) both",
        fontFamily: "var(--font-family)",
        boxShadow: "var(--shadow-modal)",
      }}
      className="bg-card rounded-xl border border-border py-1 overflow-hidden"
    >
      {CURRENCIES.map(c => (
        <button
          key={c.code}
          onClick={() => { onChange(c.code); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-right hover:bg-muted transition-colors"
          style={{ color: value === c.code ? "var(--primary)" : "var(--foreground)", fontWeight: value === c.code ? 600 : 400 }}
        >
          <span className="w-8 shrink-0 text-xs amount" style={{ color: "var(--muted-foreground)" }}>{c.symbol}</span>
          <span className="flex-1">{c.name}</span>
          {value === c.code && <Check size={13} style={{ color: "var(--primary)" }} />}
        </button>
      ))}
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MoneyInput — the core financial amount field
// ─────────────────────────────────────────────────────────────────────────────

export interface MoneyInputProps {
  value: string;
  onChange: (v: string) => void;
  currency?: string;
  onCurrencyChange?: (c: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  decimals?: number;
  className?: string;
}

export function MoneyInput({
  value,
  onChange,
  currency = "SAR",
  onCurrencyChange,
  placeholder = "0.00",
  label,
  required = false,
  hint,
  error,
  disabled = false,
  readOnly = false,
  size = "md",
  decimals = 2,
  className = "",
}: MoneyInputProps) {
  const [focused, setFocused] = useState(false);
  const [displayVal, setDisplayVal] = useState(() => value ? formatAmount(value, decimals) : "");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const curr = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0];

  const heights = { sm: "h-9", md: "h-11", lg: "h-13" };
  const textSizes = { sm: "text-sm", md: "text-base", lg: "text-lg" };

  useEffect(() => {
    if (!focused) setDisplayVal(value ? formatAmount(value, decimals) : "");
  }, [value, focused, decimals]);

  const handleFocus = () => {
    setFocused(true);
    setDisplayVal(stripFormat(displayVal));
  };

  const handleBlur = () => {
    setFocused(false);
    const clean = stripFormat(displayVal);
    const n = parseFloat(clean);
    if (!isNaN(n)) {
      onChange(clean);
      setDisplayVal(formatAmount(clean, decimals));
    } else if (clean === "") {
      onChange("");
      setDisplayVal("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9.]/g, "");
    const parts = v.split(".");
    const sanitized = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : v;
    setDisplayVal(sanitized);
  };

  const borderColor = error
    ? "var(--destructive)"
    : focused
    ? "var(--ring)"
    : "var(--border-strong)";

  const ringStyle = focused
    ? { boxShadow: error ? `0 0 0 3px color-mix(in srgb, var(--destructive) 15%, transparent)` : `0 0 0 3px color-mix(in srgb, var(--ring) 35%, transparent)` }
    : {};

  return (
    <Field label={label} required={required} hint={hint} error={error}>
      <div
        className={`flex items-center rounded-lg overflow-hidden transition-all ${className}`}
        style={{
          border: `1.5px solid ${borderColor}`,
          backgroundColor: disabled ? "var(--muted)" : readOnly ? "var(--secondary)" : "var(--card)",
          opacity: disabled ? 0.55 : 1,
          ...ringStyle,
        }}
      >
        {/* Currency badge — start (right in RTL) */}
        <button
          ref={currencyRef}
          type="button"
          disabled={disabled || readOnly || !onCurrencyChange}
          onClick={() => onCurrencyChange && setCurrencyOpen(v => !v)}
          className={`flex items-center gap-1 px-3 shrink-0 h-full border-s transition-colors ${heights[size]}`}
          style={{
            borderColor: "var(--border-strong)",
            backgroundColor: "var(--secondary)",
            color: "var(--foreground)",
            cursor: onCurrencyChange && !disabled && !readOnly ? "pointer" : "default",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span className="text-sm amount" style={{ fontWeight: 600, color: "var(--primary)" }}>{curr.symbol}</span>
          {onCurrencyChange && !disabled && !readOnly && (
            <ChevronDown size={11} style={{ color: "var(--muted-foreground)", transition: "transform 0.15s", transform: currencyOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          )}
        </button>

        {/* Number input */}
        <input
          ref={inputRef}
          dir="ltr"
          type="text"
          inputMode="decimal"
          value={focused ? displayVal : displayVal}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`flex-1 px-3 bg-transparent focus:outline-none ${heights[size]} ${textSizes[size]} amount`}
          style={{
            textAlign: "right",
            color: "var(--foreground)",
            caretColor: "var(--primary)",
          }}
        />
      </div>

      {currencyOpen && onCurrencyChange && (
        <CurrencyDropdown
          value={currency}
          onChange={onCurrencyChange}
          triggerRef={currencyRef}
          onClose={() => setCurrencyOpen(false)}
        />
      )}
    </Field>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QuantityInput — number with unit selector and optional stepper
// ─────────────────────────────────────────────────────────────────────────────

export interface QuantityInputProps {
  value: number | string;
  onChange: (v: number) => void;
  unit?: string;
  onUnitChange?: (u: string) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  showStepper?: boolean;
  className?: string;
}

export function QuantityInput({
  value,
  onChange,
  unit = "pcs",
  onUnitChange,
  min = 0,
  max = Infinity,
  step = 1,
  label,
  hint,
  error,
  disabled = false,
  showStepper = true,
  className = "",
}: QuantityInputProps) {
  const [focused, setFocused] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const unitBtnRef = useRef<HTMLButtonElement>(null);
  const currentUnit = getUnit(unit);

  const num = typeof value === "string" ? parseFloat(value) || 0 : value;

  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") { e.preventDefault(); onChange(clamp(num + step)); }
    if (e.key === "ArrowDown") { e.preventDefault(); onChange(clamp(num - step)); }
  };

  const borderColor = error
    ? "var(--destructive)"
    : focused
    ? "var(--ring)"
    : "var(--border-strong)";

  const ringStyle = focused
    ? { boxShadow: `0 0 0 3px color-mix(in srgb, var(--ring) 35%, transparent)` }
    : {};

  return (
    <Field label={label} hint={hint} error={error}>
      <div
        className={`flex items-center rounded-lg overflow-hidden h-11 transition-all ${className}`}
        style={{
          border: `1.5px solid ${borderColor}`,
          backgroundColor: disabled ? "var(--muted)" : "var(--card)",
          opacity: disabled ? 0.55 : 1,
          ...ringStyle,
        }}
      >
        {/* Unit selector — start (right in RTL) */}
        <button
          ref={unitBtnRef}
          type="button"
          disabled={disabled || !onUnitChange}
          onClick={() => onUnitChange && setUnitOpen(v => !v)}
          className="flex items-center gap-1 px-3 shrink-0 h-full border-s transition-colors"
          style={{
            borderColor: "var(--border-strong)",
            backgroundColor: "var(--secondary)",
            color: onUnitChange ? "var(--foreground)" : "var(--muted-foreground)",
            cursor: onUnitChange && !disabled ? "pointer" : "default",
            minWidth: "64px",
          }}
        >
          <span className="text-sm" style={{ fontWeight: 600 }}>{currentUnit.abbr}</span>
          {onUnitChange && !disabled && (
            <ChevronDown size={11} style={{ color: "var(--muted-foreground)", transition: "transform 0.15s", transform: unitOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          )}
        </button>

        {/* Number input */}
        <input
          dir="ltr"
          type="text"
          inputMode="decimal"
          value={num === 0 && !focused ? "" : String(num)}
          onChange={e => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(clamp(v));
            else if (e.target.value === "" || e.target.value === "-") onChange(0);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder="0"
          className="flex-1 px-3 bg-transparent focus:outline-none h-full text-base amount"
          style={{ textAlign: "right", color: "var(--foreground)", caretColor: "var(--primary)" }}
        />

        {/* Stepper buttons — end (left in RTL) */}
        {showStepper && (
          <div className="flex flex-col h-full border-e shrink-0" style={{ borderColor: "var(--border-strong)" }}>
            <button
              type="button"
              disabled={disabled || num >= max}
              onClick={() => onChange(clamp(num + step))}
              className="flex-1 px-2.5 flex items-center justify-center border-b hover:bg-muted active:bg-muted transition-colors disabled:opacity-30"
              style={{ borderColor: "var(--border)" }}
            >
              <Plus size={11} style={{ color: "var(--muted-foreground)" }} />
            </button>
            <button
              type="button"
              disabled={disabled || num <= min}
              onClick={() => onChange(clamp(num - step))}
              className="flex-1 px-2.5 flex items-center justify-center hover:bg-muted active:bg-muted transition-colors disabled:opacity-30"
            >
              <Minus size={11} style={{ color: "var(--muted-foreground)" }} />
            </button>
          </div>
        )}
      </div>

      {unitOpen && onUnitChange && (
        <UnitDropdown
          value={unit}
          onChange={onUnitChange}
          triggerRef={unitBtnRef}
          onClose={() => setUnitOpen(false)}
        />
      )}
    </Field>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UnitPriceInput — price per unit combo
// ─────────────────────────────────────────────────────────────────────────────

export function UnitPriceInput({
  price, onPriceChange,
  unit, onUnitChange,
  currency = "SAR", onCurrencyChange,
  label, hint, error, disabled = false,
}: {
  price: string; onPriceChange: (v: string) => void;
  unit: string; onUnitChange?: (u: string) => void;
  currency?: string; onCurrencyChange?: (c: string) => void;
  label?: string; hint?: string; error?: string; disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [displayVal, setDisplayVal] = useState(() => price ? formatAmount(price) : "");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const currencyRef = useRef<HTMLButtonElement>(null);
  const unitRef = useRef<HTMLButtonElement>(null);
  const curr = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0];
  const currentUnit = getUnit(unit);

  useEffect(() => {
    if (!focused) setDisplayVal(price ? formatAmount(price) : "");
  }, [price, focused]);

  const borderColor = error
    ? "var(--destructive)"
    : focused
    ? "var(--ring)"
    : "var(--border-strong)";

  return (
    <Field label={label} hint={hint} error={error}>
      <div
        className="flex items-center rounded-lg overflow-hidden h-11 transition-all"
        style={{
          border: `1.5px solid ${borderColor}`,
          backgroundColor: disabled ? "var(--muted)" : "var(--card)",
          opacity: disabled ? 0.55 : 1,
          boxShadow: focused ? `0 0 0 3px color-mix(in srgb, var(--ring) 35%, transparent)` : undefined,
        }}
      >
        {/* Currency badge */}
        <button
          ref={currencyRef}
          type="button"
          disabled={disabled || !onCurrencyChange}
          onClick={() => onCurrencyChange && setCurrencyOpen(v => !v)}
          className="flex items-center gap-1 px-3 shrink-0 h-full border-s transition-colors"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--secondary)", cursor: onCurrencyChange ? "pointer" : "default" }}
        >
          <span className="text-sm amount" style={{ fontWeight: 600, color: "var(--primary)" }}>{curr.symbol}</span>
          {onCurrencyChange && <ChevronDown size={11} style={{ color: "var(--muted-foreground)" }} />}
        </button>

        {/* Price input */}
        <input
          dir="ltr"
          type="text"
          inputMode="decimal"
          value={displayVal}
          onChange={e => setDisplayVal(e.target.value.replace(/[^0-9.]/g, ""))}
          onFocus={() => { setFocused(true); setDisplayVal(stripFormat(displayVal)); }}
          onBlur={() => {
            setFocused(false);
            const n = parseFloat(stripFormat(displayVal));
            if (!isNaN(n)) { onPriceChange(String(n)); setDisplayVal(formatAmount(String(n))); }
          }}
          disabled={disabled}
          placeholder="0.00"
          className="flex-1 px-3 bg-transparent focus:outline-none h-full text-base amount"
          style={{ textAlign: "right", color: "var(--foreground)" }}
        />

        {/* Divider */}
        <div className="h-5 w-px shrink-0" style={{ backgroundColor: "var(--border-strong)" }} />

        {/* Per-unit label */}
        <span className="px-2 text-xs text-muted-foreground shrink-0">/</span>

        {/* Unit selector */}
        <button
          ref={unitRef}
          type="button"
          disabled={disabled || !onUnitChange}
          onClick={() => onUnitChange && setUnitOpen(v => !v)}
          className="flex items-center gap-1 pe-3 ps-1 shrink-0 h-full transition-colors"
          style={{ cursor: onUnitChange && !disabled ? "pointer" : "default" }}
        >
          <span className="text-sm" style={{ fontWeight: 600, color: "var(--foreground)" }}>{currentUnit.abbr}</span>
          {onUnitChange && <ChevronDown size={11} style={{ color: "var(--muted-foreground)" }} />}
        </button>
      </div>

      {currencyOpen && onCurrencyChange && (
        <CurrencyDropdown value={currency} onChange={onCurrencyChange} triggerRef={currencyRef} onClose={() => setCurrencyOpen(false)} />
      )}
      {unitOpen && onUnitChange && (
        <UnitDropdown value={unit} onChange={onUnitChange} triggerRef={unitRef} onClose={() => setUnitOpen(false)} />
      )}
    </Field>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PercentageInput — percentage with optional calculated amount
// ─────────────────────────────────────────────────────────────────────────────

export function PercentageInput({
  value, onChange,
  baseAmount,
  label, hint, error, disabled = false,
  max = 100,
}: {
  value: number; onChange: (v: number) => void;
  baseAmount?: number;
  label?: string; hint?: string; error?: string; disabled?: boolean;
  max?: number;
}) {
  const [focused, setFocused] = useState(false);
  const calculated = baseAmount != null ? (baseAmount * value) / 100 : null;

  const borderColor = error ? "var(--destructive)" : focused ? "var(--ring)" : "var(--border-strong)";

  return (
    <Field label={label} hint={hint} error={error}>
      <div className="flex items-center gap-2">
        <div
          className="flex items-center rounded-lg overflow-hidden h-11 transition-all flex-1"
          style={{
            border: `1.5px solid ${borderColor}`,
            backgroundColor: disabled ? "var(--muted)" : "var(--card)",
            opacity: disabled ? 0.55 : 1,
            boxShadow: focused ? `0 0 0 3px color-mix(in srgb, var(--ring) 35%, transparent)` : undefined,
          }}
        >
          {/* % badge */}
          <div className="flex items-center justify-center w-10 h-full border-s shrink-0" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--secondary)" }}>
            <Percent size={14} style={{ color: "var(--primary)" }} />
          </div>

          {/* Input */}
          <input
            dir="ltr"
            type="number"
            min={0}
            max={max}
            step={0.1}
            value={value || ""}
            onChange={e => {
              const v = Math.min(max, Math.max(0, parseFloat(e.target.value) || 0));
              onChange(v);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            placeholder="0"
            className="flex-1 px-3 bg-transparent focus:outline-none h-full text-base amount [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{ textAlign: "right", color: "var(--foreground)" }}
          />
        </div>

        {/* Calculated amount */}
        {calculated != null && (
          <div
            className="flex items-center gap-1.5 px-3 h-11 rounded-lg shrink-0"
            style={{ backgroundColor: "var(--warning-muted)", border: "1.5px solid color-mix(in srgb, var(--warning) 25%, transparent)" }}
          >
            <span className="text-xs" style={{ color: "var(--warning)", fontWeight: 500 }}>يساوي</span>
            <span className="text-sm amount" style={{ color: "var(--warning)", fontWeight: 700 }}>
              {formatAmount(String(calculated))}
            </span>
          </div>
        )}
      </div>
    </Field>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UnitConversionRow — live conversion display
// ─────────────────────────────────────────────────────────────────────────────

export function UnitConversionRow({
  fromValue, fromUnit,
  toUnit,
  conversionFactor,
  label,
}: {
  fromValue: number;
  fromUnit: string;
  toUnit: string;
  conversionFactor: number;
  label?: string;
}) {
  const from = getUnit(fromUnit);
  const to = getUnit(toUnit);
  const result = fromValue * conversionFactor;

  return (
    <div>
      {label && <p className="text-sm mb-1.5 text-muted-foreground" style={{ fontWeight: 500 }}>{label}</p>}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ backgroundColor: "var(--accent)", border: "1.5px solid color-mix(in srgb, var(--primary) 15%, transparent)" }}
      >
        <div className="text-right flex-1">
          <span className="text-lg amount" style={{ fontWeight: 700, color: "var(--foreground)" }}>
            {fromValue.toLocaleString("en-US")}
          </span>
          <span className="text-sm ms-2" style={{ color: "var(--muted-foreground)", fontWeight: 500 }}>{from.abbr}</span>
        </div>

        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--primary-muted)" }}>
          <ArrowLeftRight size={14} style={{ color: "var(--primary)" }} />
        </div>

        <div className="text-right flex-1">
          <span className="text-lg amount" style={{ fontWeight: 700, color: "var(--primary)" }}>
            {result.toLocaleString("en-US", { maximumFractionDigits: 4 })}
          </span>
          <span className="text-sm ms-2" style={{ color: "var(--primary)", fontWeight: 500, opacity: 0.75 }}>{to.abbr}</span>
        </div>

        <div
          className="text-xs px-2 py-1 rounded-md shrink-0"
          style={{ backgroundColor: "var(--card)", color: "var(--muted-foreground)", fontWeight: 500 }}
        >
          × {conversionFactor.toLocaleString("en-US", { maximumFractionDigits: 4 })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LineItemRow — qty × unit price = total (interactive)
// ─────────────────────────────────────────────────────────────────────────────

export interface LineItem {
  qty: number;
  unit: string;
  unitPrice: string;
  currency: string;
  discount: number;
}

export function LineItemRow({
  item, onChange, index, currency = "SAR",
}: {
  item: LineItem;
  onChange: (item: LineItem) => void;
  index?: number;
  currency?: string;
}) {
  const curr = CURRENCIES.find(c => c.code === (item.currency || currency)) ?? CURRENCIES[0];
  const price = parseFloat(item.unitPrice) || 0;
  const subtotal = item.qty * price;
  const discountAmt = (subtotal * item.discount) / 100;
  const total = subtotal - discountAmt;

  const [unitOpen, setUnitOpen] = useState(false);
  const unitRef = useRef<HTMLButtonElement>(null);
  const currentUnit = getUnit(item.unit);

  return (
    <div
      className="flex items-center gap-2 p-2 rounded-xl"
      style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}
    >
      {/* Row number */}
      {index != null && (
        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs"
          style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)", fontWeight: 600 }}>
          {index + 1}
        </div>
      )}

      {/* Qty + unit */}
      <div className="flex items-center rounded-lg overflow-hidden shrink-0" style={{ border: "1.5px solid var(--border-strong)", height: "38px", minWidth: "130px" }}>
        <button
          ref={unitRef}
          type="button"
          onClick={() => setUnitOpen(v => !v)}
          className="flex items-center gap-1 px-2.5 h-full border-s shrink-0 hover:bg-muted transition-colors"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--secondary)" }}
        >
          <span className="text-xs" style={{ fontWeight: 600 }}>{currentUnit.abbr}</span>
          <ChevronDown size={9} style={{ color: "var(--muted-foreground)" }} />
        </button>
        <input
          dir="ltr"
          type="number"
          value={item.qty || ""}
          onChange={e => onChange({ ...item, qty: parseFloat(e.target.value) || 0 })}
          placeholder="0"
          className="w-16 px-2 bg-transparent focus:outline-none text-sm amount h-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ textAlign: "right", color: "var(--foreground)" }}
        />
      </div>

      {/* × symbol */}
      <span className="text-muted-foreground text-sm shrink-0">×</span>

      {/* Unit price */}
      <div className="flex items-center rounded-lg overflow-hidden flex-1" style={{ border: "1.5px solid var(--border-strong)", height: "38px", minWidth: "120px" }}>
        <div className="px-2.5 h-full flex items-center border-s shrink-0" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--secondary)" }}>
          <span className="text-xs amount" style={{ fontWeight: 600, color: "var(--primary)" }}>{curr.symbol}</span>
        </div>
        <input
          dir="ltr"
          type="text"
          inputMode="decimal"
          value={item.unitPrice}
          onChange={e => onChange({ ...item, unitPrice: e.target.value.replace(/[^0-9.]/g, "") })}
          placeholder="0.00"
          className="flex-1 px-2 bg-transparent focus:outline-none text-sm amount h-full"
          style={{ textAlign: "right", color: "var(--foreground)" }}
        />
      </div>

      {/* Discount % */}
      <div className="flex items-center rounded-lg overflow-hidden shrink-0" style={{ border: "1.5px solid var(--border-strong)", height: "38px", width: "80px" }}>
        <div className="px-2 h-full flex items-center border-s shrink-0" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--secondary)" }}>
          <Percent size={11} style={{ color: "var(--warning)" }} />
        </div>
        <input
          dir="ltr"
          type="number"
          min={0}
          max={100}
          value={item.discount || ""}
          onChange={e => onChange({ ...item, discount: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)) })}
          placeholder="0"
          className="flex-1 px-2 bg-transparent focus:outline-none text-sm amount h-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ textAlign: "right", color: "var(--foreground)" }}
        />
      </div>

      {/* = Total */}
      <div className="flex flex-col items-end shrink-0" style={{ minWidth: "100px" }}>
        <span className="text-sm amount" style={{ fontWeight: 700, color: "var(--foreground)" }}>
          {curr.symbol} {formatAmount(String(total))}
        </span>
        {item.discount > 0 && (
          <span className="text-[10px] amount" style={{ color: "var(--warning)", textDecoration: "line-through", opacity: 0.7 }}>
            {curr.symbol} {formatAmount(String(subtotal))}
          </span>
        )}
      </div>

      {unitOpen && (
        <UnitDropdown
          value={item.unit}
          onChange={u => { onChange({ ...item, unit: u }); setUnitOpen(false); }}
          triggerRef={unitRef}
          onClose={() => setUnitOpen(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// InvoiceSummary — subtotal / discount / tax / net total block
// ─────────────────────────────────────────────────────────────────────────────

export function InvoiceSummary({
  subtotal,
  currency = "SAR",
  discount = 0, onDiscountChange,
  discountType = "percent", onDiscountTypeChange,
  taxRate = 15, onTaxRateChange,
  taxLabel = "ضريبة القيمة المضافة",
}: {
  subtotal: number;
  currency?: string;
  discount?: number; onDiscountChange?: (v: number) => void;
  discountType?: "percent" | "fixed"; onDiscountTypeChange?: (t: "percent" | "fixed") => void;
  taxRate?: number; onTaxRateChange?: (v: number) => void;
  taxLabel?: string;
}) {
  const curr = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0];
  const discountAmt = discountType === "percent" ? (subtotal * discount) / 100 : discount;
  const afterDiscount = subtotal - discountAmt;
  const taxAmt = (afterDiscount * taxRate) / 100;
  const total = afterDiscount + taxAmt;

  const SummaryRow = ({ label, amount, highlight, muted, strikethrough, sub }: {
    label: React.ReactNode; amount: number; highlight?: boolean; muted?: boolean; strikethrough?: boolean; sub?: boolean;
  }) => (
    <div className={`flex items-center justify-between py-2.5 ${sub ? "px-4" : "px-5"}`}>
      <span className={`text-sm ${sub ? "text-xs" : ""}`} style={{ color: muted ? "var(--muted-foreground)" : "var(--foreground)", fontWeight: muted ? 400 : 500 }}>
        {label}
      </span>
      <span
        className={`amount ${sub ? "text-sm" : "text-sm"}`}
        style={{
          fontWeight: highlight ? 700 : 500,
          color: highlight ? "var(--foreground)" : muted ? "var(--muted-foreground)" : "var(--foreground)",
          textDecoration: strikethrough ? "line-through" : "none",
          opacity: strikethrough ? 0.5 : 1,
        }}
      >
        {curr.symbol} {formatAmount(String(Math.abs(amount)))}
      </span>
    </div>
  );

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid var(--border-strong)", boxShadow: "var(--shadow-card)" }}>
      {/* Subtotal */}
      <SummaryRow label="المجموع الفرعي" amount={subtotal} muted />

      {/* Discount row */}
      <div className="flex items-center justify-between py-2 px-5 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          {onDiscountTypeChange && (
            <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-strong)" }}>
              {(["percent", "fixed"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => onDiscountTypeChange(t)}
                  className="px-2 py-1 text-xs transition-colors"
                  style={{
                    backgroundColor: discountType === t ? "var(--primary)" : "var(--secondary)",
                    color: discountType === t ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    fontWeight: 600,
                  }}
                >
                  {t === "percent" ? "%" : curr.symbol}
                </button>
              ))}
            </div>
          )}
          <span className="text-sm" style={{ fontWeight: 500, color: "var(--foreground)" }}>الخصم</span>
        </div>
        <div className="flex items-center gap-2">
          {onDiscountChange ? (
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1.5px solid var(--border-strong)", height: "32px" }}>
              <div className="px-2 h-full flex items-center border-s" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--secondary)" }}>
                {discountType === "percent" ? <Percent size={11} style={{ color: "var(--warning)" }} /> : <span className="text-xs amount" style={{ color: "var(--warning)", fontWeight: 600 }}>{curr.symbol}</span>}
              </div>
              <input
                dir="ltr"
                type="number"
                min={0}
                max={discountType === "percent" ? 100 : subtotal}
                value={discount || ""}
                onChange={e => onDiscountChange(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-20 px-2 bg-transparent focus:outline-none text-sm amount h-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ textAlign: "right", color: "var(--foreground)" }}
              />
            </div>
          ) : null}
          <span className="text-sm amount" style={{ fontWeight: 500, color: "var(--warning)" }}>
            − {curr.symbol} {formatAmount(String(discountAmt))}
          </span>
        </div>
      </div>

      {/* After discount */}
      {discountAmt > 0 && (
        <div className="flex items-center justify-between px-5 py-1.5" style={{ backgroundColor: "var(--warning-muted)" }}>
          <span className="text-xs" style={{ color: "var(--warning)", fontWeight: 500 }}>بعد الخصم</span>
          <span className="text-sm amount" style={{ color: "var(--warning)", fontWeight: 600 }}>
            {curr.symbol} {formatAmount(String(afterDiscount))}
          </span>
        </div>
      )}

      {/* Tax row */}
      <div className="flex items-center justify-between py-2 px-5 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ fontWeight: 500, color: "var(--foreground)" }}>{taxLabel}</span>
          {onTaxRateChange ? (
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-strong)", height: "26px" }}>
              <input
                dir="ltr"
                type="number"
                min={0}
                max={100}
                value={taxRate}
                onChange={e => onTaxRateChange(parseFloat(e.target.value) || 0)}
                className="w-12 px-1.5 bg-transparent focus:outline-none text-xs amount h-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ textAlign: "center", color: "var(--foreground)" }}
              />
              <div className="px-1.5 h-full flex items-center border-e" style={{ borderColor: "var(--border)", backgroundColor: "var(--secondary)" }}>
                <Percent size={10} style={{ color: "var(--muted-foreground)" }} />
              </div>
            </div>
          ) : (
            <span className="text-xs px-1.5 py-0.5 rounded-md amount" style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)", fontWeight: 600 }}>{taxRate}%</span>
          )}
        </div>
        <span className="text-sm amount" style={{ fontWeight: 500, color: "var(--info)" }}>
          + {curr.symbol} {formatAmount(String(taxAmt))}
        </span>
      </div>

      {/* Grand total */}
      <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--primary-muted)" }}>
        <span className="text-base" style={{ fontWeight: 700, color: "var(--primary)" }}>الإجمالي</span>
        <span className="text-xl amount" style={{ fontWeight: 800, color: "var(--primary)" }}>
          {curr.symbol} {formatAmount(String(total))}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AmountReadonly — formatted display for non-editable totals
// ─────────────────────────────────────────────────────────────────────────────

export function AmountReadonly({
  value, currency = "SAR", size = "md", label, highlight = false,
}: {
  value: number; currency?: string; size?: "sm" | "md" | "lg" | "xl";
  label?: string; highlight?: boolean;
}) {
  const curr = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0];
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-xl", xl: "text-2xl" };
  const symbolSizes = { sm: "text-xs", md: "text-sm", lg: "text-sm", xl: "text-base" };

  return (
    <div className={`space-y-1 ${highlight ? "p-3 rounded-xl" : ""}`}
      style={highlight ? { backgroundColor: "var(--primary-muted)", border: "1.5px solid color-mix(in srgb, var(--primary) 20%, transparent)" } : {}}>
      {label && <p className="text-xs" style={{ color: highlight ? "var(--primary)" : "var(--muted-foreground)", fontWeight: 500 }}>{label}</p>}
      <div className="flex items-baseline gap-1.5 justify-end">
        <span className={`amount ${symbolSizes[size]}`} style={{ color: highlight ? "var(--primary)" : "var(--muted-foreground)", fontWeight: 600 }}>
          {curr.symbol}
        </span>
        <span className={`amount ${sizes[size]}`} style={{ fontWeight: 700, color: highlight ? "var(--primary)" : "var(--foreground)" }}>
          {value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────────────

function DemoCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3>{title}</h3>
        {description && <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export function AmountInputsSection() {
  // ── MoneyInput states ──────────────────────────────────────────────
  const [amount1, setAmount1] = useState("12500");
  const [currency1, setCurrency1] = useState("SAR");
  const [amount2, setAmount2] = useState("850.75");
  const [currency2, setCurrency2] = useState("USD");
  const [amount3, setAmount3] = useState("");

  // ── QuantityInput states ───────────────────────────────────────────
  const [qty1, setQty1] = useState(50);
  const [unit1, setUnit1] = useState("kg");
  const [qty2, setQty2] = useState(3);
  const [unit2, setUnit2] = useState("carton");
  const [qty3, setQty3] = useState(1500);
  const [unit3, setUnit3] = useState("l");

  // ── UnitPrice states ───────────────────────────────────────────────
  const [up1, setUP1] = useState("45.50");
  const [upUnit1, setUPUnit1] = useState("kg");
  const [upCurr1, setUPCurr1] = useState("SAR");
  const [up2, setUP2] = useState("280");
  const [upUnit2, setUPUnit2] = useState("ton");

  // ── Conversion state ───────────────────────────────────────────────
  const [convQty, setConvQty] = useState(2.5);
  const [convFromUnit, setConvFromUnit] = useState("ton");
  const [convToUnit, setConvToUnit] = useState("kg");

  const fromU = getUnit(convFromUnit);
  const toU = getUnit(convToUnit);
  const convFactor = toU.factor !== 0 ? fromU.factor / toU.factor : 1;

  // ── Line items state ───────────────────────────────────────────────
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { qty: 10, unit: "carton", unitPrice: "180", currency: "SAR", discount: 0 },
    { qty: 250, unit: "kg", unitPrice: "12.50", currency: "SAR", discount: 5 },
    { qty: 4, unit: "pallet", unitPrice: "3200", currency: "SAR", discount: 10 },
  ]);

  const lineSubtotal = lineItems.reduce((acc, item) => {
    const p = parseFloat(item.unitPrice) || 0;
    const disc = (item.qty * p * item.discount) / 100;
    return acc + item.qty * p - disc;
  }, 0);

  // ── Summary states ─────────────────────────────────────────────────
  const [summaryDiscount, setSummaryDiscount] = useState(5);
  const [summaryDiscountType, setSummaryDiscountType] = useState<"percent" | "fixed">("percent");
  const [summaryTax, setSummaryTax] = useState(15);

  // ── Percentage states ──────────────────────────────────────────────
  const [pct1, setPct1] = useState(15);
  const [pct2, setPct2] = useState(5);
  const baseForPct = 24800;

  // ── Readonly display states ────────────────────────────────────────
  const readonlyVals = [
    { label: "إجمالي المبيعات", val: 248500, highlight: false },
    { label: "المبالغ المحصّلة", val: 186375, highlight: false },
    { label: "صافي الأرباح", val: 62125, highlight: true },
  ];

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-foreground mb-1">المدخلات المالية والكميات</h1>
        <p className="text-muted-foreground">
          حقول متخصصة للمبالغ والكميات والوحدات والتحويلات — مصممة لاحتياجات شركات التجارة والمحاسبة
        </p>
      </div>

      {/* ── 1. Money Input ─────────────────────────────────────────── */}
      <DemoCard
        title="حقل المبلغ"
        description="مدخل المبالغ المالية — تنسيق تلقائي، اختيار العملة، حالات متعددة"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <MoneyInput
            value={amount1}
            onChange={setAmount1}
            currency={currency1}
            onCurrencyChange={setCurrency1}
            label="المبلغ الإجمالي"
            hint="اضغط على رمز العملة لتغييرها"
            required
          />
          <MoneyInput
            value={amount2}
            onChange={setAmount2}
            currency={currency2}
            onCurrencyChange={setCurrency2}
            label="المبلغ بالعملة الأجنبية"
          />
          <MoneyInput
            value={amount3}
            onChange={setAmount3}
            currency="SAR"
            label="حقل فارغ"
            placeholder="أدخل المبلغ..."
          />
          <MoneyInput
            value="99500"
            onChange={() => {}}
            currency="SAR"
            label="عرض للقراءة فقط"
            readOnly
            hint="لا يمكن تعديل هذا الحقل"
          />
          <MoneyInput
            value="15000"
            onChange={() => {}}
            currency="SAR"
            label="حقل معطّل"
            disabled
          />
          <MoneyInput
            value={amount3}
            onChange={setAmount3}
            currency="SAR"
            label="حالة خطأ"
            error="المبلغ يتجاوز الحد المسموح به"
          />
        </div>

        {/* Size variants */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4" style={{ fontWeight: 500 }}>أحجام الحقل</p>
          <div className="flex flex-col gap-3 max-w-xs">
            <MoneyInput value="1500" onChange={() => {}} currency="SAR" size="sm" />
            <MoneyInput value="25000" onChange={() => {}} currency="SAR" size="md" />
            <MoneyInput value="480000" onChange={() => {}} currency="SAR" size="lg" />
          </div>
        </div>
      </DemoCard>

      {/* ── 2. Quantity Input ───────────────────────────────────────── */}
      <DemoCard
        title="حقل الكمية"
        description="إدخال الكميات مع اختيار الوحدة — وزن، عدد، حجم، طول — وأزرار التحكم السريع"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <QuantityInput
            value={qty1}
            onChange={setQty1}
            unit={unit1}
            onUnitChange={setUnit1}
            label="الكمية (مع تغيير الوحدة)"
            hint="اضغط على الوحدة لتغييرها"
            min={0}
            step={0.5}
          />
          <QuantityInput
            value={qty2}
            onChange={setQty2}
            unit={unit2}
            onUnitChange={setUnit2}
            label="كمية الكراتين"
            min={1}
            max={999}
            step={1}
          />
          <QuantityInput
            value={qty3}
            onChange={setQty3}
            unit={unit3}
            onUnitChange={setUnit3}
            label="الحجم"
            min={0}
            step={50}
          />
          <QuantityInput
            value={100}
            onChange={() => {}}
            unit="pcs"
            label="بدون أزرار تحكم"
            showStepper={false}
          />
          <QuantityInput
            value={0}
            onChange={() => {}}
            unit="kg"
            label="حقل معطّل"
            disabled
          />
          <QuantityInput
            value={qty1}
            onChange={setQty1}
            unit={unit1}
            onUnitChange={setUnit1}
            label="حالة خطأ"
            error="الكمية أقل من الحد الأدنى المطلوب"
          />
        </div>
      </DemoCard>

      {/* ── 3. Unit Price ──────────────────────────────────────────── */}
      <DemoCard
        title="سعر الوحدة"
        description="مدخل السعر لكل وحدة — مناسب لفواتير المواد والبضائع"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <UnitPriceInput
            price={up1}
            onPriceChange={setUP1}
            unit={upUnit1}
            onUnitChange={setUPUnit1}
            currency={upCurr1}
            onCurrencyChange={setUPCurr1}
            label="سعر الكيلوغرام"
            hint="اضغط على الوحدة أو العملة لتغييرها"
          />
          <UnitPriceInput
            price={up2}
            onPriceChange={setUP2}
            unit={upUnit2}
            onUnitChange={setUPUnit2}
            currency="SAR"
            label="سعر الطن"
          />
          <UnitPriceInput
            price="5500"
            onPriceChange={() => {}}
            unit="pallet"
            currency="SAR"
            label="سعر ثابت — للقراءة فقط"
            disabled
          />
          <UnitPriceInput
            price="0"
            onPriceChange={() => {}}
            unit="carton"
            currency="SAR"
            label="حالة خطأ"
            error="يجب أن يكون السعر أكبر من صفر"
          />
        </div>
      </DemoCard>

      {/* ── 4. Percentage Input ────────────────────────────────────── */}
      <DemoCard
        title="مدخل النسبة المئوية"
        description="للخصومات والضرائب والعمولات — مع حساب المبلغ المعادل تلقائياً"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <PercentageInput
            value={pct1}
            onChange={setPct1}
            baseAmount={baseForPct}
            label={`ضريبة القيمة المضافة (الأساس: ${baseForPct.toLocaleString("en-US")} ر.س)`}
            hint="المبلغ المعادل يحسب تلقائياً"
          />
          <PercentageInput
            value={pct2}
            onChange={setPct2}
            baseAmount={baseForPct}
            label="نسبة الخصم"
            max={50}
          />
          <PercentageInput
            value={20}
            onChange={() => {}}
            label="بدون مبلغ معادل"
          />
          <PercentageInput
            value={15}
            onChange={() => {}}
            baseAmount={baseForPct}
            label="حقل معطّل"
            disabled
          />
        </div>
      </DemoCard>

      {/* ── 5. Unit Conversion ─────────────────────────────────────── */}
      <DemoCard
        title="تحويل الوحدات"
        description="عرض تفاعلي لتحويل الكميات بين الوحدات — مفيد في فواتير المواد الخام"
      >
        <div className="space-y-4">
          {/* Interactive conversion */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <QuantityInput
              value={convQty}
              onChange={setConvQty}
              unit={convFromUnit}
              onUnitChange={setConvFromUnit}
              label="الكمية المدخلة"
              min={0}
              step={0.1}
            />
            <QuantityInput
              value={0}
              onChange={() => {}}
              unit={convToUnit}
              onUnitChange={setConvToUnit}
              label="وحدة التحويل إليها"
              showStepper={false}
            />
          </div>

          <UnitConversionRow
            fromValue={convQty}
            fromUnit={convFromUnit}
            toUnit={convToUnit}
            conversionFactor={convFactor}
          />

          {/* Static examples */}
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-3" style={{ fontWeight: 500 }}>أمثلة ثابتة شائعة في التجارة</p>
            <div className="space-y-2">
              <UnitConversionRow fromValue={1} fromUnit="ton" toUnit="kg" conversionFactor={1000} />
              <UnitConversionRow fromValue={1} fromUnit="carton" toUnit="pcs" conversionFactor={24} label="" />
              <UnitConversionRow fromValue={1} fromUnit="m3" toUnit="l" conversionFactor={1000} />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* ── 6. Line Items ──────────────────────────────────────────── */}
      <DemoCard
        title="أسطر الفاتورة"
        description="كل سطر: كمية × وحدة × سعر الوحدة − خصم = إجمالي السطر"
      >
        <div className="space-y-2 mb-4">
          {/* Column headers */}
          <div className="flex items-center gap-2 px-2 pb-1">
            <div className="w-6 shrink-0" />
            <div className="shrink-0" style={{ minWidth: "130px" }}>
              <span className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>الكمية / الوحدة</span>
            </div>
            <div className="w-4 shrink-0" />
            <div className="flex-1" style={{ minWidth: "120px" }}>
              <span className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>سعر الوحدة</span>
            </div>
            <div className="shrink-0" style={{ width: "80px" }}>
              <span className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>خصم %</span>
            </div>
            <div className="shrink-0 text-left" style={{ minWidth: "100px" }}>
              <span className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>الإجمالي</span>
            </div>
          </div>

          {lineItems.map((item, i) => (
            <LineItemRow
              key={i}
              index={i}
              item={item}
              onChange={updated => setLineItems(prev => prev.map((it, idx) => idx === i ? updated : it))}
              currency="SAR"
            />
          ))}
        </div>

        {/* Line totals bar */}
        <div className="flex items-center justify-between px-5 py-3 rounded-xl" style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border-strong)" }}>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{lineItems.length} أصناف</span>
            <span className="text-sm text-muted-foreground">
              {lineItems.reduce((s, i) => s + i.qty, 0).toLocaleString("en-US")} وحدة إجمالاً
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">مجموع الأسطر:</span>
            <span className="text-base amount" style={{ fontWeight: 700, color: "var(--foreground)" }}>
              ر.س {formatAmount(String(lineSubtotal))}
            </span>
          </div>
        </div>
      </DemoCard>

      {/* ── 7. Invoice Summary ─────────────────────────────────────── */}
      <DemoCard
        title="ملخص الفاتورة"
        description="المجموع الفرعي + الخصم + الضريبة = الإجمالي النهائي — متصل بأسطر الفاتورة"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
          <InvoiceSummary
            subtotal={lineSubtotal}
            currency="SAR"
            discount={summaryDiscount}
            onDiscountChange={setSummaryDiscount}
            discountType={summaryDiscountType}
            onDiscountTypeChange={setSummaryDiscountType}
            taxRate={summaryTax}
            onTaxRateChange={setSummaryTax}
          />

          {/* Read-only totals */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground" style={{ fontWeight: 500 }}>عرض المبالغ — للقراءة فقط</p>
            <div className="grid grid-cols-3 gap-3">
              {readonlyVals.map(r => (
                <AmountReadonly key={r.label} value={r.val} currency="SAR" label={r.label} highlight={r.highlight} />
              ))}
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>أحجام العرض</p>
              <div className="flex flex-wrap items-baseline gap-4">
                <AmountReadonly value={1500} currency="SAR" size="sm" label="صغير" />
                <AmountReadonly value={24800} currency="SAR" size="md" label="متوسط" />
                <AmountReadonly value={248000} currency="SAR" size="lg" label="كبير" />
                <AmountReadonly value={1248000} currency="SAR" size="xl" label="كبير جداً" highlight />
              </div>
            </div>
          </div>
        </div>
      </DemoCard>

    </div>
  );
}
