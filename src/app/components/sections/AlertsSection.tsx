import { ToastItem, useToast } from "../Toast";
import type { ToastVariant, ToastPosition } from "../Toast";

// ── Static preview row ────────────────────────────────────────────────────────

function PreviewRow({
  variant,
  label,
  compact,
}: {
  variant: ToastVariant;
  label: string;
  compact: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-xs text-muted-foreground w-20 shrink-0 pt-2.5">{label}</span>
      <ToastItem
        animate={false}
        data={{
          variant,
          title: compact ? "تنبيه النظام" : "تنبيه النظام",
          description: compact
            ? undefined
            : "تُعلم التنبيهات المستخدم بالحالة الحالية أو نتيجة إجراء ما. يمكن أن تكون معلوماتية أو تأكيدية أو تحذيرية.",
          closable: true,
          action: { label: "تأكيد", onClick: () => {} },
          secondaryAction: { label: "إغلاق", onClick: () => {} },
        }}
      />
    </div>
  );
}

// ── Live demo buttons ─────────────────────────────────────────────────────────

const DEMO_POSITIONS: { pos: ToastPosition; label: string }[] = [
  { pos: "top-right",    label: "أعلى يمين" },
  { pos: "top-left",     label: "أعلى يسار" },
  { pos: "bottom-right", label: "أسفل يمين" },
  { pos: "bottom-left",  label: "أسفل يسار" },
];

const DEMO_VARIANTS: { variant: ToastVariant; label: string }[] = [
  { variant: "info",    label: "معلومة" },
  { variant: "success", label: "نجاح" },
  { variant: "warning", label: "تحذير" },
  { variant: "error",   label: "خطأ" },
];

const VARIANT_COLORS: Record<ToastVariant, string> = {
  info:    "var(--info)",
  success: "var(--success)",
  warning: "var(--warning)",
  error:   "var(--destructive)",
};

const VARIANT_BG: Record<ToastVariant, string> = {
  info:    "var(--info-muted)",
  success: "var(--success-muted)",
  warning: "var(--warning-muted)",
  error:   "var(--destructive-muted)",
};

function DemoGrid() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {/* Position × Variant matrix */}
      <div>
        <p className="text-xs text-muted-foreground mb-3" style={{ fontWeight: 500 }}>
          اضغط لإطلاق تنبيه تجريبي في الموضع المطلوب
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DEMO_POSITIONS.map(({ pos, label }) => (
            <div key={pos} className="bg-muted rounded-xl p-3 space-y-2">
              <p className="text-xs text-muted-foreground text-center" style={{ fontWeight: 500 }}>{label}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {DEMO_VARIANTS.map(({ variant, label: vLabel }) => (
                  <button
                    key={variant}
                    onClick={() =>
                      toast({
                        variant,
                        position: pos,
                        title: vLabel,
                        description: "هذا مثال على تنبيه حي يظهر في الموضع المحدد.",
                        action: { label: "تفاصيل", onClick: () => {} },
                        secondaryAction: { label: "تجاهل", onClick: () => {} },
                        duration: 4000,
                      })
                    }
                    className="h-7 rounded-lg text-xs transition-opacity hover:opacity-85 active:scale-95"
                    style={{
                      backgroundColor: VARIANT_BG[variant],
                      color: VARIANT_COLORS[variant],
                      fontWeight: 600,
                    }}
                  >
                    {vLabel}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick-fire examples */}
      <div>
        <p className="text-xs text-muted-foreground mb-3" style={{ fontWeight: 500 }}>
          أمثلة سريعة — مدمجة (بدون وصف)
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { variant: "success" as ToastVariant, title: "تم حفظ الفاتورة بنجاح", action: "عرض", pos: "bottom-right" as ToastPosition },
            { variant: "error"   as ToastVariant, title: "فشل الاتصال بالخادم", action: "إعادة المحاولة", pos: "bottom-right" as ToastPosition },
            { variant: "warning" as ToastVariant, title: "رصيد المخزون منخفض", action: "طلب شراء", pos: "top-right" as ToastPosition },
            { variant: "info"    as ToastVariant, title: "تم إرسال التقرير بالبريد", pos: "bottom-left" as ToastPosition },
          ].map(({ variant, title, action, pos }) => (
            <button
              key={title}
              onClick={() =>
                toast({ variant, title, position: pos, action: action ? { label: action, onClick: () => {} } : undefined, duration: 5000 })
              }
              className="h-8 px-3 rounded-xl border border-border text-xs hover:bg-muted transition-colors"
              style={{ fontWeight: 500 }}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* Persistent example */}
      <div>
        <p className="text-xs text-muted-foreground mb-3" style={{ fontWeight: 500 }}>
          تنبيه دائم (duration: 0) — لا يُغلق تلقائياً
        </p>
        <button
          onClick={() =>
            toast({
              variant: "warning",
              position: "top-right",
              title: "انتهت صلاحية الجلسة",
              description: "لم يتم رصد أي نشاط منذ 30 دقيقة. سيتم تسجيل خروجك خلال 5 دقائق.",
              action: { label: "تجديد الجلسة", onClick: () => {} },
              secondaryAction: { label: "تسجيل الخروج", onClick: () => {} },
              duration: 0,
            })
          }
          className="h-8 px-4 rounded-xl border border-border text-xs hover:bg-muted transition-colors"
          style={{ fontWeight: 500 }}
        >
          إطلاق تنبيه دائم (أعلى يمين)
        </button>
      </div>
    </div>
  );
}

// ── Props reference ────────────────────────────────────────────────────────────

const PROPS = [
  { prop: "variant",         type: "'info' | 'success' | 'warning' | 'error'", default: "'info'",         desc: "النمط البصري للتنبيه" },
  { prop: "title",           type: "string",                                    default: "—",               desc: "العنوان الرئيسي (مطلوب)" },
  { prop: "description",     type: "string",                                    default: "undefined",       desc: "وصف موسّع — يُفعّل التخطيط المتعدد الأسطر" },
  { prop: "action",          type: "{ label, onClick }",                        default: "undefined",       desc: "زر الإجراء الأساسي" },
  { prop: "secondaryAction", type: "{ label, onClick }",                        default: "undefined",       desc: "رابط إجراء ثانوي" },
  { prop: "closable",        type: "boolean",                                   default: "true",            desc: "إظهار زر الإغلاق ×" },
  { prop: "duration",        type: "number (ms)",                               default: "4000",            desc: "وقت الإغلاق التلقائي — 0 يعني دائم" },
  { prop: "position",        type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'bottom-right'", desc: "الزاوية التي يظهر فيها التنبيه" },
];

// ── Main section ──────────────────────────────────────────────────────────────

export function AlertsSection() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">التنبيهات (Toast)</h1>
        <p className="text-muted-foreground">مكوّن قابل لإعادة الاستخدام — 4 أنماط · مدمج وموسّع · 4 مواضع · RTL</p>
      </div>

      {/* Compact previews */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-5">مدمج — بدون وصف</h3>
        <div className="space-y-4">
          {(["info", "success", "warning", "error"] as ToastVariant[]).map((v) => (
            <PreviewRow key={v} variant={v} compact label={
              v === "info" ? "معلومة" : v === "success" ? "نجاح" : v === "warning" ? "تحذير" : "خطأ"
            } />
          ))}
        </div>
      </section>

      {/* Expanded previews */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-5">موسّع — مع وصف وإجراءات</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          {(["info", "success", "warning", "error"] as ToastVariant[]).map((v) => (
            <ToastItem
              key={v}
              animate={false}
              data={{
                variant: v,
                title:
                  v === "info"    ? "تحديث النظام متاح"         :
                  v === "success" ? "تم حفظ الفاتورة بنجاح"    :
                  v === "warning" ? "رصيد المخزون منخفض"        :
                                   "فشل الاتصال بالخادم",
                description:
                  v === "info"    ? "يتوفر إصدار جديد من النظام. يُنصح بالتحديث للحصول على أحدث الميزات وإصلاحات الأمان." :
                  v === "success" ? "تم حفظ فاتورة رقم INV-2024-0130 بنجاح وإرسال نسخة للعميل عبر البريد الإلكتروني." :
                  v === "warning" ? "كمية أرز غلا أقل من الحد الأدنى (2 طن). يُنصح بإصدار أمر شراء جديد في أقرب وقت." :
                                   "تعذّر الاتصال بالخادم الرئيسي. يُرجى التحقق من الشبكة والمحاولة مجدداً.",
                closable: true,
                action: {
                  label: v === "info" ? "تحديث الآن" : v === "success" ? "عرض الفاتورة" : v === "warning" ? "طلب شراء" : "إعادة المحاولة",
                  onClick: () => {},
                },
                secondaryAction: { label: "تجاهل", onClick: () => {} },
              }}
            />
          ))}
        </div>
      </section>

      {/* Live demo */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-5">تجربة حية — أطلق تنبيهاً فعلياً</h3>
        <DemoGrid />
      </section>

      {/* Props table */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3>الخصائص — <code className="text-sm text-primary bg-primary/8 px-1.5 py-0.5 rounded-md">toast(options)</code></h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-right px-5 py-3 text-xs text-muted-foreground" style={{ fontWeight: 600 }}>الخاصية</th>
                <th className="text-right px-5 py-3 text-xs text-muted-foreground" style={{ fontWeight: 600 }}>النوع</th>
                <th className="text-right px-5 py-3 text-xs text-muted-foreground" style={{ fontWeight: 600 }}>الافتراضي</th>
                <th className="text-right px-5 py-3 text-xs text-muted-foreground" style={{ fontWeight: 600 }}>الوصف</th>
              </tr>
            </thead>
            <tbody>
              {PROPS.map((p, i) => (
                <tr key={p.prop} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                  <td className="px-5 py-3">
                    <code className="text-xs text-primary bg-primary/8 px-1.5 py-0.5 rounded-md">{p.prop}</code>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{p.type}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{p.default}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Usage snippet */}
        <div className="border-t border-border bg-muted/30 px-6 py-4">
          <p className="text-xs text-muted-foreground mb-2" style={{ fontWeight: 600 }}>مثال على الاستخدام</p>
          <pre className="text-xs text-foreground leading-relaxed overflow-x-auto" dir="ltr">{`const { toast, dismiss } = useToast();

// Compact info
toast({ variant: "info", title: "تم إرسال التقرير" });

// Expanded success with actions
const id = toast({
  variant: "success",
  position: "bottom-right",
  title: "تم الحفظ بنجاح",
  description: "تم حفظ الفاتورة وإرسالها للعميل.",
  action: { label: "عرض", onClick: () => navigate("/invoices/123") },
  secondaryAction: { label: "تراجع", onClick: () => dismiss(id) },
  duration: 6000,
});

// Persistent — user must close manually
toast({ variant: "warning", title: "انتهت الجلسة", duration: 0 });`}</pre>
        </div>
      </section>
    </div>
  );
}
