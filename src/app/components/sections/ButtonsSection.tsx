import { useState } from "react";
import {
  Plus,
  Printer,
  Download,
  Pencil,
  Trash2,
  Check,
  X,
  FileText,
  Save,
  Send,
  Eye,
  ArrowLeft,
  Wallet,
  Archive,
  Copy,
  BadgeCheck,
  HandCoins,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/ui/components/Button";
import { SplitButton } from "@/ui/components/SplitButton";

export function ButtonsSection() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">الأزرار</h1>
        <p className="text-muted-foreground">
          نظام أزرار ذري قابل لإعادة الاستخدام، ومجهز لإجراءات النظام المحاسبي.
        </p>
      </div>

      <section className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <h3>الأنواع الأساسية</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">حفظ</Button>
          <Button variant="secondary">إلغاء</Button>
          <Button variant="outline">تعديل</Button>
          <Button variant="ghost">عرض</Button>
          <Button variant="success" startIcon={<Check size={15} />}>
            تأكيد
          </Button>
          <Button variant="danger" startIcon={<Trash2 size={15} />}>
            حذف
          </Button>
          <Button variant="warning" startIcon={<RotateCcw size={15} />}>
            استرجاع
          </Button>
          <Button variant="info" startIcon={<Send size={15} />}>
            مشاركة
          </Button>
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>الأحجام</h3>
        <div className="space-y-4">
          {(
            [
              ["xs", "28px"],
              ["sm", "32px"],
              ["md", "40px"],
              ["lg", "44px"],
            ] as const
          ).map(([size, px]) => (
            <div key={size} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-12">{px}</span>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size={size} variant="primary">
                  حفظ
                </Button>
                <Button size={size} variant="secondary">
                  إلغاء
                </Button>
                <Button size={size} variant="outline">
                  تعديل
                </Button>
                <Button size={size} variant="ghost">
                  عرض
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>أزرار الأيقونات</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary" iconOnly aria-label="إضافة" startIcon={<Plus size={16} />} />
          <Button variant="secondary" iconOnly aria-label="تعديل" startIcon={<Pencil size={16} />} />
          <Button variant="outline" iconOnly aria-label="عرض" startIcon={<Eye size={16} />} />
          <Button variant="ghost" iconOnly aria-label="طباعة" startIcon={<Printer size={16} />} />
          <Button variant="ghost" iconOnly aria-label="تصدير" startIcon={<Download size={16} />} />
          <Button variant="danger" iconOnly aria-label="حذف" startIcon={<Trash2 size={16} />} />
          <Button variant="ghost" iconOnly aria-label="إغلاق" startIcon={<X size={16} />} />
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>الأزرار مع الأيقونات</h3>
        <div className="flex flex-wrap gap-3">
          <Button action="create" startIcon={<Plus size={15} />}>
            فاتورة جديدة
          </Button>
          <Button action="create" startIcon={<Plus size={15} />}>
            عميل جديد
          </Button>
          <Button action="print" startIcon={<Printer size={15} />}>
            طباعة
          </Button>
          <Button action="export" startIcon={<Download size={15} />}>
            تصدير
          </Button>
          <Button action="duplicate" startIcon={<Copy size={15} />}>
            نسخ
          </Button>
          <Button action="send" startIcon={<Send size={15} />}>
            إرسال
          </Button>
          <Button action="back" startIcon={<ArrowLeft size={15} />}>
            رجوع
          </Button>
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>الحالات</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary">عادي</Button>
          <Button variant="primary" loading>
            جاري الحفظ...
          </Button>
          <Button variant="primary" disabled>
            معطل
          </Button>
          <Button variant="secondary" loading>
            جاري التحميل
          </Button>
          <Button variant="secondary" disabled>
            معطل
          </Button>
          <Button variant="success" loading={loading} onClick={() => setLoading((v) => !v)}>
            {loading ? "إيقاف التحميل" : "تبديل التحميل"}
          </Button>
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>زر منقسم وأزرار سير العمل</h3>
        <div className="flex flex-wrap gap-4 items-start">
          <SplitButton
            primary={{
              action: "save",
              children: "حفظ",
            }}
            toggleAriaLabel="فتح خيارات الحفظ"
          />

          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button size="sm" variant="secondary" className="bg-card shadow-sm">
              ترحيل
            </Button>
            <Button size="sm" variant="ghost">
              مسودة
            </Button>
            <Button size="sm" variant="ghost">
              إلغاء
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>إجراءات النظام المحاسبي</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">إجراءات الفاتورة</p>
            <div className="flex flex-wrap gap-2">
              <Button action="save" startIcon={<Save size={15} />}>
                حفظ
              </Button>
              <Button action="post" startIcon={<BadgeCheck size={15} />}>
                ترحيل
              </Button>
              <Button action="print" startIcon={<Printer size={15} />}>
                طباعة
              </Button>
              <Button action="export" startIcon={<Download size={15} />}>
                تصدير
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">التحصيل والتسوية</p>
            <div className="flex flex-wrap gap-2">
              <Button action="collect" startIcon={<HandCoins size={15} />}>
                تحصيل
              </Button>
              <Button action="refund" startIcon={<RotateCcw size={15} />}>
                مرتجع
              </Button>
              <Button action="approve" startIcon={<Check size={15} />}>
                اعتماد
              </Button>
              <Button action="reject" startIcon={<X size={15} />}>
                رفض
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">عمليات المستند</p>
            <div className="flex flex-wrap gap-2">
              <Button action="send" startIcon={<Send size={15} />}>
                إرسال
              </Button>
              <Button action="duplicate" startIcon={<Copy size={15} />}>
                نسخ
              </Button>
              <Button action="archive" startIcon={<Archive size={15} />}>
                أرشفة
              </Button>
              <Button action="cancel" startIcon={<X size={15} />}>
                إلغاء
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">إجراءات حساسة</p>
            <div className="flex flex-wrap gap-2">
              <Button action="delete" startIcon={<Trash2 size={15} />}>
                حذف
              </Button>
              <Button action="edit" startIcon={<Pencil size={15} />}>
                تعديل
              </Button>
              <Button action="back" startIcon={<ArrowLeft size={15} />}>
                رجوع
              </Button>
              <Button variant="info" startIcon={<Wallet size={15} />}>
                تسوية رصيد
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>أزرار بعرض كامل</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <Button fullWidth action="save" startIcon={<Save size={15} />}>
            حفظ التعديلات
          </Button>
          <Button fullWidth action="post" startIcon={<FileText size={15} />}>
            ترحيل القيد
          </Button>
          <Button fullWidth action="send" startIcon={<Send size={15} />}>
            إرسال كشف الحساب
          </Button>
        </div>
      </section>
    </div>
  );
}
