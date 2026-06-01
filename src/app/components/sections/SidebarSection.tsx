import { useState, useRef, useEffect, useCallback } from "react";
import type { ComponentType, CSSProperties } from "react";
import { createPortal } from "react-dom";
import {
  LayoutDashboard, FileText, ShoppingCart, TrendingUp, Users, Truck,
  Landmark, BookOpen, BarChart2, Settings, Search, Bell,
  Package, Wallet, ChevronDown, LogOut, Home, ChevronLeft,
  MoreHorizontal, Receipt, TrendingDown, Plus, Palette,
  Keyboard, HelpCircle, Trash2, CheckCircle2, Building2,
  MoreVertical,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Breadcrumb
// ─────────────────────────────────────────────────────────────────────────────

type BreadcrumbSep = "chevron" | "slash" | "dot";
interface BCItem {
  label: string;
  icon?: ComponentType<{ size?: string | number; className?: string }>;
  badge?: number;
  href?: string;
}

function BCSeparator({ type }: { type: BreadcrumbSep }) {
  if (type === "slash")
    return <span className="select-none mx-1.5" style={{ color: "var(--muted-foreground)", opacity: 0.4 }}>/</span>;
  if (type === "dot")
    return <span className="mx-2 w-1 h-1 rounded-full shrink-0 inline-block" style={{ backgroundColor: "var(--muted-foreground)", opacity: 0.35 }} />;
  return <ChevronLeft size={12} className="shrink-0 mx-0.5" style={{ color: "var(--muted-foreground)", opacity: 0.35 }} />;
}

function BCItem({ item, isLast }: { item: BCItem; isLast: boolean }) {
  const cls = "flex items-center gap-1.5 text-sm leading-none transition-colors";
  const badge = item.badge != null ? (
    <span className={`inline-flex items-center justify-center h-[18px] px-1.5 rounded-full text-[10px] ms-1 ${isLast ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`} style={{ fontWeight: 600 }}>
      {item.badge}
    </span>
  ) : null;
  if (isLast) return <span className={`${cls} text-foreground`} style={{ fontWeight: 500 }}>{item.icon && <item.icon size={13} />}<span>{item.label}</span>{badge}</span>;
  return <a href={item.href ?? "#"} onClick={e => e.preventDefault()} className={`${cls} text-muted-foreground hover:text-foreground`}>{item.icon && <item.icon size={13} />}<span>{item.label}</span>{badge}</a>;
}

export function Breadcrumb({ items, separator = "chevron", maxVisible }: { items: BCItem[]; separator?: BreadcrumbSep; maxVisible?: number }) {
  const [expanded, setExpanded] = useState(false);
  const shouldCollapse = maxVisible != null && items.length > maxVisible && !expanded;
  const visible: (BCItem | "ellipsis")[] = shouldCollapse ? [items[0], "ellipsis", items[items.length - 1]] : items;
  return (
    <nav className="flex items-center flex-wrap gap-0" aria-label="breadcrumb">
      {visible.map((item, i) => {
        const isLast = i === visible.length - 1;
        if (item === "ellipsis") return (
          <span key="ellipsis" className="flex items-center">
            <button onClick={() => setExpanded(true)} className="flex items-center px-1.5 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <MoreHorizontal size={14} />
            </button>
            <BCSeparator type={separator} />
          </span>
        );
        return (
          <span key={i} className="flex items-center">
            <BCItem item={item} isLast={isLast} />
            {!isLast && <BCSeparator type={separator} />}
          </span>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav data
// ─────────────────────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    id: "main", label: null, defaultOpen: true,
    items: [
      { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
      { id: "notif", label: "الإشعارات", icon: Bell, badge: 4 },
      { id: "reports", label: "التقارير", icon: BarChart2 },
    ],
  },
  {
    id: "operations", label: "العمليات", defaultOpen: true,
    items: [
      { id: "invoices", label: "الفواتير", icon: FileText, badge: 3 },
      { id: "sales", label: "المبيعات", icon: TrendingUp },
      { id: "purchases", label: "المشتريات", icon: ShoppingCart },
      { id: "expenses", label: "المصروفات", icon: Wallet },
    ],
  },
  {
    id: "parties", label: "الأطراف", defaultOpen: true,
    items: [
      { id: "customers", label: "العملاء", icon: Users },
      { id: "suppliers", label: "الموردين", icon: Truck },
    ],
  },
  {
    id: "accounting", label: "المحاسبة", defaultOpen: false,
    items: [
      { id: "banks", label: "الخزنة والبنوك", icon: Landmark },
      { id: "journal", label: "القيود اليومية", icon: BookOpen },
      { id: "accounts", label: "دليل الحسابات", icon: Package },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// User menu popup — rendered in a portal, positioned to the LEFT of the sidebar
// with the sidebar z-index higher so the menu appears to slide from behind it
// ─────────────────────────────────────────────────────────────────────────────

interface UserMenuItem {
  id: string;
  label: string;
  icon: ComponentType<{ size?: string | number; className?: string; style?: CSSProperties }>;
  shortcut?: string;
  danger?: boolean;
}

interface UserMenuGroup {
  items: UserMenuItem[];
}

const USER_MENU_GROUPS: UserMenuGroup[] = [
  {
    items: [
      { id: "themes", label: "المظاهر", icon: Palette, shortcut: "Ctrl+T" },
      { id: "settings", label: "الإعدادات", icon: Settings, shortcut: "Ctrl+S" },
      { id: "notifs", label: "الإشعارات", icon: Bell, shortcut: "Ctrl+N" },
    ]
  },
  {
    items: [
      { id: "shortcuts", label: "اختصارات لوحة المفاتيح", icon: Keyboard },
      { id: "help", label: "المساعدة", icon: HelpCircle },
    ]
  },
  {
    items: [
      { id: "trash", label: "سلة المحذوفات", icon: Trash2, danger: false },
      { id: "logout", label: "تسجيل الخروج", icon: LogOut, danger: true },
    ]
  },
];

interface UserMenuPosition {
  top: number;
  right: number; // distance from right edge of viewport
}

function UserMenuPortal({ pos, onClose }: { pos: UserMenuPosition; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 60);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      dir="rtl"
      ref={ref}
      style={{
        position: "fixed",
        top: pos.top,
        right: pos.right,
        width: "240px",
        zIndex: 9990,
        fontFamily: "var(--font-family)",
        boxShadow: "var(--shadow-modal)",
        animation: "ctx-in 0.18s cubic-bezier(0.16,1,0.3,1) both",
      }}
      className="bg-card rounded-2xl border border-border py-1.5"
    >
      {/* User header */}
      <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border mb-1">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-xs" style={{ fontWeight: 700 }}>أح</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate" style={{ fontWeight: 600 }}>أحمد محمد</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
            <p className="text-xs text-muted-foreground">متصل الآن</p>
          </div>
        </div>
      </div>

      {USER_MENU_GROUPS.map((group, gi) => (
        <div key={gi}>
          {gi > 0 && <div className="my-1 border-t border-border" />}
          <div className="px-1.5">
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={onClose}
                className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-sm text-right hover:bg-muted transition-colors"
                style={{ color: item.danger ? "var(--destructive)" : "var(--foreground)", fontWeight: 500, minHeight: "34px" }}
              >
                <item.icon
                  size={15}
                  className="shrink-0"
                  style={{ color: item.danger ? "var(--destructive)" : "var(--muted-foreground)" }}
                />
                <span className="flex-1 text-right">{item.label}</span>
                {item.shortcut && (
                  <kbd className="text-[10.5px] px-1.5 py-0.5 rounded-md border border-border amount"
                    style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)", fontFamily: "var(--font-family)", fontWeight: 500 }}>
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon tooltip wrapper
// ─────────────────────────────────────────────────────────────────────────────

function IconBtn({
  icon: Icon, label, active, badge, onClick,
}: {
  icon: React.ElementType; label: string; active?: boolean; badge?: number; onClick?: () => void;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group"
      style={{
        backgroundColor: active ? "var(--primary-muted)" : "transparent",
        color: active ? "var(--primary)" : "var(--muted-foreground)",
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
    >
      <Icon size={17} />
      {badge ? (
        <span className="absolute top-1 end-1 w-[14px] h-[14px] rounded-full text-white flex items-center justify-center"
          style={{ backgroundColor: "var(--destructive)", fontSize: "9px", fontWeight: 700 }}>
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar demo
// ─────────────────────────────────────────────────────────────────────────────

const ICON_RAIL_W = 56;
const NAV_PANEL_W = 220;

function SidebarDemo({ collapsed }: { collapsed: boolean }) {
  const [active, setActive] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [userMenuPos, setUserMenuPos] = useState<UserMenuPosition | null>(null);
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(NAV_GROUPS.filter(g => g.defaultOpen).map(g => g.id))
  );

  const sidebarRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const toggleGroup = (id: string) =>
    setOpenGroups(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // Compute position so popup appears to the LEFT of the sidebar
  // The sidebar has z-index: 9995 so it visually sits in front of the popup
  const openUserMenu = useCallback(() => {
    if (!sidebarRef.current || !footerRef.current) return;

    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const footerRect = footerRef.current.getBoundingClientRect();

    const POPUP_W = 240;
    const POPUP_H = 360; // approximate
    const MARGIN = 8;

    // Place popup to the LEFT of the sidebar (content side in RTL)
    const rightFromViewport = window.innerWidth - sidebarRect.left + MARGIN;

    // Vertically align bottom of popup near the footer, then clamp
    let top = footerRect.top - POPUP_H + footerRect.height;
    top = Math.max(MARGIN, Math.min(top, window.innerHeight - POPUP_H - MARGIN));

    // Edge case: if popup would clip right side (unlikely in RTL but guard anyway)
    const clampedRight = Math.min(rightFromViewport, window.innerWidth - POPUP_W - MARGIN);

    setUserMenuPos({ top, right: clampedRight });
  }, []);

  const closeUserMenu = useCallback(() => setUserMenuPos(null), []);

  const filtered = search.trim()
    ? NAV_GROUPS.map(g => ({ ...g, items: g.items.filter(i => i.label.includes(search)) })).filter(g => g.items.length > 0)
    : NAV_GROUPS;

  const allItems = NAV_GROUPS.flatMap(g => g.items);

  return (
    <>
      <div
        ref={sidebarRef}
        dir="rtl"
        className="flex h-full shrink-0 border-s"
        style={{
          borderColor: "var(--border)",
          // width: `${ICON_RAIL_W + NAV_PANEL_W}px`,
          position: "relative",
          zIndex: 9995, // sidebar stays in FRONT of the user popup
        }}
      >

        {/* ── Nav panel (to the left of icon rail in RTL) ─── */}
        {collapsed && (
          <div
            className="flex flex-col items-center h-full shrink-0 border-s"
            style={{
              // width: `${ICON_RAIL_W}px`,
              backgroundColor: "var(--secondary)",
              borderColor: "var(--border)",
            }}
          >
            {/* App logo */}
            <div className="flex items-center justify-center h-14 w-full border-b shrink-0" style={{ borderColor: "var(--border)" }}>
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white text-sm" style={{ fontWeight: 700 }}>ق</span>
              </div>
            </div>

            {/* Quick-access icons */}
            <div className="flex-1 flex flex-col items-center py-2 gap-0.5 overflow-y-auto sidebar-scroll w-full px-2">
              {allItems.map(item => (
                <IconBtn
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={active === item.id}
                  badge={"badge" in item ? item.badge : undefined}
                  onClick={() => setActive(item.id)}
                />
              ))}
            </div>

            {/* Footer icons */}
            <div className="shrink-0 flex flex-col items-center pb-3 pt-2 gap-1 border-t w-full px-2" style={{ borderColor: "var(--border)" }}>
              <IconBtn icon={Settings} label="الإعدادات" />
              {/* User avatar — opens user menu */}
              <button
                title="أحمد محمد"
                onClick={openUserMenu}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center transition-all hover:ring-2 hover:ring-primary/30"
              >
                <span className="text-white text-[10px]" style={{ fontWeight: 700 }}>أح</span>
              </button>
            </div>
          </div>
        )}
        {!collapsed && (
          <div
            className="flex flex-col h-full"
            style={{
              width: `${NAV_PANEL_W}px`,
              backgroundColor: "var(--card)",
              borderRight: "1px solid var(--border)",
            }}
          >
            {/* Header */}
            <div className="flex items-center h-14 px-4 border-b shrink-0 gap-2" style={{ borderColor: "var(--border)" }}>
              <Building2 size={14} className="text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--foreground)", fontWeight: 600 }}>قبس</p>
                <p className="text-[11px] truncate" style={{ color: "var(--muted-foreground)" }}>شركة النور للتجارة</p>
              </div>
              <button className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0">
                <MoreVertical size={13} />
              </button>
            </div>

            {/* Search */}
            <div className="px-3 pt-3 pb-1 shrink-0">
              <div className="relative">
                <Search size={13} className="absolute top-1/2 -translate-y-1/2 end-2.5 text-muted-foreground pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full h-8 ps-3 pe-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="بحث..."
                  style={{ backgroundColor: "var(--muted)", border: "1px solid transparent", color: "var(--foreground)" }}
                />
                <kbd className="absolute top-1/2 -translate-y-1/2 start-2 text-[10px] px-1 py-0.5 rounded border border-border amount pointer-events-none"
                  style={{ backgroundColor: "var(--card)", color: "var(--muted-foreground)", fontFamily: "var(--font-family)", fontWeight: 500 }}>
                  K
                </kbd>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-1 px-2 sidebar-scroll space-y-px">
              {filtered.map((group) => {
                const isOpen = openGroups.has(group.id);
                return (
                  <div key={group.id}>
                    {/* Group label */}
                    {group.label && (
                      <div className="flex items-center group/grp mt-3 mb-0.5 px-1.5">
                        <button onClick={() => toggleGroup(group.id)} className="flex items-center gap-1.5 flex-1">
                          <ChevronDown size={11} style={{ color: "var(--muted-foreground)", transition: "transform 0.18s", transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }} />
                          <span className="text-xs flex-1 text-right" style={{ color: "var(--muted-foreground)", fontWeight: 600 }}>{group.label}</span>
                        </button>
                        <button className="w-5 h-5 rounded-md flex items-center justify-center opacity-0 group-hover/grp:opacity-100 transition-opacity hover:bg-muted text-muted-foreground">
                          <Plus size={11} />
                        </button>
                      </div>
                    )}

                    {/* Items */}
                    <div style={{ overflow: "hidden", maxHeight: isOpen ? "500px" : "0", transition: "max-height 0.2s ease" }}>
                      {group.items.map(item => {
                        const isActive = active === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-right transition-all"
                            style={{
                              backgroundColor: isActive ? "var(--primary-muted)" : "transparent",
                              color: isActive ? "var(--primary)" : "var(--foreground)",
                              fontWeight: isActive ? 600 : 400,
                            }}
                            onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"; }}
                            onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                          >
                            <item.icon size={15} className="shrink-0" style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }} />
                            <span className="flex-1 text-right">{item.label}</span>
                            {"badge" in item && item.badge ? (
                              <span className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] flex items-center justify-center shrink-0"
                                style={{ backgroundColor: isActive ? "var(--primary)" : "var(--destructive)", color: "#fff", fontWeight: 600 }}>
                                {item.badge}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Footer — user profile row */}
            <div ref={footerRef} className="shrink-0 border-t px-2 py-2" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={openUserMenu}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all"
                style={{ backgroundColor: userMenuPos ? "var(--muted)" : "transparent" }}
                onMouseEnter={e => { if (!userMenuPos) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--muted)"; }}
                onMouseLeave={e => { if (!userMenuPos) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px]" style={{ fontWeight: 700 }}>أح</span>
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs leading-tight truncate" style={{ color: "var(--foreground)", fontWeight: 600 }}>أحمد محمد</p>
                  <p className="text-[10.5px] leading-tight mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>محاسب رئيسي</p>
                </div>
                <MoreVertical size={13} className="shrink-0 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User menu popup — portal, z-index BELOW the sidebar (9990 < 9995) */}
      {userMenuPos && <UserMenuPortal pos={userMenuPos} onClose={closeUserMenu} />}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock content
// ─────────────────────────────────────────────────────────────────────────────

function MockContent() {
  return (
    <div className="flex-1 flex flex-col bg-background min-w-0 overflow-hidden">
      <div className="h-14 border-b border-border flex items-center gap-3 px-5 shrink-0 bg-card">
        <Breadcrumb items={[{ label: "الرئيسية", icon: Home }, { label: "الفواتير", icon: FileText }, { label: "فاتورة #١٠٤٥" }]} />
        <div className="flex items-center gap-2 ms-auto">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl border border-border flex items-center justify-center"><Bell size={15} className="text-muted-foreground" /></div>
            <span className="absolute top-1 end-1 w-1.5 h-1.5 rounded-full bg-destructive" />
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white text-[10px]" style={{ fontWeight: 700 }}>أح</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { bg: "#EEF3FE", accent: "#2563eb", label: "الإيرادات", val: "٢٤٥ ألف" },
            { bg: "#ECFDF3", accent: "#16a34a", label: "الأرباح", val: "٨٧ ألف" },
            { bg: "#FFFBEB", accent: "#d97706", label: "المصروفات", val: "٥٣ ألف" },
          ].map((c, i) => (
            <div key={i} className="rounded-xl p-3.5 border" style={{ backgroundColor: c.bg, borderColor: c.accent + "22" }}>
              <div className="w-5 h-5 rounded-md mb-2.5 opacity-70" style={{ backgroundColor: c.accent }} />
              <p className="text-[10px] mb-1" style={{ color: c.accent, fontWeight: 600 }}>{c.label}</p>
              <p className="text-sm amount" style={{ color: c.accent, fontWeight: 700 }}>{c.val}</p>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="h-3 w-20 bg-muted rounded mb-4" />
          <div className="flex items-end gap-1 h-20">
            {[35, 58, 42, 75, 50, 65, 85, 55, 70, 45, 80, 90].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: "var(--primary)", opacity: i === 11 ? 1 : 0.1 + i * 0.05 }} />
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
              <div className="w-6 h-6 rounded-md bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5"><div className="h-2.5 bg-muted rounded w-28" /><div className="h-2 bg-muted/60 rounded w-16" /></div>
              <div className="h-3 w-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section export
// ─────────────────────────────────────────────────────────────────────────────

export function SidebarSection() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">الشريط الجانبي</h1>
        <p className="text-muted-foreground">تصميم فاتح · شريط أيقونات + لوحة تنقل · RTL · قائمة المستخدم خلفه</p>
      </div>

      {/* ── Live demo ─────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3>معاينة تفاعلية</h3>
          <button className="h-9 px-4 rounded-xl border border-border text-sm hover:bg-muted transition-colors" style={{ fontWeight: 500 }} onClick={() => setCollapsed(v => !v)}>
            {collapsed ? "توسيع الشريط" : "طي الشريط"}
          </button>
        </div>

        {/* dir="rtl" so sidebar (first child) is on the RIGHT */}
        <div dir="rtl" className="flex rounded-2xl overflow-hidden border border-border" style={{ height: "580px", boxShadow: "var(--shadow-card)" }}>
          <SidebarDemo collapsed={collapsed} />
          <MockContent />
        </div>
        <p className="text-xs text-muted-foreground mt-2.5">
          اضغط على صورة المستخدم أو زر الاسم في أسفل الشريط — تظهر القائمة خلف الشريط باتجاه المحتوى
        </p>
      </section>

      {/* ── Collapsed icon rail only ───────────────────────── */}
      <section>
        <h3 className="mb-4">الحالة المطوية — شريط الأيقونات فقط</h3>
        <div dir="rtl" className="flex rounded-2xl overflow-hidden border border-border" style={{ height: "380px", boxShadow: "var(--shadow-card)" }}>
          <SidebarDemo collapsed={true} />
          <MockContent />
        </div>
      </section>

      {/* ── User menu static preview ───────────────────────── */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-1">قائمة المستخدم</h3>
        <p className="text-muted-foreground text-sm mb-5">تظهر خلف الشريط باتجاه المحتوى عند الضغط</p>
        <div className="max-w-[240px]">
          <div className="bg-card rounded-2xl border border-border py-1.5" style={{ boxShadow: "var(--shadow-popover)" }}>
            <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border mb-1">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-white text-xs" style={{ fontWeight: 700 }}>أح</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>أحمد محمد</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 size={10} className="text-success shrink-0" />
                  <p className="text-xs text-muted-foreground">متصل الآن</p>
                </div>
              </div>
            </div>
            {USER_MENU_GROUPS.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && <div className="my-1 border-t border-border" />}
                <div className="px-1.5">
                  {group.items.map(item => (
                    <button key={item.id} className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-sm text-right hover:bg-muted transition-colors"
                      style={{ color: item.danger ? "var(--destructive)" : "var(--foreground)", fontWeight: 500, minHeight: "34px" }}>
                      <item.icon size={15} className="shrink-0" style={{ color: item.danger ? "var(--destructive)" : "var(--muted-foreground)" }} />
                      <span className="flex-1 text-right">{item.label}</span>
                      {item.shortcut && (
                        <kbd className="text-[10.5px] px-1.5 py-0.5 rounded-md border border-border amount"
                          style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)", fontFamily: "var(--font-family)", fontWeight: 500 }}>
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Breadcrumbs ─────────────────────────────────────── */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h3>مسار التنقل (Breadcrumb)</h3>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>جميع الحالات الممكنة — المكوّن قابل لإعادة الاستخدام</p>
        </div>
        <div className="divide-y divide-border">
          {([
            { label: "بسيط", sep: "chevron", items: [{ label: "الرئيسية" }, { label: "العملاء" }, { label: "شركة النور للتجارة" }] },
            { label: "مع أيقونة", sep: "chevron", items: [{ label: "الرئيسية", icon: Home }, { label: "الفواتير", icon: FileText }, { label: "فاتورة #١٠٤٥" }] },
            { label: "مسار طويل مطوي", sep: "chevron", maxVisible: 3, items: [{ label: "الرئيسية", icon: Home }, { label: "المبيعات" }, { label: "عملاء التجزئة" }, { label: "شركة النور" }, { label: "فاتورة #١٠٤٥" }] },
            { label: "فاصل شرطة", sep: "slash", items: [{ label: "الرئيسية" }, { label: "المشتريات" }, { label: "الموردين" }, { label: "شركة الأمل" }] },
            { label: "فاصل نقطة", sep: "dot", items: [{ label: "الإعدادات" }, { label: "المستخدمون" }, { label: "أحمد محمد" }] },
            { label: "مع شارات", sep: "chevron", items: [{ label: "الرئيسية", icon: Home }, { label: "الفواتير", badge: 12 }, { label: "غير مدفوعة", badge: 3 }] },
            { label: "مسار الفاتورة", sep: "chevron", items: [{ label: "الرئيسية", icon: Home }, { label: "المبيعات", icon: TrendingDown }, { label: "الفواتير", icon: Receipt, badge: 5 }, { label: "فاتورة رقم ١٠٤٥" }] },
          ] as Array<{ label: string; sep: BreadcrumbSep; items: BCItem[]; maxVisible?: number }>).map(row => (
            <div key={row.label} className="px-6 py-4 flex items-center gap-6">
              <span className="text-xs text-muted-foreground w-36 shrink-0" style={{ fontWeight: 500 }}>{row.label}</span>
              <Breadcrumb items={row.items} separator={row.sep} maxVisible={row.maxVisible} />
            </div>
          ))}
          <div className="px-6 py-4 flex items-center gap-6">
            <span className="text-xs text-muted-foreground w-36 shrink-0" style={{ fontWeight: 500 }}>حالة التحميل</span>
            <div className="flex items-center gap-2">
              {[80, 60, 100].map((w, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="h-3 rounded-md bg-muted animate-pulse" style={{ width: `${w}px` }} />
                  {i < 2 && <ChevronLeft size={12} style={{ color: "var(--muted-foreground)", opacity: 0.3 }} />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
