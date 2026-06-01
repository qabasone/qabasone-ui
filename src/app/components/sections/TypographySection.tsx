import { AmountText, CodeText, NumberText, Text } from "@/ui/components/Typography";
import type { TypographyVariant } from "@/ui/components/Typography";

export function TypographySection() {
  const scales: Array<{ label: string; variant: TypographyVariant; sample: string }> = [
    { label: "4xl — 36px", variant: "display-4xl", sample: "نظام قبس المحاسبي" },
    { label: "3xl — 30px", variant: "display-3xl", sample: "إدارة الفواتير والمبيعات" },
    { label: "2xl — 24px", variant: "display-2xl", sample: "ملخص الشهر المالي" },
    { label: "xl — 20px", variant: "title-xl", sample: "إجمالي المبيعات لهذا الأسبوع" },
    { label: "lg — 18px", variant: "title-lg", sample: "العملاء النشطون في النظام" },
    { label: "base — 15px", variant: "body", sample: "يتم عرض بيانات الفاتورة وتفاصيل الدفع هنا" },
    { label: "sm — 13px", variant: "body-sm", sample: "ملاحظة: يرجى التحقق من البيانات قبل الترحيل" },
    { label: "xs — 11px", variant: "caption", sample: "آخر تحديث: ١٥ يناير ٢٠٢٤" },
  ];

  const weights = [
    { className: "font-light", label: "خفيف — 300", sample: "نظام قبس للمحاسبة" },
    { className: "font-normal", label: "عادي — 400", sample: "نظام قبس للمحاسبة" },
    { className: "font-medium", label: "متوسط — 500", sample: "نظام قبس للمحاسبة" },
    { className: "font-semibold", label: "شبه عريض — 600", sample: "نظام قبس للمحاسبة" },
    { className: "font-bold", label: "عريض — 700", sample: "نظام قبس للمحاسبة" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <Text as="h1" variant="display-2xl" className="mb-1">
          الخطوط والمقاسات
        </Text>
        <Text as="p" variant="body" tone="muted">
          خط IBM Plex Sans Arabic — مناسب للواجهات العربية الاحترافية
        </Text>
      </div>

      <section className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <Text as="h3" variant="body-sm" tone="muted" className="border-b border-border pb-3">
          مقياس الخط
        </Text>
        {scales.map((scale) => (
          <div key={scale.label} className="flex items-baseline gap-6 border-b border-border pb-4 last:border-0 last:pb-0">
            <span className="text-xs text-muted-foreground w-28 shrink-0 font-mono">{scale.label}</span>
            <Text variant={scale.variant}>{scale.sample}</Text>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <Text as="h3" variant="title-lg">
            الأوزان
          </Text>
          {weights.map((weight) => (
            <div key={weight.className} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <Text variant="body" className={weight.className}>
                {weight.sample}
              </Text>
              <Text variant="caption" tone="muted">
                {weight.label}
              </Text>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <Text as="h3" variant="title-lg">
            الأنواع المخصصة
          </Text>

          <div className="space-y-1">
            <Text as="p" variant="caption" tone="muted">
              AmountText — المبالغ المالية
            </Text>
            <AmountText value="45,750.00" currency="ج.م" />
          </div>

          <div className="space-y-1 border-t border-border pt-4">
            <Text as="p" variant="caption" tone="muted">
              NumberText — الأرقام
            </Text>
            <NumberText value="1,234" />
          </div>

          <div className="space-y-1 border-t border-border pt-4">
            <Text as="p" variant="caption" tone="muted">
              CodeText — رقم الفاتورة / المستند
            </Text>
            <CodeText value="INV-2024-0123" />
          </div>

          <div className="space-y-1 border-t border-border pt-4">
            <Text as="p" variant="caption" tone="muted">
              MutedText — نص ثانوي
            </Text>
            <Text as="p" variant="body-sm" tone="muted">
              هذا النص يُستخدم للمعلومات الثانوية والملاحظات
            </Text>
          </div>

          <div className="space-y-1 border-t border-border pt-4">
            <Text as="p" variant="caption" tone="muted">
              ErrorText — رسالة خطأ
            </Text>
            <Text as="p" variant="body-sm" tone="error">
              هذا الحقل مطلوب
            </Text>
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <Text as="p" variant="caption" tone="muted">
              Arabic-Indic Numbers — الأرقام العربية الهندية
            </Text>

            <div className="flex items-center justify-between gap-3">
              <Text as="span" variant="caption" tone="muted">
                Amount
              </Text>
              <AmountText variant="title-lg" value="45,750.00" currency="ج.م" numericSystem="arabic-indic" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Text as="span" variant="caption" tone="muted">
                Number
              </Text>
              <NumberText as="p" variant="body" value="1,234,567" numericSystem="arabic-indic" className="font-medium amount" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Text as="span" variant="caption" tone="muted">
                Date
              </Text>
              <NumberText as="p" variant="body-sm" value="15-01-2024" numericSystem="arabic-indic" className="amount" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6">
        <Text as="h3" variant="title-lg" className="mb-4">
          نموذج نص كامل
        </Text>
        <div className="space-y-3 max-w-prose">
          <Text as="h1" variant="display-2xl">
            فاتورة مبيعات رقم INV-2024-0125
          </Text>
          <Text as="h2" variant="title-xl" tone="muted">
            شركة النور للتجارة
          </Text>
          <Text as="p" variant="body">
            يُقر بموجب هذه الفاتورة بأنه قد تم تسليم البضاعة المذكورة أدناه وفقًا للشروط المتفق عليها بين الطرفين.
          </Text>
          <Text as="p" variant="body-sm" tone="muted">
            تاريخ الإصدار: ١٥ يناير ٢٠٢٤ — تاريخ الاستحقاق: ١٥ فبراير ٢٠٢٤
          </Text>
          <AmountText as="p" variant="display-2xl" value="45,750.00" currency="ج.م" className="font-bold" />
        </div>
      </section>
    </div>
  );
}
