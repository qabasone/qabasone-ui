import { useState } from "react";
import { Check, FilePlus2, Save, Send, Settings, X } from "lucide-react";
import { Button, PopupForm, PopupFormField } from "@/ui/components";

const inputBase =
  "qbs-field qbs-focus h-10 w-full px-3 text-sm text-foreground placeholder:text-muted-foreground";

export function PopupFormsSection() {
  const [open, setOpen] = useState<"invoice" | "payment" | "settings" | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 text-foreground">نماذج النوافذ المنبثقة</h1>
        <p className="text-muted-foreground">
          مكوّن عام للنماذج داخل popup مع عنوان قابل للتخصيص، أزرار actions مرنة، ومساحات form قابلة للتركيب.
        </p>
      </div>

      <section className="qbs-surface overflow-hidden">
        <div className="grid gap-4 p-5 md:grid-cols-3">
          <button
            type="button"
            className="qbs-focus rounded-lg border border-border bg-card p-4 text-right transition-colors hover:bg-muted"
            onClick={() => setOpen("invoice")}
          >
            <FilePlus2 size={20} className="mb-3 text-primary" />
            <p className="text-sm font-semibold text-foreground">إنشاء فاتورة</p>
            <p className="mt-1 text-xs text-muted-foreground">نموذج بحقول متعددة وزر حفظ أساسي.</p>
          </button>

          <button
            type="button"
            className="qbs-focus rounded-lg border border-border bg-card p-4 text-right transition-colors hover:bg-muted"
            onClick={() => setOpen("payment")}
          >
            <Send size={20} className="mb-3 text-success" />
            <p className="text-sm font-semibold text-foreground">تسجيل دفعة</p>
            <p className="mt-1 text-xs text-muted-foreground">أزرار مخصصة: حفظ، حفظ وإرسال، وإلغاء.</p>
          </button>

          <button
            type="button"
            className="qbs-focus rounded-lg border border-border bg-card p-4 text-right transition-colors hover:bg-muted"
            onClick={() => setOpen("settings")}
          >
            <Settings size={20} className="mb-3 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">إعدادات عامة</p>
            <p className="mt-1 text-xs text-muted-foreground">Header actions و footer note مع حجم أكبر.</p>
          </button>
        </div>
      </section>

      <section className="qbs-surface overflow-hidden">
        <div className="border-b border-border px-5 py-3">
          <p className="text-sm font-semibold text-foreground">API مختصر</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            استخدم children لأي form layout، ومرر actions لتتحكم في أزرار النافذة.
          </p>
        </div>
        <pre className="overflow-x-auto bg-muted/20 p-5 text-xs leading-relaxed text-foreground" dir="ltr">{`<PopupForm
  open={open}
  title="إنشاء فاتورة"
  description="أدخل البيانات الأساسية."
  size="lg"
  onCancel={close}
  onSubmit={save}
  actions={[
    { id: "cancel", label: "إلغاء", variant: "outline", onClick: close },
    { id: "save", label: "حفظ", type: "submit", action: "save", icon: Save },
  ]}
>
  <div className="grid gap-4 sm:grid-cols-2">
    <PopupFormField label="العميل" required>
      <input className="qbs-field qbs-focus h-10 w-full px-3 text-sm" />
    </PopupFormField>
  </div>
</PopupForm>`}</pre>
      </section>

      <PopupForm
        open={open === "invoice"}
        title="إنشاء فاتورة بيع"
        description="املأ البيانات الأساسية للفاتورة، ثم احفظها كمسودة أو أرسلها مباشرة."
        eyebrow="الفواتير"
        size="lg"
        onCancel={() => setOpen(null)}
        onSubmit={() => setOpen(null)}
        actions={[
          { id: "cancel", label: "إلغاء", variant: "outline", onClick: () => setOpen(null) },
          { id: "draft", label: "حفظ كمسودة", variant: "secondary", icon: Save, onClick: () => setOpen(null) },
          { id: "save", label: "حفظ الفاتورة", type: "submit", action: "save", icon: Check, autoFocus: true },
        ]}
        footerNote="يمكن تعديل تفاصيل الأصناف لاحقًا من شاشة الفاتورة."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <PopupFormField label="العميل" required>
            <input className={inputBase} placeholder="مثال: شركة النور للتجارة" />
          </PopupFormField>
          <PopupFormField label="تاريخ الفاتورة" required>
            <input className={`${inputBase} amount`} type="date" defaultValue="2026-06-03" />
          </PopupFormField>
          <PopupFormField label="المخزن" required>
            <select className={`${inputBase} appearance-none pe-9`} defaultValue="main">
              <option value="main">المخزن الرئيسي</option>
              <option value="branch">مخزن الفرع</option>
            </select>
          </PopupFormField>
          <PopupFormField label="طريقة الدفع">
            <select className={`${inputBase} appearance-none pe-9`} defaultValue="cash">
              <option value="cash">نقدي</option>
              <option value="credit">آجل</option>
            </select>
          </PopupFormField>
          <PopupFormField label="ملاحظات" fullWidth>
            <textarea className={`${inputBase} h-auto resize-none py-2`} rows={3} placeholder="ملاحظات اختيارية..." />
          </PopupFormField>
        </div>
      </PopupForm>

      <PopupForm
        open={open === "payment"}
        title="تسجيل دفعة"
        description="سجل دفعة مرتبطة بعميل أو فاتورة محددة."
        size="md"
        onCancel={() => setOpen(null)}
        onSubmit={() => setOpen(null)}
        actions={[
          { id: "cancel", label: "إلغاء", variant: "outline", icon: X, onClick: () => setOpen(null) },
          { id: "save-send", label: "حفظ وإرسال", variant: "secondary", icon: Send, onClick: () => setOpen(null) },
          { id: "save", label: "حفظ", type: "submit", action: "save", icon: Save },
        ]}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <PopupFormField label="رقم الفاتورة" required>
            <input className={`${inputBase} amount`} defaultValue="INV-2026-0007" />
          </PopupFormField>
          <PopupFormField label="المبلغ" required>
            <input className={`${inputBase} amount`} inputMode="decimal" placeholder="0.00" />
          </PopupFormField>
          <PopupFormField label="الخزنة" required>
            <select className={`${inputBase} appearance-none pe-9`}>
              <option>الخزنة الرئيسية</option>
              <option>خزنة الفرع</option>
            </select>
          </PopupFormField>
          <PopupFormField label="التاريخ" required>
            <input className={`${inputBase} amount`} type="date" defaultValue="2026-06-03" />
          </PopupFormField>
        </div>
      </PopupForm>

      <PopupForm
        open={open === "settings"}
        title="إعدادات النموذج"
        description="مثال على header actions و footer note وحجم أكبر."
        size="xl"
        headerActions={<Button size="xs" variant="ghost" iconComponent={Settings}>خيارات</Button>}
        onCancel={() => setOpen(null)}
        onSubmit={() => setOpen(null)}
        actions={[
          { id: "cancel", label: "إلغاء", variant: "outline", onClick: () => setOpen(null) },
          { id: "save", label: "تطبيق الإعدادات", type: "submit", action: "save", icon: Check },
        ]}
        footerNote="تظهر الملاحظات هنا بدون فرض شكل معين على المطور."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <PopupFormField label="اسم النموذج" required>
            <input className={inputBase} defaultValue="نموذج فاتورة سريع" />
          </PopupFormField>
          <PopupFormField label="الحجم الافتراضي">
            <select className={`${inputBase} appearance-none pe-9`} defaultValue="lg">
              <option value="md">متوسط</option>
              <option value="lg">كبير</option>
              <option value="xl">واسع</option>
            </select>
          </PopupFormField>
          <PopupFormField label="رسالة مساعدة" fullWidth>
            <textarea className={`${inputBase} h-auto resize-none py-2`} rows={3} defaultValue="راجع البيانات قبل الحفظ." />
          </PopupFormField>
        </div>
      </PopupForm>
    </div>
  );
}
