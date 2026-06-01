import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

type Direction = "rtl" | "ltr" | "auto";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface UserOption {
  value: string;
  name: string;
  role?: string;
  initials: string;
  color?: string;
}

export interface AccountOption {
  value: string;
  name: string;
  number: string;
  type: string;
  balance?: string;
}

const inputBase =
  "w-full h-10 px-3 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm";

function getTextAlignClass(dir: Direction) {
  return dir === "ltr" ? "text-left" : "text-right";
}

function useOutsideClick(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    function listener(e: MouseEvent) {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

function DropdownPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute top-full mt-1.5 w-full z-50 bg-card border border-border rounded-xl overflow-hidden"
      style={{ boxShadow: "var(--shadow-popover)" }}
    >
      {children}
    </div>
  );
}

function DropdownSearch({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="p-2 border-b border-border">
      <div className="relative">
        <Search size={13} className="absolute top-1/2 -translate-y-1/2 start-2.5 text-muted-foreground pointer-events-none" />
        <input
          className="w-full h-8 ps-8 pe-3 rounded-lg bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoFocus
        />
      </div>
    </div>
  );
}

function EmptyState({ text = "No results" }: { text?: string }) {
  return <p className="text-sm text-muted-foreground text-center py-5">{text}</p>;
}

export interface SearchableDropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  dir?: Direction;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results",
  dir = "auto",
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null!);
  useOutsideClick(ref, () => { setOpen(false); setSearch(""); });

  const selected = options.find(o => o.value === value);
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative" dir={dir}>
      <button
        type="button"
        className={`${inputBase} flex items-center justify-between gap-2 cursor-pointer`}
        onClick={() => setOpen(!open)}
      >
        <span className={`${selected ? "text-foreground" : "text-muted-foreground"} ${getTextAlignClass(dir)} flex-1`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className={`text-muted-foreground shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <DropdownPanel>
          <DropdownSearch value={search} onChange={setSearch} placeholder={searchPlaceholder} />
          <div className="max-h-52 overflow-y-auto py-1 dropdown-scroll">
            {filtered.length === 0 ? <EmptyState text={emptyText} /> : filtered.map(o => (
              <button
                key={o.value}
                type="button"
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors ${getTextAlignClass(dir)}`}
                onClick={() => { onChange?.(o.value); setOpen(false); setSearch(""); }}
              >
                <span>{o.label}</span>
                {value === o.value && <Check size={14} className="text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}

export interface MultiSelectDropdownProps {
  options: DropdownOption[];
  value?: string[];
  onChange?: (v: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  clearAllLabel?: string;
  selectedCountText?: (count: number) => string;
  dir?: Direction;
}

export function MultiSelectDropdown({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results",
  clearAllLabel = "Clear all",
  selectedCountText = (count) => `${count} selected`,
  dir = "auto",
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null!);
  useOutsideClick(ref, () => { setOpen(false); setSearch(""); });

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (val: string) => {
    onChange?.(value.includes(val) ? value.filter(v => v !== val) : [...value, val]);
  };

  const remove = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(value.filter(v => v !== val));
  };

  return (
    <div ref={ref} className="relative" dir={dir}>
      <div
        className={`min-h-10 px-3 py-1.5 rounded-lg border border-border bg-input-background flex flex-wrap items-center gap-1.5 cursor-pointer transition-all ${open ? "ring-2 ring-ring border-transparent" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {value.length === 0 ? (
          <span className={`text-sm text-muted-foreground flex-1 ${getTextAlignClass(dir)}`}>{placeholder}</span>
        ) : (
          value.map(v => {
            const opt = options.find(o => o.value === v);
            return opt ? (
              <span key={v} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-md font-medium">
                {opt.label}
                <button type="button" onClick={e => remove(v, e)} className="hover:opacity-70 transition-opacity">
                  <X size={10} />
                </button>
              </span>
            ) : null;
          })
        )}
        <ChevronDown size={14} className={`text-muted-foreground ms-auto shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <DropdownPanel>
          <DropdownSearch value={search} onChange={setSearch} placeholder={searchPlaceholder} />
          <div className="max-h-52 overflow-y-auto py-1 dropdown-scroll">
            {filtered.length === 0 ? <EmptyState text={emptyText} /> : filtered.map(o => {
              const checked = value.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors ${getTextAlignClass(dir)}`}
                  onClick={() => toggle(o.value)}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-primary border-primary" : "border-border bg-input-background"}`}>
                    {checked && <Check size={10} strokeWidth={3} className="text-white" />}
                  </div>
                  <span>{o.label}</span>
                </button>
              );
            })}
          </div>
          {value.length > 0 && (
            <div className="border-t border-border px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{selectedCountText(value.length)}</span>
              <button type="button" className="text-xs text-destructive hover:underline" onClick={() => onChange?.([])}>
                {clearAllLabel}
              </button>
            </div>
          )}
        </DropdownPanel>
      )}
    </div>
  );
}

function UserAvatar({ initials, color, size = "md" }: { initials: string; color?: string; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";
  return (
    <div className={`${sz} rounded-full ${color ?? "bg-primary"} flex items-center justify-center text-white shrink-0`} style={{ fontWeight: 600 }}>
      {initials}
    </div>
  );
}

export interface UserDropdownProps {
  options: UserOption[];
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  dir?: Direction;
}

export function UserDropdown({
  options,
  value,
  onChange,
  placeholder = "Select user...",
  searchPlaceholder = "Search users...",
  emptyText = "No results",
  dir = "auto",
}: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null!);
  useOutsideClick(ref, () => { setOpen(false); setSearch(""); });

  const selected = options.find(o => o.value === value);
  const filtered = options.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
    || o.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative" dir={dir}>
      <button
        type="button"
        className={`${inputBase} flex items-center gap-2.5 cursor-pointer`}
        onClick={() => setOpen(!open)}
      >
        {selected ? (
          <>
            <UserAvatar initials={selected.initials} color={selected.color} size="sm" />
            <span className={`flex-1 ${getTextAlignClass(dir)} text-foreground text-sm`}>{selected.name}</span>
            {selected.role && <span className="text-xs text-muted-foreground">{selected.role}</span>}
          </>
        ) : (
          <span className={`flex-1 ${getTextAlignClass(dir)} text-muted-foreground`}>{placeholder}</span>
        )}
        <ChevronDown size={14} className={`text-muted-foreground shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <DropdownPanel>
          <DropdownSearch value={search} onChange={setSearch} placeholder={searchPlaceholder} />
          <div className="max-h-60 overflow-y-auto py-1 dropdown-scroll">
            {filtered.length === 0 ? <EmptyState text={emptyText} /> : filtered.map(o => (
              <button
                key={o.value}
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors"
                onClick={() => { onChange?.(o.value); setOpen(false); setSearch(""); }}
              >
                <UserAvatar initials={o.initials} color={o.color} />
                <div className={`flex-1 min-w-0 ${getTextAlignClass(dir)}`}>
                  <p className="text-sm text-foreground leading-tight">{o.name}</p>
                  {o.role && <p className="text-xs text-muted-foreground mt-0.5">{o.role}</p>}
                </div>
                {value === o.value && <Check size={14} className="text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}

export interface AccountDropdownProps {
  options: AccountOption[];
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  typeIconMap?: Record<string, string>;
  dir?: Direction;
}

export function AccountDropdown({
  options,
  value,
  onChange,
  placeholder = "Select account...",
  searchPlaceholder = "Search account name or number...",
  emptyText = "No results",
  typeIconMap = {},
  dir = "auto",
}: AccountDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null!);
  useOutsideClick(ref, () => { setOpen(false); setSearch(""); });

  const selected = options.find(o => o.value === value);
  const filtered = options.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
    || o.number.toLowerCase().includes(search.toLowerCase())
    || o.type.toLowerCase().includes(search.toLowerCase())
  );

  const typeIcon = (type: string) => typeIconMap[type] ?? type.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative" dir={dir}>
      <button
        type="button"
        className={`${inputBase} flex items-center gap-2.5 cursor-pointer`}
        onClick={() => setOpen(!open)}
      >
        {selected ? (
          <>
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary text-xs" style={{ fontWeight: 700 }}>
                {typeIcon(selected.type)}
              </span>
            </div>
            <span className={`flex-1 ${getTextAlignClass(dir)} text-foreground text-sm`}>{selected.name}</span>
            <span className="text-xs text-muted-foreground font-mono">{selected.number}</span>
          </>
        ) : (
          <span className={`flex-1 ${getTextAlignClass(dir)} text-muted-foreground`}>{placeholder}</span>
        )}
        <ChevronDown size={14} className={`text-muted-foreground shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <DropdownPanel>
          <DropdownSearch value={search} onChange={setSearch} placeholder={searchPlaceholder} />
          <div className="max-h-60 overflow-y-auto py-1 dropdown-scroll">
            {filtered.length === 0 ? <EmptyState text={emptyText} /> : filtered.map(o => (
              <button
                key={o.value}
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors"
                onClick={() => { onChange?.(o.value); setOpen(false); setSearch(""); }}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary text-sm" style={{ fontWeight: 700 }}>
                    {typeIcon(o.type)}
                  </span>
                </div>
                <div className={`flex-1 min-w-0 ${getTextAlignClass(dir)}`}>
                  <p className="text-sm text-foreground leading-tight">{o.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <span className="font-mono">{o.number}</span>
                    <span className="mx-1">·</span>
                    {o.type}
                  </p>
                </div>
                <div className="text-left shrink-0 flex flex-col items-end gap-0.5">
                  {o.balance && (
                    <span className="text-sm text-foreground amount" style={{ fontWeight: 500 }}>{o.balance}</span>
                  )}
                  {value === o.value && <Check size={13} className="text-primary" />}
                </div>
              </button>
            ))}
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}
