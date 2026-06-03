import { useMemo, useState } from "react";
import { ArrowLeft, FileText, Route, UserRound } from "lucide-react";
import {
  OperationalAlertsPage,
  type OperationalAlert,
} from "@/ui/components";

const alerts: OperationalAlert[] = [
  {
    id: "period-closed",
    type: "closed-financial-period",
    title: "فترة مالية مقفولة",
    description: "هناك محاولة تسجيل مستند داخل فترة يناير 2026 وهي مقفولة بالفعل.",
    severity: "critical",
    sourceLabel: "الفترة المالية: يناير 2026",
    ownerLabel: "المحاسبة",
    ageLabel: "منذ ساعتين",
    actionLabel: "فتح الفترة",
  },
  {
    id: "entry-unposted",
    type: "unposted-journal-entry",
    title: "قيد غير مرحل",
    description: "قيد مصروفات تشغيل محفوظ كمسودة ولم يتم ترحيله إلى الأستاذ العام.",
    severity: "warning",
    sourceLabel: "قيد JV-2026-0042",
    ownerLabel: "أحمد المحاسب",
    ageLabel: "منذ يوم",
    amountLabel: "18,500 ج.م",
    actionLabel: "فتح القيد",
  },
  {
    id: "sale-low-stock",
    type: "sale-failed-low-stock",
    title: "بيع فشل بسبب نقص مخزون",
    description: "فاتورة بيع لم تكتمل لأن كمية أرز بسمتي المتاحة أقل من الكمية المطلوبة.",
    severity: "critical",
    sourceLabel: "فاتورة SO-2026-0118",
    ownerLabel: "مبيعات القاهرة",
    ageLabel: "منذ 35 دقيقة",
    actionLabel: "فتح الفاتورة",
  },
  {
    id: "product-no-conversion",
    type: "product-without-unit-conversion",
    title: "منتج بدون تحويل وحدة",
    description: "منتج زيت ذرة لديه وحدة بيع بالكرتونة بدون تحويل مع وحدة المخزون الأساسية.",
    severity: "warning",
    sourceLabel: "منتج: زيت ذرة",
    ownerLabel: "مسؤول المنتجات",
    ageLabel: "منذ 3 أيام",
    actionLabel: "ضبط التحويل",
  },
  {
    id: "cashbox-negative",
    type: "negative-cashbox-balance",
    title: "خزنة رصيدها سالب",
    description: "خزنة الفرع سجلت مدفوعات أكبر من الرصيد المتاح.",
    severity: "critical",
    sourceLabel: "خزنة فرع الجيزة",
    ownerLabel: "أمين الخزنة",
    amountLabel: "-4,250 ج.م",
    actionLabel: "فتح الخزنة",
  },
  {
    id: "old-custody",
    type: "old-open-custody",
    title: "عهدة مفتوحة من فترة طويلة",
    description: "عهدة مشتريات خارجية لم يتم تسويتها منذ أكثر من 14 يوم.",
    severity: "warning",
    sourceLabel: "عهدة CUS-2026-009",
    ownerLabel: "مندوب المشتريات",
    ageLabel: "18 يوم",
    amountLabel: "12,000 ج.م",
    actionLabel: "فتح العهدة",
  },
  {
    id: "driver-shortage",
    type: "driver-journal-shortage",
    title: "يومية سواق بها عجز",
    description: "يومية السواق أحمد محمد بها عجز بين النقدية المحصلة والفواتير المسلمة.",
    severity: "critical",
    sourceLabel: "يومية DRJ-2026-023",
    ownerLabel: "أحمد محمد",
    ageLabel: "رحلة أمس",
    amountLabel: "750 ج.م عجز",
    actionLabel: "فتح تفاصيل اليومية",
  },
  {
    id: "driver-surplus",
    type: "driver-journal-surplus",
    title: "يومية سواق بها زيادة",
    description: "يومية السواق محمود علي بها زيادة نقدية تحتاج مراجعة قبل الإقفال.",
    severity: "warning",
    sourceLabel: "يومية DRJ-2026-024",
    ownerLabel: "محمود علي",
    ageLabel: "منذ 6 ساعات",
    amountLabel: "320 ج.م زيادة",
    actionLabel: "فتح اليومية",
  },
  {
    id: "zero-stock",
    type: "zero-stock-product",
    title: "منتج رصيده صفر",
    description: "رصيد منتج قمح صلب وصل إلى صفر في المخزن الرئيسي.",
    severity: "info",
    sourceLabel: "مخزن القاهرة الرئيسي",
    ownerLabel: "أمين المخزن",
    actionLabel: "فتح كارت الصنف",
  },
];

const targetAlertId = "driver-shortage";

export function OperationalAlertsSection() {
  const [openedAlert, setOpenedAlert] = useState<OperationalAlert | null>(
    alerts.find((alert) => alert.id === targetAlertId) ?? alerts[0]
  );

  const openedRoute = useMemo(() => {
    if (!openedAlert) return null;
    if (openedAlert.type === "driver-journal-shortage") {
      return "/drivers/journals/DRJ-2026-023";
    }
    return `/alerts/${openedAlert.id}`;
  }, [openedAlert]);

  return (
    <OperationalAlertsPage
      alerts={alerts}
      selectedAlertId={openedAlert?.id}
      updatedAtLabel="آخر تحديث: منذ 4 دقائق"
      onOpenAlert={setOpenedAlert}
    >
      <div className="qbs-surface p-4">
        <div className="flex items-start gap-3">
          <div className="qbs-icon-well h-10 w-10 bg-primary/10 text-primary">
            <Route size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">المسار المفتوح مباشرة</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {openedRoute ?? "لم يتم فتح تنبيه بعد"}
            </p>
            {openedAlert?.id === targetAlertId ? (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                <ArrowLeft size={12} />
                تم فتح تفاصيل اليومية التي بها عجز مباشرة
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {openedAlert?.id === targetAlertId ? (
        <div className="qbs-surface overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">تفاصيل اليومية</p>
          </div>
          <div className="space-y-3 p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">رقم اليومية</span>
              <span className="font-semibold text-foreground amount">DRJ-2026-023</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">السواق</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                <UserRound size={14} />
                أحمد محمد
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">الفواتير المسلمة</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                <FileText size={14} />
                12 فاتورة
              </span>
            </div>
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-destructive">
              <p className="text-xs font-semibold">قيمة العجز</p>
              <p className="mt-1 text-lg font-bold amount">750 ج.م</p>
            </div>
          </div>
        </div>
      ) : null}
    </OperationalAlertsPage>
  );
}
