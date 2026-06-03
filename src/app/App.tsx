import { useState } from "react";
import {
  Palette, Type, AlignVerticalSpaceAround, Square, MousePointer2, Rows3, FormInput, Table2,
  Tag, LayoutGrid, Inbox, PanelRight, FileText, Users, LayoutDashboard,
  ChevronLeft, ChevronRight, Menu, X, BellRing, ClipboardList, Coins, Zap, MessageSquareWarning, LogIn, AlertTriangle, ChevronDown, ShieldCheck,
} from "lucide-react";
import { ToastProvider } from "@/ui/components/Toast";
import { ColorsSection } from "./components/sections/ColorsSection";
import { TypographySection } from "./components/sections/TypographySection";
import { SpacingSection } from "./components/sections/SpacingSection";
import { RadiusShadowsSection } from "./components/sections/RadiusShadowsSection";
import { ButtonsSection } from "./components/sections/ButtonsSection";
import { TabsSection } from "./components/sections/TabsSection";
import { InputsSection } from "./components/sections/InputsSection";
import { TablesSection } from "./components/sections/TablesSection";
import { BadgesSection } from "./components/sections/BadgesSection";
import { CardsSection } from "./components/sections/CardsSection";
import { EmptyStatesSection } from "./components/sections/EmptyStatesSection";
import { SidebarSection } from "./components/sections/SidebarSection";
import { InvoiceScreensSection } from "./components/sections/InvoiceScreensSection";
import { CustomerScreensSection } from "./components/sections/CustomerScreensSection";
import { DashboardSection } from "./components/sections/DashboardSection";
import { AlertsSection } from "./components/sections/AlertsSection";
import { FormsSection } from "./components/sections/FormsSection";
import { AmountInputsSection } from "./components/sections/AmountInputsSection";
import { ConfirmModalSection } from "./components/sections/ConfirmModalSection";
import { LoginSection } from "./components/sections/LoginSection";
import { InvoiceEntrySection } from "./components/sections/InvoiceEntrySection";
import { ErrorPagesSection } from "./components/sections/ErrorPagesSection";
import { SystemReadinessSection } from "./components/sections/SystemReadinessSection";
import { OperationalAlertsSection } from "./components/sections/OperationalAlertsSection";

const sectionGroups = [
  {
    id: "foundations",
    label: "الأساسيات",
    items: [
      { id: "colors", num: "01", label: "الألوان", icon: Palette, component: ColorsSection },
      { id: "typography", num: "02", label: "الخطوط", icon: Type, component: TypographySection },
      { id: "spacing", num: "03", label: "المسافات", icon: AlignVerticalSpaceAround, component: SpacingSection },
      { id: "radius", num: "04", label: "الزوايا والظلال", icon: Square, component: RadiusShadowsSection },
    ],
  },
  {
    id: "components",
    label: "المكونات",
    items: [
      { id: "buttons", num: "05", label: "الأزرار", icon: MousePointer2, component: ButtonsSection },
      { id: "tabs", num: "05b", label: "التبويبات", icon: Rows3, component: TabsSection },
      { id: "inputs", num: "06", label: "الحقول", icon: FormInput, component: InputsSection },
      { id: "amounts", num: "06b", label: "المدخلات المالية", icon: Coins, component: AmountInputsSection },
      { id: "invoice-entry", num: "06c", label: "إدخال الفاتورة", icon: Zap, component: InvoiceEntrySection },
      { id: "tables", num: "07", label: "الجداول", icon: Table2, component: TablesSection },
      { id: "badges", num: "08", label: "الشارات", icon: Tag, component: BadgesSection },
      { id: "cards", num: "09", label: "البطاقات", icon: LayoutGrid, component: CardsSection },
      { id: "empty", num: "10", label: "الحالات الفارغة", icon: Inbox, component: EmptyStatesSection },
      { id: "alerts", num: "11", label: "التنبيهات", icon: BellRing, component: AlertsSection },
      { id: "confirm", num: "11b", label: "نوافذ التأكيد", icon: MessageSquareWarning, component: ConfirmModalSection },
      { id: "forms", num: "12", label: "النماذج", icon: ClipboardList, component: FormsSection },
      { id: "sidebar", num: "13", label: "الشريط الجانبي", icon: PanelRight, component: SidebarSection },
    ],
  },
  {
    id: "screens",
    label: "الشاشات",
    items: [
      { id: "invoices", num: "14", label: "شاشات الفواتير", icon: FileText, component: InvoiceScreensSection },
      { id: "customers", num: "15", label: "شاشات العملاء", icon: Users, component: CustomerScreensSection },
      { id: "dashboard", num: "16", label: "لوحة التحكم", icon: LayoutDashboard, component: DashboardSection },
      { id: "system-readiness", num: "17", label: "جاهزية التشغيل", icon: ShieldCheck, component: SystemReadinessSection },
      { id: "operational-alerts", num: "18", label: "مركز التنبيهات", icon: BellRing, component: OperationalAlertsSection },
      { id: "login", num: "19", label: "تسجيل الدخول", icon: LogIn, component: LoginSection },
      { id: "error-pages", num: "20", label: "صفحات الأخطاء", icon: AlertTriangle, component: ErrorPagesSection },
    ],
  },
];

// Flatten sections for easier access
const sections = sectionGroups.flatMap((group) => group.items);

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    foundations: true,
    components: true,
    screens: true,
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const current = sections.find((s) => s.id === active)!;
  const CurrentSection = current.component;

  const currentIndex = sections.findIndex((s) => s.id === active);
  const prev = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const next = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  return (
    <ToastProvider dir="rtl" closeAriaLabel="إغلاق">
      <div dir="rtl" lang="ar" className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "var(--font-family)" }}>
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className="flex flex-col shrink-0 h-full z-50 transition-all duration-200"
          style={{
            backgroundColor: "var(--sidebar)",
            width: collapsed ? "64px" : "220px",
            position: "relative",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2.5 px-3 py-4 border-b shrink-0"
            style={{ borderColor: "var(--sidebar-border)" }}
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <span className="text-white font-bold">ق</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight truncate" style={{ color: "var(--sidebar-foreground-strong)" }}>
                  قبس
                </p>
                <p className="text-xs leading-tight" style={{ color: "var(--sidebar-foreground)", opacity: 0.65 }}>
                  نظام المحاسبة
                </p>
              </div>
            )}
            <button
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0"
              style={{ color: "var(--sidebar-foreground)" }}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2 space-y-0 px-1.5 sidebar-scroll">
            {sectionGroups.map((group) => (
              <div key={group.id} className="space-y-0.5">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors"
                  style={{
                    color: "var(--sidebar-foreground)",
                    opacity: 0.4,
                  }}
                >
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-right">{group.label}</span>
                      <ChevronDown
                        size={14}
                        className="transition-transform duration-200 shrink-0"
                        style={{
                          transform: expandedGroups[group.id] ? "rotate(0deg)" : "rotate(-90deg)",
                        }}
                      />
                    </>
                  )}
                  {collapsed && (
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200 shrink-0"
                      style={{
                        transform: expandedGroups[group.id] ? "rotate(0deg)" : "rotate(-90deg)",
                      }}
                    />
                  )}
                </button>
                {expandedGroups[group.id] && (
                  <div className="space-y-0.5">
                    {group.items.map((sec) => {
                      const isActive = active === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => { setActive(sec.id); setMobileOpen(false); }}
                          title={collapsed ? sec.label : undefined}
                          className="w-full flex items-center gap-2.5 py-2 px-2 rounded-xl text-sm font-medium transition-all duration-150 group"
                          style={{
                            backgroundColor: isActive ? "var(--sidebar-primary)" : "transparent",
                            color: isActive ? "var(--sidebar-primary-foreground)" : "var(--sidebar-foreground)",
                          }}
                        >
                          <sec.icon size={17} className="shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-right truncate">{sec.label}</span>
                              <span
                                className="text-xs shrink-0 font-mono"
                                style={{ opacity: isActive ? 0.7 : 0.4 }}
                              >
                                {sec.num}
                              </span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          {!collapsed && (
            <div
              className="p-3 border-t"
              style={{ borderColor: "var(--sidebar-border)" }}
            >
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">م</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--sidebar-foreground-strong)" }}>
                    مدير النظام
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--sidebar-foreground)", opacity: 0.55 }}>
                    v1.0 — نظام قبس
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          {/* Top bar */}
          <header className="bg-card border-b border-border px-6 py-3 flex items-center gap-3 shrink-0">
            <button
              className="lg:hidden w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu size={17} />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-mono text-xs">{current.num}</span>
              <span className="text-border">/</span>
              <h2 className="text-foreground" style={{ fontSize: "15px", fontWeight: 600 }}>{current.label}</h2>
            </div>
            <div className="flex items-center gap-2 ms-auto">
              <button
                className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30"
                onClick={() => prev && setActive(prev.id)}
                disabled={!prev}
                title={prev ? `السابق: ${prev.label}` : undefined}
              >
                <ChevronRight size={15} />
              </button>
              <button
                className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30"
                onClick={() => next && setActive(next.id)}
                disabled={!next}
                title={next ? `التالي: ${next.label}` : undefined}
              >
                <ChevronLeft size={15} />
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
              <CurrentSection />
            </div>
          </main>

          {/* Section nav footer */}
          <div className="bg-card border-t border-border px-6 py-3 flex items-center justify-between text-sm shrink-0">
            <button
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              onClick={() => prev && setActive(prev.id)}
              disabled={!prev}
            >
              <ChevronRight size={14} />
              {prev ? prev.label : "لا يوجد سابق"}
            </button>
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {sections.length}
            </span>
            <button
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              onClick={() => next && setActive(next.id)}
              disabled={!next}
            >
              {next ? next.label : "لا يوجد تالٍ"}
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
