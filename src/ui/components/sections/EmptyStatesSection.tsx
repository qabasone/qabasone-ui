import { FileText, Users, ShoppingCart, TrendingDown, Search, ServerCrash, Plus, RefreshCw } from "lucide-react";

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  size = "md",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { container: "py-8", iconBox: "w-12 h-12", icon: 20, title: "text-sm", desc: "text-xs" },
    md: { container: "py-12", iconBox: "w-16 h-16", icon: 26, title: "text-base", desc: "text-sm" },
    lg: { container: "py-16", iconBox: "w-20 h-20", icon: 32, title: "text-lg", desc: "text-base" },
  };
  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center text-center ${s.container} px-8`}>
      <div className={`${s.iconBox} rounded-2xl bg-muted flex items-center justify-center mb-4`}>
        <Icon size={s.icon} className="text-muted-foreground" />
      </div>
      <p className={`font-semibold text-foreground mb-2 ${s.title}`}>{title}</p>
      <p className={`text-muted-foreground max-w-xs ${s.desc}`}>{description}</p>
      {actionLabel && (
        <button
          className="mt-4 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          onClick={action}
        >
          <Plus size={14} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function EmptyStatesSection() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">الحالات الفارغة</h1>
        <p className="text-muted-foreground">عرض رسائل واضحة عند غياب البيانات</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h4 className="text-sm">قائمة الفواتير</h4>
          </div>
          <EmptyState
            icon={FileText}
            title="مفيش فواتير لسه"
            description="لم تقم بإنشاء أي فواتير حتى الآن. ابدأ بإنشاء فاتورتك الأولى."
            actionLabel="فاتورة جديدة"
          />
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h4 className="text-sm">قائمة العملاء</h4>
          </div>
          <EmptyState
            icon={Users}
            title="مفيش عملاء لسه"
            description="لم يتم إضافة أي عملاء. أضف عميلك الأول للبدء."
            actionLabel="عميل جديد"
          />
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h4 className="text-sm">المصروفات</h4>
          </div>
          <EmptyState
            icon={TrendingDown}
            title="مفيش مصروفات مسجلة"
            description="لا توجد مصروفات مسجلة في هذه الفترة."
            actionLabel="تسجيل مصروف"
          />
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h4 className="text-sm">نتائج البحث</h4>
          </div>
          <EmptyState
            icon={Search}
            title="مفيش نتائج مطابقة"
            description='لا توجد نتائج تطابق بحثك "أرز فاخر". حاول بكلمات مختلفة.'
          />
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h4 className="text-sm">خطأ في التحميل</h4>
          </div>
          <div className="flex flex-col items-center text-center py-12 px-8">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
              <ServerCrash size={26} className="text-destructive" />
            </div>
            <p className="font-semibold text-foreground mb-2">تعذر تحميل البيانات</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              حدث خطأ أثناء تحميل البيانات. تحقق من الاتصال وحاول مجدداً.
            </p>
            <button className="mt-4 h-9 px-4 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors inline-flex items-center gap-2">
              <RefreshCw size={14} />
              إعادة المحاولة
            </button>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h4 className="text-sm">المشتريات</h4>
          </div>
          <EmptyState
            icon={ShoppingCart}
            title="مفيش مشتريات"
            description="لا توجد عمليات شراء مسجلة في هذه الفترة."
            actionLabel="شراء جديد"
            size="md"
          />
        </div>
      </div>

      {/* Small empty states */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-5">حالات فارغة صغيرة (داخل ودجت)</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: FileText, title: "لا توجد فواتير اليوم", desc: "لم يتم إنشاء فواتير اليوم بعد" },
            { icon: Users, title: "لا يوجد عملاء جدد", desc: "لم يتم إضافة عملاء جدد هذا الأسبوع" },
            { icon: TrendingDown, title: "لا توجد مصروفات", desc: "لا مصروفات في هذا الشهر" },
          ].map((item) => (
            <div key={item.title} className="border border-border rounded-xl">
              <EmptyState icon={item.icon} title={item.title} description={item.desc} size="sm" />
            </div>
          ))}
        </div>
      </section>

      {/* Loading states */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-5">حالات التحميل (Skeleton)</h3>
        <div className="space-y-4">
          {/* Card skeleton */}
          <div className="animate-pulse space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-11 h-11 bg-muted rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
              <div className="h-6 w-16 bg-muted rounded-full" />
            </div>
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
          <div className="border-t border-border pt-4 animate-pulse space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-11 h-11 bg-muted rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
              <div className="h-6 w-20 bg-muted rounded-full" />
            </div>
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-4/6" />
          </div>
        </div>
      </section>
    </div>
  );
}
