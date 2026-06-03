import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Settings2 } from "lucide-react";
import {
  SetupReadinessPage,
  type SetupReadinessItem,
  type SetupReadinessItemId,
} from "@/ui/components";

const initialItems: SetupReadinessItem[] = [
  {
    id: "fiscal-year",
    title: "السنة المالية",
    description: "السنة المالية 2026 موجودة وحالتها مفتوحة لاستقبال القيود والمستندات.",
    status: "ready",
    meta: "2026 · مفتوحة",
  },
  {
    id: "financial-period",
    title: "الفترة المالية",
    description: "الفترة الحالية موجودة ومفتوحة داخل السنة المالية النشطة.",
    status: "ready",
    meta: "يونيو 2026 · مفتوحة",
  },
  {
    id: "chart-of-accounts",
    title: "دليل الحسابات",
    description: "الحسابات الأساسية موجودة لكن حسابات تكلفة المخزون تحتاج مراجعة قبل التشغيل.",
    status: "needs-review",
    actionLabel: "مراجعة الحسابات",
    meta: "146 حساب · 3 حسابات تحتاج تصنيف",
  },
  {
    id: "main-cashbox",
    title: "الخزنة الرئيسية",
    description: "الخزنة الرئيسية موجودة ومربوطة بحساب النقدية الصحيح.",
    status: "ready",
    meta: "خزنة الإدارة · حساب 110101",
  },
  {
    id: "products",
    title: "المنتجات",
    description: "لا توجد منتجات أساسية كافية لبدء فواتير البيع والشراء.",
    status: "missing",
    actionLabel: "إضافة المنتجات",
    meta: "3 منتجات فقط · الحد الأدنى 10",
  },
  {
    id: "units",
    title: "الوحدات",
    description: "الوحدات الأساسية موجودة: طن، كيلو، شيكارة، عبوة.",
    status: "ready",
    meta: "4 وحدات نشطة",
  },
  {
    id: "unit-conversions",
    title: "تحويلات الوحدات",
    description: "تحويلات الكيلو والطن جاهزة، لكن تحويل الشيكارة لم يتم ضبطه لكل المنتجات.",
    status: "needs-review",
    actionLabel: "ضبط التحويلات",
    meta: "2 تحويل ناقص",
  },
  {
    id: "warehouses",
    title: "المخازن",
    description: "المخزن الرئيسي موجود ومفعل.",
    status: "ready",
    meta: "مخزن القاهرة الرئيسي",
  },
  {
    id: "basic-users",
    title: "المستخدمين الأساسيين",
    description: "مدير النظام والمحاسب موجودان، لكن أمين المخزن غير مكتمل الصلاحيات.",
    status: "needs-review",
    actionLabel: "مراجعة المستخدمين",
    meta: "3 مستخدمين · صلاحية ناقصة",
  },
  {
    id: "opening-balances",
    title: "الأرصدة الافتتاحية",
    description: "لم يتم اعتماد الأرصدة الافتتاحية للنقدية والمخزون.",
    status: "missing",
    actionLabel: "إدخال الأرصدة",
    meta: "النقدية والمخزون غير معتمدين",
  },
  {
    id: "driver-warehouse",
    title: "سواق مربوط بمخزن",
    description: "يوجد سواق مخصص للمخزن الرئيسي لتسجيل التحميل والتسليم.",
    status: "ready",
    meta: "أحمد محمد · مخزن القاهرة",
  },
  {
    id: "keeper-warehouse",
    title: "أمين مخزن مربوط بمخزن",
    description: "لم يتم ربط أمين مخزن مسؤول بالمخزن الرئيسي.",
    status: "missing",
    actionLabel: "ربط أمين مخزن",
    meta: "مخزن القاهرة بدون مسؤول",
  },
];

const screenNames: Partial<Record<SetupReadinessItemId | string, string>> = {
  "fiscal-year": "إعدادات السنوات المالية",
  "financial-period": "الفترات المالية",
  "chart-of-accounts": "دليل الحسابات",
  "main-cashbox": "الخزن والحسابات النقدية",
  products: "كتالوج المنتجات",
  units: "وحدات القياس",
  "unit-conversions": "تحويلات الوحدات",
  warehouses: "إدارة المخازن",
  "basic-users": "المستخدمين والصلاحيات",
  "opening-balances": "الأرصدة الافتتاحية",
  "driver-warehouse": "ربط السائقين بالمخازن",
  "keeper-warehouse": "ربط أمناء المخازن",
};

export function SystemReadinessSection() {
  const [lastOpened, setLastOpened] = useState<SetupReadinessItem | null>(null);
  const [items, setItems] = useState(initialItems);

  const openedScreen = lastOpened ? screenNames[lastOpened.id] ?? lastOpened.title : null;
  const missingCount = useMemo(() => items.filter((item) => item.status !== "ready").length, [items]);

  function completeItem(item: SetupReadinessItem) {
    setLastOpened(item);
    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              status: "ready",
              meta: `${entry.meta ?? "تم الإكمال"} · مكتمل الآن`,
            }
          : entry
      )
    );
  }

  return (
    <div className="space-y-6">
      <SetupReadinessPage
        items={items}
        updatedAtLabel="آخر فحص: اليوم 10:30 ص"
        onOpenItem={completeItem}
        onStartOperation={() => undefined}
      >
        <div className="qbs-surface p-4">
          <div className="flex items-start gap-3">
            <div className="qbs-icon-well h-10 w-10 bg-primary/10 text-primary">
              <Settings2 size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">محاكاة فتح شاشة الإكمال</p>
              {openedScreen ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  تم فتح شاشة: <span className="font-semibold text-foreground">{openedScreen}</span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  اضغط أي زر إكمال لعرض الشاشة التي سيذهب لها مدير النظام.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="qbs-surface p-4">
          <div className="flex items-center gap-2">
            {missingCount === 0 ? (
              <CheckCircle2 size={18} className="text-success" />
            ) : (
              <CircleAlert size={18} className="text-warning" />
            )}
            <p className="text-sm font-semibold text-foreground">
              {missingCount === 0 ? "النظام جاهز للتشغيل" : `${missingCount} عناصر تمنع التشغيل الكامل`}
            </p>
          </div>
        </div>
      </SetupReadinessPage>
    </div>
  );
}
