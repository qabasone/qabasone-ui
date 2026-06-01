export function TypographySection() {
  const scales = [
    { label: "4xl — 36px", class: "text-4xl font-bold", sample: "نظام قبس المحاسبي" },
    { label: "3xl — 30px", class: "text-3xl font-bold", sample: "إدارة الفواتير والمبيعات" },
    { label: "2xl — 24px", class: "text-2xl font-bold", sample: "ملخص الشهر المالي" },
    { label: "xl — 20px", class: "text-xl font-semibold", sample: "إجمالي المبيعات لهذا الأسبوع" },
    { label: "lg — 18px", class: "text-lg font-semibold", sample: "العملاء النشطون في النظام" },
    { label: "base — 15px", class: "text-base", sample: "يتم عرض بيانات الفاتورة وتفاصيل الدفع هنا" },
    { label: "sm — 13px", class: "text-sm", sample: "ملاحظة: يرجى التحقق من البيانات قبل الترحيل" },
    { label: "xs — 11px", class: "text-xs", sample: "آخر تحديث: ١٥ يناير ٢٠٢٤" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">الخطوط والمقاسات</h1>
        <p className="text-muted-foreground">
          خط Cairo — مناسب للواجهات العربية الاحترافية
        </p>
      </div>

      <section className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <h3 className="text-muted-foreground border-b border-border pb-3">مقياس الخط</h3>
        {scales.map((s) => (
          <div key={s.label} className="flex items-baseline gap-6 border-b border-border pb-4 last:border-0 last:pb-0">
            <span className="text-xs text-muted-foreground w-28 shrink-0 font-mono">{s.label}</span>
            <span className={s.class}>{s.sample}</span>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h3>الأوزان</h3>
          {[
            { w: "font-light", label: "خفيف — 300", sample: "نظام قبس للمحاسبة" },
            { w: "font-normal", label: "عادي — 400", sample: "نظام قبس للمحاسبة" },
            { w: "font-medium", label: "متوسط — 500", sample: "نظام قبس للمحاسبة" },
            { w: "font-semibold", label: "شبه عريض — 600", sample: "نظام قبس للمحاسبة" },
            { w: "font-bold", label: "عريض — 700", sample: "نظام قبس للمحاسبة" },
          ].map((f) => (
            <div key={f.w} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <span className={`text-base ${f.w}`}>{f.sample}</span>
              <span className="text-xs text-muted-foreground">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <h3>الأنواع المخصصة</h3>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">AmountText — المبالغ المالية</p>
            <p className="text-2xl font-semibold amount text-foreground">45,750.00 ج.م</p>
          </div>
          <div className="space-y-1 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">NumberText — الأرقام</p>
            <p className="text-xl font-medium amount text-foreground">1,234</p>
          </div>
          <div className="space-y-1 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">CodeText — رقم الفاتورة / المستند</p>
            <p className="font-mono text-base text-foreground amount">INV-2024-0123</p>
          </div>
          <div className="space-y-1 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">MutedText — نص ثانوي</p>
            <p className="text-sm text-muted-foreground">هذا النص يُستخدم للمعلومات الثانوية والملاحظات</p>
          </div>
          <div className="space-y-1 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">ErrorText — رسالة خطأ</p>
            <p className="text-sm text-destructive">هذا الحقل مطلوب</p>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-4">نموذج نص كامل</h3>
        <div className="space-y-3 max-w-prose">
          <h1>فاتورة مبيعات رقم INV-2024-0125</h1>
          <h2 className="text-muted-foreground">شركة النور للتجارة</h2>
          <p className="text-base">
            يُقر بموجب هذه الفاتورة بأنه قد تم تسليم البضاعة المذكورة أدناه وفقاً للشروط المتفق عليها بين الطرفين.
          </p>
          <p className="text-sm text-muted-foreground">
            تاريخ الإصدار: ١٥ يناير ٢٠٢٤ — تاريخ الاستحقاق: ١٥ فبراير ٢٠٢٤
          </p>
          <p className="text-2xl font-bold amount">45,750.00 ج.م</p>
        </div>
      </section>
    </div>
  );
}
