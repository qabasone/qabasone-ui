import { useState } from "react";
import {
  Trash2, AlertTriangle, Info, CheckCircle2, HelpCircle,
  LogOut, Archive, RefreshCw, Send, ShieldAlert, Unlink,
} from "lucide-react";
import { ConfirmModal, type ConfirmVariant } from "@/ui/components/ConfirmModal";

// ── Trigger button ────────────────────────────────────────────────────────────

function TriggerBtn({
  label, onClick, variant = "neutral",
}: {
  label: string;
  onClick: () => void;
  variant?: ConfirmVariant | "outline";
}) {
  const colors: Record<string, { bg: string; fg: string; border: string }> = {
    danger:  { bg: "var(--destructive)",     fg: "var(--destructive-foreground)", border: "var(--destructive)" },
    warning: { bg: "var(--warning)",         fg: "var(--warning-foreground)",     border: "var(--warning)" },
    info:    { bg: "var(--info)",            fg: "var(--info-foreground)",        border: "var(--info)" },
    success: { bg: "var(--success)",         fg: "var(--success-foreground)",     border: "var(--success)" },
    neutral: { bg: "var(--primary)",         fg: "var(--primary-foreground)",     border: "var(--primary)" },
    outline: { bg: "var(--card)",            fg: "var(--foreground)",             border: "var(--border-strong)" },
  };
  const c = colors[variant] ?? colors.outline;
  return (
    <button
      onClick={onClick}
      className="h-9 px-4 rounded-xl text-sm transition-all"
      style={{
        backgroundColor: c.bg,
        color: c.fg,
        border: `1.5px solid ${c.border}`,
        fontWeight: 500,
      }}
    >
      {label}
    </button>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function ConfirmModalSection() {
  // track which modal is open
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const show = (id: string) => { setOpen(id); setLoading(false); };
  const close = () => { setOpen(null); setLoading(false); };

  const simulateAsync = (label: string) => {
    setLoading(true);
    setTimeout(() => {
      close();
      setLastAction(label);
    }, 1800);
  };

  // All modal configs for the grid showcase
  const variants: Array<{
    id: string;
    variant: ConfirmVariant;
    icon?: React.ElementType;
    title: string;
    description: string;
    confirmLabel?: string;
    trigger: string;
    checkboxLabel?: string;
    closeOnBackdrop?: boolean;
    async?: boolean;
  }> = [
    {
      id: "delete",
      variant: "danger",
      icon: Trash2,
      title: "هل تريد حذف هذا الملف؟",
      description: "سيتم حذف هذا الملف نهائياً ولن تتمكن من استرداده لاحقاً.",
      confirmLabel: "حذف",
      trigger: "حذف ملف",
      checkboxLabel: "لا تسألني مجدداً",
    },
    {
      id: "logout",
      variant: "warning",
      icon: LogOut,
      title: "تسجيل الخروج",
      description: "ستنتهي جلستك الحالية وستحتاج إلى تسجيل الدخول مرة أخرى.",
      confirmLabel: "خروج",
      trigger: "تسجيل خروج",
    },
    {
      id: "archive",
      variant: "info",
      icon: Archive,
      title: "أرشفة الفاتورة",
      description: "سيتم نقل هذه الفاتورة إلى الأرشيف. يمكنك استعادتها في أي وقت من قائمة الأرشيف.",
      confirmLabel: "أرشفة",
      trigger: "أرشفة فاتورة",
    },
    {
      id: "send",
      variant: "success",
      icon: Send,
      title: "إرسال الفاتورة للعميل",
      description: "سيتم إرسال الفاتورة إلى البريد الإلكتروني المسجل للعميل.",
      confirmLabel: "إرسال",
      trigger: "إرسال فاتورة",
    },
    {
      id: "confirm",
      variant: "neutral",
      icon: HelpCircle,
      title: "تأكيد العملية",
      description: "هل أنت متأكد من المتابعة؟ هذا الإجراء قابل للتعديل لاحقاً.",
      confirmLabel: "متابعة",
      trigger: "تأكيد عام",
    },
    {
      id: "reset",
      variant: "warning",
      icon: RefreshCw,
      title: "إعادة تعيين البيانات",
      description: "ستُحذف جميع البيانات المُدخلة وتعود إلى الحالة الافتراضية.",
      confirmLabel: "إعادة تعيين",
      trigger: "إعادة تعيين",
      closeOnBackdrop: false,
    },
    {
      id: "disconnect",
      variant: "danger",
      icon: Unlink,
      title: "قطع الاتصال بالحساب",
      description: "سيتم إلغاء ربط حسابك بهذا التطبيق. يمكنك إعادة الربط في الإعدادات.",
      confirmLabel: "قطع الاتصال",
      trigger: "قطع الاتصال",
    },
    {
      id: "async",
      variant: "danger",
      icon: ShieldAlert,
      title: "حذف جميع السجلات",
      description: "سيتم حذف جميع السجلات المحددة بشكل دائم. هذه العملية لا يمكن التراجع عنها.",
      confirmLabel: "حذف الكل",
      trigger: "مع تحميل (Async)",
      async: true,
    },
  ];

  const openCfg = variants.find(v => v.id === open);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-foreground mb-1">نافذة التأكيد</h1>
        <p className="text-muted-foreground">
          مكوّن قابل لإعادة الاستخدام — 5 أنواع، حالة تحميل، checkbox، وإدارة تركيز تلقائية
        </p>
      </div>

      {/* ── Static preview (matches reference image) ──────────────────── */}
      <section>
        <h3 className="mb-4">المعاينة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {variants.slice(0, 6).map(cfg => (
            <div
              key={cfg.id}
              className="rounded-2xl p-6 space-y-0"
              style={{ backgroundColor: "var(--card)", boxShadow: "var(--shadow-card)", border: "1px solid var(--border)" }}
            >
              {/* Icon badge */}
              {(() => {
                const c = {
                  danger:  { bg: "var(--destructive-muted)", color: "var(--destructive)" },
                  warning: { bg: "var(--warning-muted)",     color: "var(--warning)" },
                  info:    { bg: "var(--info-muted)",         color: "var(--info)" },
                  success: { bg: "var(--success-muted)",      color: "var(--success)" },
                  neutral: { bg: "var(--primary-muted)",      color: "var(--primary)" },
                }[cfg.variant];
                const Icon = cfg.icon ?? HelpCircle;
                return (
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: c.bg }}>
                    <Icon size={22} style={{ color: c.color }} strokeWidth={2.2} />
                  </div>
                );
              })()}

              <h3 className="mb-2" style={{ fontSize: "var(--text-base)" }}>{cfg.title}</h3>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{cfg.description}</p>

              {/* Footer */}
              <div className="flex items-center gap-2">
                {cfg.checkboxLabel && (
                  <label className="flex items-center gap-1.5 flex-1 cursor-pointer">
                    <div className="w-4 h-4 rounded border shrink-0" style={{ borderColor: "var(--border-strong)", borderWidth: "1.5px" }} />
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{cfg.checkboxLabel}</span>
                  </label>
                )}
                {!cfg.checkboxLabel && <div className="flex-1" />}
                <button
                  className="h-9 px-4 rounded-xl text-sm"
                  style={{ border: "1.5px solid var(--border-strong)", backgroundColor: "var(--card)", color: "var(--foreground)", fontWeight: 500 }}
                >
                  إلغاء
                </button>
                <button
                  onClick={() => show(cfg.id)}
                  className="h-9 px-4 rounded-xl text-sm"
                  style={{
                    backgroundColor: { danger: "var(--destructive)", warning: "var(--warning)", info: "var(--info)", success: "var(--success)", neutral: "var(--primary)" }[cfg.variant],
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  {cfg.confirmLabel ?? "تأكيد"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive triggers ────────────────────────────────────────── */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3>تجربة تفاعلية</h3>
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: "13px" }}>اضغط أي زر لفتح النافذة المقابلة</p>
        </div>
        <div className="p-6 flex flex-wrap gap-3">
          {variants.map(cfg => (
            <TriggerBtn
              key={cfg.id}
              label={cfg.trigger}
              variant={cfg.variant}
              onClick={() => show(cfg.id)}
            />
          ))}
        </div>

        {lastAction && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "var(--success-muted)", border: "1px solid color-mix(in srgb, var(--success) 25%, transparent)" }}>
              <CheckCircle2 size={14} style={{ color: "var(--success)" }} />
              <span className="text-sm" style={{ color: "var(--success)", fontWeight: 500 }}>
                تم تنفيذ: {lastAction}
              </span>
              <button className="ms-auto text-xs" style={{ color: "var(--success)" }} onClick={() => setLastAction(null)}>×</button>
            </div>
          </div>
        )}
      </section>

      {/* ── API reference table ─────────────────────────────────────────── */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3>واجهة المكوّن (Props)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--secondary)" }}>
                {["الخاصية", "النوع", "الافتراضي", "الوصف"].map(h => (
                  <th key={h} className="px-5 py-3 text-right border-b" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", fontWeight: 600, fontSize: "12px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["open",              "boolean",                    "—",         "يتحكم في ظهور النافذة"],
                ["onConfirm",        "() => void",                 "—",         "يُستدعى عند الضغط على زر التأكيد"],
                ["onCancel",         "() => void",                 "—",         "يُستدعى عند الضغط على إلغاء أو Escape"],
                ["title",            "string",                     "—",         "عنوان النافذة — مطلوب"],
                ["description",      "ReactNode",                  "—",         "نص توضيحي اختياري"],
                ["variant",          "'danger' | 'warning' | 'info' | 'success' | 'neutral'", "'neutral'", "النوع البصري"],
                ["icon",             "React.ElementType",          "حسب variant", "أيقونة مخصصة تحل محل الافتراضية"],
                ["confirmLabel",     "string",                     "حسب variant", "نص زر التأكيد"],
                ["cancelLabel",      "string",                     "'إلغاء'",   "نص زر الإلغاء"],
                ["loading",          "boolean",                    "false",     "يعرض spinner ويعطّل الأزرار"],
                ["closeOnBackdrop",  "boolean",                    "true",      "إغلاق عند النقر خارج النافذة"],
                ["checkboxLabel",    "string",                     "—",         "نص الـ checkbox الاختياري"],
                ["checkboxChecked",  "boolean",                    "false",     "حالة الـ checkbox"],
                ["onCheckboxChange", "(checked: boolean) => void", "—",         "تغيير حالة الـ checkbox"],
              ].map(([prop, type, def, desc], i) => (
                <tr key={prop as string} style={{ backgroundColor: i % 2 === 1 ? "var(--secondary)" : "var(--card)" }}>
                  <td className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
                    <code className="text-sm amount" style={{ color: "var(--primary)", fontWeight: 600 }}>{prop}</code>
                  </td>
                  <td className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
                    <code className="text-xs" style={{ color: "var(--muted-foreground)" }}>{type}</code>
                  </td>
                  <td className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
                    <code className="text-xs amount" style={{ color: "var(--muted-foreground)" }}>{def}</code>
                  </td>
                  <td className="px-5 py-2.5 border-b" style={{ borderColor: "var(--border)", color: "var(--foreground)", fontSize: "13px" }}>
                    {desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Active modal (portal) ───────────────────────────────────────── */}
      {openCfg && (
        <ConfirmModal
          open={true}
          variant={openCfg.variant}
          icon={openCfg.icon}
          title={openCfg.title}
          description={openCfg.description}
          confirmLabel={openCfg.confirmLabel}
          loading={loading}
          closeOnBackdrop={openCfg.closeOnBackdrop ?? true}
          checkboxLabel={openCfg.id === "delete" ? "لا تسألني مجدداً" : undefined}
          checkboxChecked={openCfg.id === "delete" ? dontShow : undefined}
          onCheckboxChange={openCfg.id === "delete" ? setDontShow : undefined}
          onCancel={() => { close(); setLastAction(null); }}
          onConfirm={() => {
            if (openCfg.async) {
              simulateAsync(openCfg.trigger);
            } else {
              setLastAction(openCfg.trigger);
              close();
            }
          }}
        />
      )}
    </div>
  );
}
