function Badge({
  children,
  variant = "default",
  dot,
  size = "md",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted" | "primary";
  dot?: boolean;
  size?: "sm" | "md";
}) {
  const styles: Record<string, string> = {
    default: "bg-foreground/10 text-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-destructive/10 text-destructive",
    info: "bg-info/10 text-info",
    muted: "bg-muted text-muted-foreground",
  };

  const dotColors: Record<string, string> = {
    default: "bg-foreground",
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
    info: "bg-info",
    muted: "bg-muted-foreground",
  };

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClass} ${styles[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

function SolidBadge({ children, bg, text }: { children: React.ReactNode; bg: string; text: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      {children}
    </span>
  );
}

export function BadgesSection() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">الشارات والحالات</h1>
        <p className="text-muted-foreground">جميع أنواع الشارات وعلامات الحالة في النظام</p>
      </div>

      {/* Generic badges */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <h3>الشارات العامة</h3>

        <div>
          <p className="text-sm text-muted-foreground mb-3">شارات مع خلفية فاتحة</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">رئيسي</Badge>
            <Badge variant="success">نجاح</Badge>
            <Badge variant="warning">تحذير</Badge>
            <Badge variant="danger">خطأ</Badge>
            <Badge variant="info">معلومة</Badge>
            <Badge variant="muted">محايد</Badge>
            <Badge variant="default">عادي</Badge>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-3">شارات مع نقطة الحالة</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary" dot>نشط</Badge>
            <Badge variant="success" dot>متصل</Badge>
            <Badge variant="warning" dot>في الانتظار</Badge>
            <Badge variant="danger" dot>خطأ</Badge>
            <Badge variant="muted" dot>غير نشط</Badge>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-3">حجم صغير</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary" size="sm">رئيسي</Badge>
            <Badge variant="success" size="sm">نجاح</Badge>
            <Badge variant="warning" size="sm">تحذير</Badge>
            <Badge variant="danger" size="sm">خطأ</Badge>
            <Badge variant="muted" size="sm">محايد</Badge>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-3">شارات خلفية كاملة</p>
          <div className="flex flex-wrap gap-2">
            <SolidBadge bg="#2563eb" text="white">رئيسي</SolidBadge>
            <SolidBadge bg="#16a34a" text="white">نجاح</SolidBadge>
            <SolidBadge bg="#d97706" text="white">تحذير</SolidBadge>
            <SolidBadge bg="#dc2626" text="white">خطأ</SolidBadge>
            <SolidBadge bg="#0284c7" text="white">معلومة</SolidBadge>
            <SolidBadge bg="#64748b" text="white">محايد</SolidBadge>
          </div>
        </div>
      </section>

      {/* Invoice statuses */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>حالات الفواتير</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { status: "مدفوعة", bg: "#dcfce7", text: "#15803d", desc: "الفاتورة سددت بالكامل" },
            { status: "في الانتظار", bg: "#fef3c7", text: "#92400e", desc: "لم يتم السداد بعد" },
            { status: "متأخرة", bg: "#fee2e2", text: "#991b1b", desc: "تجاوزت تاريخ الاستحقاق" },
            { status: "مسودة", bg: "#f1f5f9", text: "#475569", desc: "لم يتم الترحيل بعد" },
          ].map((s) => (
            <div key={s.status} className="flex items-center justify-between p-3 rounded-xl border border-border">
              <div>
                <p className="text-sm text-foreground">{s.desc}</p>
              </div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: s.bg, color: s.text }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.text }} />
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Payment statuses */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>حالات الدفع</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "مكتمل", bg: "#dcfce7", text: "#15803d" },
            { label: "جزئي", bg: "#e0f2fe", text: "#075985" },
            { label: "فشل", bg: "#fee2e2", text: "#991b1b" },
            { label: "مسترد", bg: "#fef3c7", text: "#92400e" },
          ].map((s) => (
            <SolidBadge key={s.label} bg={s.bg} text={s.text}>{s.label}</SolidBadge>
          ))}
        </div>
      </section>

      {/* More accounting badges */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-5">
        <h3>شارات محاسبية إضافية</h3>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">حالة العميل</p>
          <div className="flex gap-2">
            <Badge variant="success" dot>نشط</Badge>
            <Badge variant="muted" dot>غير نشط</Badge>
            <Badge variant="danger" dot>محظور</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">حالة المصروف</p>
          <div className="flex gap-2">
            <Badge variant="success" dot>معتمد</Badge>
            <Badge variant="warning" dot>قيد المراجعة</Badge>
            <Badge variant="danger" dot>مرفوض</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">حالة التسوية</p>
          <div className="flex gap-2">
            <Badge variant="success" dot>مطابق</Badge>
            <Badge variant="danger" dot>غير مطابق</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">الأدوار</p>
          <div className="flex gap-2">
            <Badge variant="primary">مدير النظام</Badge>
            <Badge variant="info">محاسب</Badge>
            <Badge variant="muted">أمين مخزن</Badge>
            <Badge variant="default">سواق</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">شارة العدد (Count Badge)</p>
          <div className="flex items-center gap-4">
            {[
              { label: "إشعارات", count: 5 },
              { label: "فواتير معلقة", count: 12 },
              { label: "رسائل", count: 3 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-sm text-foreground">{item.label}</span>
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-destructive text-white text-xs font-bold flex items-center justify-center">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
