import { useState } from "react";
import type { ComponentType } from "react";
import { Sidebar } from "@/ui/components/Sidebar";
import type { SidebarNavGroup, SidebarUserMenuGroup, SidebarUserProfile } from "@/ui/components/Sidebar";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  TrendingUp,
  Users,
  Truck,
  Landmark,
  BookOpen,
  BarChart2,
  Settings,
  Bell,
  Package,
  Wallet,
  LogOut,
  Home,
  ChevronLeft,
  MoreHorizontal,
  Receipt,
  TrendingDown,
  Palette,
  Keyboard,
  HelpCircle,
  Trash2,
  CheckCircle2,
} from "lucide-react";

type BreadcrumbSep = "chevron" | "slash" | "dot";
interface BCItem {
  label: string;
  icon?: ComponentType<{ size?: string | number; className?: string }>;
  badge?: number;
  href?: string;
}

function BCSeparator({ type }: { type: BreadcrumbSep }) {
  if (type === "slash") {
    return (
      <span className="select-none mx-1.5" style={{ color: "var(--muted-foreground)", opacity: 0.4 }}>
        /
      </span>
    );
  }
  if (type === "dot") {
    return (
      <span
        className="mx-2 w-1 h-1 rounded-full shrink-0 inline-block"
        style={{ backgroundColor: "var(--muted-foreground)", opacity: 0.35 }}
      />
    );
  }
  return <ChevronLeft size={12} className="shrink-0 mx-0.5" style={{ color: "var(--muted-foreground)", opacity: 0.35 }} />;
}

function BCItem({ item, isLast }: { item: BCItem; isLast: boolean }) {
  const cls = "flex items-center gap-1.5 text-sm leading-none transition-colors";
  const badge = item.badge != null ? (
    <span
      className={`inline-flex items-center justify-center h-[18px] px-1.5 rounded-full text-[10px] ms-1 ${isLast ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}
      style={{ fontWeight: 600 }}
    >
      {item.badge}
    </span>
  ) : null;

  if (isLast) {
    return (
      <span className={`${cls} text-foreground`} style={{ fontWeight: 500 }}>
        {item.icon && <item.icon size={13} />}
        <span>{item.label}</span>
        {badge}
      </span>
    );
  }

  return (
    <a href={item.href ?? "#"} onClick={(e) => e.preventDefault()} className={`${cls} text-muted-foreground hover:text-foreground`}>
      {item.icon && <item.icon size={13} />}
      <span>{item.label}</span>
      {badge}
    </a>
  );
}

export function Breadcrumb({
  items,
  separator = "chevron",
  maxVisible,
}: {
  items: BCItem[];
  separator?: BreadcrumbSep;
  maxVisible?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const shouldCollapse = maxVisible != null && items.length > maxVisible && !expanded;
  const visible: (BCItem | "ellipsis")[] = shouldCollapse ? [items[0], "ellipsis", items[items.length - 1]] : items;

  return (
    <nav className="flex items-center flex-wrap gap-0" aria-label="breadcrumb">
      {visible.map((item, i) => {
        const isLast = i === visible.length - 1;
        if (item === "ellipsis") {
          return (
            <span key="ellipsis" className="flex items-center">
              <button
                onClick={() => setExpanded(true)}
                className="flex items-center px-1.5 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <MoreHorizontal size={14} />
              </button>
              <BCSeparator type={separator} />
            </span>
          );
        }

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

const NAV_GROUPS: SidebarNavGroup[] = [
  {
    id: "main",
    label: null,
    defaultOpen: true,
    items: [
      { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
      { id: "notif", label: "الإشعارات", icon: Bell, badge: 4 },
      { id: "reports", label: "التقارير", icon: BarChart2 },
    ],
  },
  {
    id: "operations",
    label: "العمليات",
    defaultOpen: true,
    items: [
      { id: "invoices", label: "الفواتير", icon: FileText, badge: 3 },
      { id: "sales", label: "المبيعات", icon: TrendingUp },
      { id: "purchases", label: "المشتريات", icon: ShoppingCart },
      { id: "expenses", label: "المصروفات", icon: Wallet },
    ],
  },
  {
    id: "parties",
    label: "الأطراف",
    defaultOpen: true,
    items: [
      { id: "customers", label: "العملاء", icon: Users },
      { id: "suppliers", label: "الموردين", icon: Truck },
    ],
  },
  {
    id: "accounting",
    label: "المحاسبة",
    defaultOpen: false,
    items: [
      { id: "banks", label: "الخزنة والبنوك", icon: Landmark },
      { id: "journal", label: "القيود اليومية", icon: BookOpen },
      { id: "accounts", label: "دليل الحسابات", icon: Package },
    ],
  },
];

const USER_MENU_GROUPS: SidebarUserMenuGroup[] = [
  {
    items: [
      { id: "themes", label: "المظاهر", icon: Palette, shortcut: "Ctrl+T" },
      { id: "settings", label: "الإعدادات", icon: Settings, shortcut: "Ctrl+S" },
      { id: "notifs", label: "الإشعارات", icon: Bell, shortcut: "Ctrl+N" },
    ],
  },
  {
    items: [
      { id: "shortcuts", label: "اختصارات لوحة المفاتيح", icon: Keyboard },
      { id: "help", label: "المساعدة", icon: HelpCircle },
    ],
  },
  {
    items: [
      { id: "trash", label: "سلة المحذوفات", icon: Trash2, danger: false },
      { id: "logout", label: "تسجيل الخروج", icon: LogOut, danger: true },
    ],
  },
];

const SIDEBAR_USER: SidebarUserProfile = {
  initials: "أح",
  name: "أحمد محمد",
  role: "محاسب رئيسي",
  statusLabel: "متصل الآن",
};

function MockContent() {
  return (
    <div className="flex-1 flex flex-col bg-background min-w-0 overflow-hidden">
      <div className="h-14 border-b border-border flex items-center gap-3 px-5 shrink-0 bg-card">
        <Breadcrumb items={[{ label: "الرئيسية", icon: Home }, { label: "الفواتير", icon: FileText }, { label: "فاتورة #1054" }]} />
        <div className="flex items-center gap-2 ms-auto">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl border border-border flex items-center justify-center">
              <Bell size={15} className="text-muted-foreground" />
            </div>
            <span className="absolute top-1 end-1 w-1.5 h-1.5 rounded-full bg-destructive" />
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white text-[10px]" style={{ fontWeight: 700 }}>
              أح
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { bg: "#EEF3FE", accent: "#2563eb", label: "الإيرادات", val: "٢٤٥ ألف" },
            { bg: "#ECFDF3", accent: "#16a34a", label: "الأرباح", val: "٨٧ ألف" },
            { bg: "#FFFBEB", accent: "#d97706", label: "المصروفات", val: "٥٣ ألف" },
          ].map((card, i) => (
            <div key={i} className="rounded-xl p-3.5 border" style={{ backgroundColor: card.bg, borderColor: `${card.accent}22` }}>
              <div className="w-5 h-5 rounded-md mb-2.5 opacity-70" style={{ backgroundColor: card.accent }} />
              <p className="text-[10px] mb-1" style={{ color: card.accent, fontWeight: 600 }}>
                {card.label}
              </p>
              <p className="text-sm amount" style={{ color: card.accent, fontWeight: 700 }}>
                {card.val}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <div className="h-3 w-20 bg-muted rounded mb-4" />
          <div className="flex items-end gap-1 h-20">
            {[35, 58, 42, 75, 50, 65, 85, 55, 70, 45, 80, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{ height: `${h}%`, backgroundColor: "var(--primary)", opacity: i === 11 ? 1 : 0.1 + i * 0.05 }}
              />
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
              <div className="w-6 h-6 rounded-md bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-muted rounded w-28" />
                <div className="h-2 bg-muted/60 rounded w-16" />
              </div>
              <div className="h-3 w-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SidebarSection() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">الشريط الجانبي</h1>
        <p className="text-muted-foreground">تصميم فاتح · شريط أيقونات + لوحة تنقل · RTL · قائمة المستخدم خلفه</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3>معاينة تفاعلية</h3>
          <button
            className="h-9 px-4 rounded-xl border border-border text-sm hover:bg-muted transition-colors"
            style={{ fontWeight: 500 }}
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? "توسيع الشريط" : "طي الشريط"}
          </button>
        </div>

        <div dir="rtl" className="flex rounded-2xl overflow-hidden border border-border" style={{ height: "580px", boxShadow: "var(--shadow-card)" }}>
          <Sidebar
            collapsed={collapsed}
            dir="rtl"
            groups={NAV_GROUPS}
            user={SIDEBAR_USER}
            userMenuGroups={USER_MENU_GROUPS}
            company={{ name: "قبس", subtitle: "شركة النور للتجارة" }}
            searchPlaceholder="بحث..."
            settingsLabel="الإعدادات"
          />
          <MockContent />
        </div>
        <p className="text-xs text-muted-foreground mt-2.5">
          اضغط على صورة المستخدم أو زر الاسم في أسفل الشريط — تظهر القائمة خلف الشريط باتجاه المحتوى
        </p>
      </section>

      <section>
        <h3 className="mb-4">الحالة المطوية — شريط الأيقونات فقط</h3>
        <div dir="rtl" className="flex rounded-2xl overflow-hidden border border-border" style={{ height: "380px", boxShadow: "var(--shadow-card)" }}>
          <Sidebar
            collapsed
            dir="rtl"
            groups={NAV_GROUPS}
            user={SIDEBAR_USER}
            userMenuGroups={USER_MENU_GROUPS}
            company={{ name: "قبس", subtitle: "شركة النور للتجارة" }}
            searchPlaceholder="بحث..."
            settingsLabel="الإعدادات"
          />
          <MockContent />
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-1">قائمة المستخدم</h3>
        <p className="text-muted-foreground text-sm mb-5">تظهر خلف الشريط باتجاه المحتوى عند الضغط</p>
        <div className="max-w-[240px]">
          <div className="bg-card rounded-2xl border border-border py-1.5" style={{ boxShadow: "var(--shadow-popover)" }}>
            <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border mb-1">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-white text-xs" style={{ fontWeight: 700 }}>
                  {SIDEBAR_USER.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>
                  {SIDEBAR_USER.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 size={10} className="text-success shrink-0" />
                  <p className="text-xs text-muted-foreground">{SIDEBAR_USER.statusLabel}</p>
                </div>
              </div>
            </div>
            {USER_MENU_GROUPS.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && <div className="my-1 border-t border-border" />}
                <div className="px-1.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
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
                        <kbd
                          className="text-[10.5px] px-1.5 py-0.5 rounded-md border border-border amount"
                          style={{
                            backgroundColor: "var(--muted)",
                            color: "var(--muted-foreground)",
                            fontFamily: "var(--font-family)",
                            fontWeight: 500,
                          }}
                        >
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

      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h3>مسار التنقل (Breadcrumb)</h3>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>
            جميع الحالات الممكنة — المكوّن قابل لإعادة الاستخدام
          </p>
        </div>

        <div className="divide-y divide-border">
          {([
            { label: "بسيط", sep: "chevron", items: [{ label: "الرئيسية" }, { label: "العملاء" }, { label: "شركة النور للتجارة" }] },
            { label: "مع أيقونة", sep: "chevron", items: [{ label: "الرئيسية", icon: Home }, { label: "الفواتير", icon: FileText }, { label: "فاتورة #1054" }] },
            {
              label: "مسار طويل مطوي",
              sep: "chevron",
              maxVisible: 3,
              items: [
                { label: "الرئيسية", icon: Home },
                { label: "المبيعات" },
                { label: "عملاء التجزئة" },
                { label: "شركة النور" },
                { label: "فاتورة #1054" },
              ],
            },
            { label: "فاصل شرطة", sep: "slash", items: [{ label: "الرئيسية" }, { label: "المشتريات" }, { label: "الموردين" }, { label: "شركة الأمل" }] },
            { label: "فاصل نقطة", sep: "dot", items: [{ label: "الإعدادات" }, { label: "المستخدمون" }, { label: "أحمد محمد" }] },
            { label: "مع شارات", sep: "chevron", items: [{ label: "الرئيسية", icon: Home }, { label: "الفواتير", badge: 12 }, { label: "غير مدفوعة", badge: 3 }] },
            {
              label: "مسار الفاتورة",
              sep: "chevron",
              items: [
                { label: "الرئيسية", icon: Home },
                { label: "المبيعات", icon: TrendingDown },
                { label: "الفواتير", icon: Receipt, badge: 5 },
                { label: "فاتورة رقم 1054" },
              ],
            },
          ] as Array<{ label: string; sep: BreadcrumbSep; items: BCItem[]; maxVisible?: number }>).map((row) => (
            <div key={row.label} className="px-6 py-4 flex items-center gap-6">
              <span className="text-xs text-muted-foreground w-36 shrink-0" style={{ fontWeight: 500 }}>
                {row.label}
              </span>
              <Breadcrumb items={row.items} separator={row.sep} maxVisible={row.maxVisible} />
            </div>
          ))}

          <div className="px-6 py-4 flex items-center gap-6">
            <span className="text-xs text-muted-foreground w-36 shrink-0" style={{ fontWeight: 500 }}>
              حالة التحميل
            </span>
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
