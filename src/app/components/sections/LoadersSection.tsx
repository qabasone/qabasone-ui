import { useState } from "react";
import {
  DatabaseZap,
  FileDown,
  Layers3,
  PackageCheck,
  Receipt,
  RefreshCw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/ui/components/Button";
import {
  QabasInlineLoader,
  QabasLoader,
  QabasLoadingOverlay,
  QabasPageLoader,
  QabasSkeleton,
} from "@/ui/components/BrandLoader";

const pageSteps = [
  { id: "company", label: "تحميل بيانات الشركة", status: "done" as const },
  { id: "fiscal", label: "مراجعة السنة والفترة المالية", status: "active" as const },
  { id: "permissions", label: "تجهيز صلاحيات المستخدم", status: "pending" as const },
];

const useCases = [
  {
    icon: RefreshCw,
    title: "تحميل الصفحة",
    text: "استخدم QabasPageLoader عند فتح شاشة تحتاج بيانات أساسية قبل العرض.",
  },
  {
    icon: DatabaseZap,
    title: "تحديث البيانات",
    text: "استخدم QabasLoadingOverlay فوق جدول أو بطاقة أثناء إعادة الجلب.",
  },
  {
    icon: FileDown,
    title: "تنفيذ إجراء",
    text: "استخدم QabasInlineLoader داخل مساحة صغيرة بجوار زر أو حالة حفظ.",
  },
  {
    icon: Layers3,
    title: "تحميل محتوى جزئي",
    text: "استخدم QabasSkeleton عندما تريد الحفاظ على شكل الصفحة أثناء انتظار المحتوى.",
  },
];

export function LoadersSection() {
  const [overlayLoading, setOverlayLoading] = useState(true);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-1 text-foreground">اللودرز</h1>
        <p className="max-w-3xl text-muted-foreground">
          مكونات تحميل قابلة لإعادة الاستخدام بهوية قابس: علامة عربية واضحة، حركة دفتر مالية، وسلوك وصولي مناسب لحالات تحميل الصفحة أو تحديث البيانات.
        </p>
      </div>

      <section className="qbs-surface overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-semibold text-foreground">لودر صفحة كامل</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            مناسب لأول تحميل بعد تسجيل الدخول أو عند فتح شاشة تحتاج setup كامل قبل التعامل معها.
          </p>
        </div>
        <div className="p-5">
          <QabasPageLoader
            label="جاري تجهيز شاشة الفواتير"
            description="نراجع الفترة المالية، صلاحيات المستخدم، وآخر حالة مزامنة قبل عرض البيانات."
            steps={pageSteps}
            footer="يمكن تمرير fullScreen=true لاستخدامه كلودر فعلي يغطي الصفحة."
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="qbs-surface overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Overlay فوق المحتوى</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                يحافظ على سياق الشاشة أثناء تحديث جدول أو بطاقة.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              startIcon={<RefreshCw size={15} />}
              onClick={() => setOverlayLoading((value) => !value)}
            >
              تبديل الحالة
            </Button>
          </div>
          <div className="p-5">
            <QabasLoadingOverlay
              loading={overlayLoading}
              label="جاري تحديث المخزون"
              description="آخر حركة للمخزن الرئيسي"
              className="overflow-hidden rounded-xl"
            >
              <InventoryPreview />
            </QabasLoadingOverlay>
          </div>
        </section>

        <section className="qbs-surface overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-semibold text-foreground">لودرز صغيرة داخل الواجهة</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              لحالات الحفظ والترحيل والتصدير بدون تشويش على باقي الصفحة.
            </p>
          </div>
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/25 p-4">
              <Button size="sm" loading>
                حفظ الفاتورة
              </Button>
              <QabasInlineLoader label="جاري حفظ المسودة" description="لن يتم إغلاق النافذة قبل اكتمال الحفظ." />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <QabasLoader
                  label="ترحيل القيد"
                  description="فحص الفترة المالية"
                  tone="success"
                  size="md"
                />
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <QabasInlineLoader label="انتظار الاعتماد" tone="warning" compact />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="qbs-surface overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-semibold text-foreground">Skeleton بنفس الهوية</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            يستخدم عند تحميل صفوف أو بطاقات قبل وصول البيانات.
          </p>
        </div>
        <div className="grid gap-4 p-5 lg:grid-cols-3">
          <QabasSkeleton avatar rows={4} actions />
          <QabasSkeleton rows={5} dense />
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <PackageCheck size={16} className="text-primary" />
              مخزون قيد التحميل
            </div>
            <QabasSkeleton rows={3} dense className="border-0 p-0 shadow-none" />
          </div>
        </div>
      </section>

      <section className="qbs-surface overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-semibold text-foreground">حالات الاستخدام</p>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item) => (
            <UseCaseCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="qbs-surface overflow-hidden">
        <div className="border-b border-border px-5 py-3">
          <p className="text-sm font-semibold text-foreground">استخدام مختصر</p>
        </div>
        <pre className="overflow-x-auto bg-muted/20 p-5 text-xs leading-relaxed text-foreground" dir="ltr">{`import {
  QabasPageLoader,
  QabasLoadingOverlay,
  QabasInlineLoader,
  QabasSkeleton,
} from "@qabasone/qabasone-ui/components/BrandLoader";

<QabasPageLoader fullScreen label="جاري تجهيز النظام" />

<QabasLoadingOverlay loading={isLoading} label="جاري تحديث الفواتير">
  <InvoicesTable />
</QabasLoadingOverlay>`}</pre>
      </section>
    </div>
  );
}

function InventoryPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
        <Receipt size={16} className="text-primary" />
        <p className="text-sm font-semibold text-foreground">حركات المخزون اليوم</p>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-muted/20 text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-start">الصنف</th>
            <th className="px-4 py-3 text-start">المخزن</th>
            <th className="px-4 py-3 text-start">الرصيد</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[
            ["أرز فاخر", "المخزن الرئيسي", "٢٤٠ كرتونة"],
            ["زيت طعام", "مخزن التوزيع", "٩٦ عبوة"],
            ["سكر", "المخزن الرئيسي", "١٨٠ شيكارة"],
          ].map(([name, store, balance]) => (
            <tr key={name}>
              <td className="px-4 py-3 font-medium text-foreground">{name}</td>
              <td className="px-4 py-3 text-muted-foreground">{store}</td>
              <td className="px-4 py-3 text-foreground">{balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UseCaseCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-primary"
        style={{ backgroundColor: "var(--primary-muted)" }}
      >
        <Icon size={17} />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}
