import { useState } from "react";
import {
  Plus, Printer, Download, Pencil, Trash2, Check, X, FileText,
  ChevronDown, Loader2, Save, Send, Eye, ArrowLeft
} from "lucide-react";

function Btn({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading,
  disabled,
  iconOnly,
}: {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  iconOnly?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 font-medium";

  const sizes: Record<string, string> = {
    sm: iconOnly ? "w-8 h-8" : "h-8 px-3 text-sm",
    md: iconOnly ? "w-10 h-10" : "h-10 px-4 text-sm",
    lg: iconOnly ? "w-11 h-11" : "h-11 px-5 text-base",
  };

  const variants: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
    ghost: "text-foreground hover:bg-muted",
    danger: "bg-destructive text-destructive-foreground hover:bg-red-700",
    success: "bg-success text-success-foreground hover:bg-green-700",
    outline: "border border-border text-foreground hover:bg-muted",
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]}`} disabled={disabled || loading}>
      {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
      {!iconOnly && children}
    </button>
  );
}

export function ButtonsSection() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">الأزرار</h1>
        <p className="text-muted-foreground">جميع أنواع وأحجام الأزرار في النظام</p>
      </div>

      {/* Variants */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <h3>الأنواع</h3>
        <div className="flex flex-wrap gap-3">
          <Btn variant="primary">حفظ</Btn>
          <Btn variant="secondary">إلغاء</Btn>
          <Btn variant="outline">تعديل</Btn>
          <Btn variant="ghost">عرض</Btn>
          <Btn variant="success" icon={<Check size={15} />}>تأكيد</Btn>
          <Btn variant="danger" icon={<Trash2 size={15} />}>حذف</Btn>
        </div>
      </section>

      {/* Sizes */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>الأحجام</h3>
        <div className="space-y-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-12">{size === "sm" ? "32px" : size === "md" ? "40px" : "44px"}</span>
              <div className="flex flex-wrap gap-3 items-center">
                <Btn size={size} variant="primary">حفظ</Btn>
                <Btn size={size} variant="secondary">إلغاء</Btn>
                <Btn size={size} variant="outline">تعديل</Btn>
                <Btn size={size} variant="ghost">عرض</Btn>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Icon buttons */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>أزرار الأيقونات</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <Btn variant="primary" iconOnly icon={<Plus size={16} />} />
          <Btn variant="secondary" iconOnly icon={<Pencil size={16} />} />
          <Btn variant="outline" iconOnly icon={<Eye size={16} />} />
          <Btn variant="ghost" iconOnly icon={<Printer size={16} />} />
          <Btn variant="ghost" iconOnly icon={<Download size={16} />} />
          <Btn variant="danger" iconOnly icon={<Trash2 size={16} />} />
          <Btn variant="ghost" iconOnly icon={<X size={16} />} />
        </div>
      </section>

      {/* With icons */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>مع أيقونات</h3>
        <div className="flex flex-wrap gap-3">
          <Btn variant="primary" icon={<Plus size={15} />}>فاتورة جديدة</Btn>
          <Btn variant="primary" icon={<Plus size={15} />}>عميل جديد</Btn>
          <Btn variant="secondary" icon={<Printer size={15} />}>طباعة</Btn>
          <Btn variant="outline" icon={<Download size={15} />}>تصدير</Btn>
          <Btn variant="secondary" icon={<FileText size={15} />}>مستند جديد</Btn>
          <Btn variant="ghost" icon={<Send size={15} />}>إرسال</Btn>
          <Btn variant="ghost" icon={<ArrowLeft size={15} />}>رجوع</Btn>
        </div>
      </section>

      {/* States */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>الحالات</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <Btn variant="primary">عادي</Btn>
          <Btn variant="primary" loading>جاري الحفظ...</Btn>
          <Btn variant="primary" disabled>معطل</Btn>
          <Btn variant="secondary" loading>جاري التحميل</Btn>
          <Btn variant="secondary" disabled>معطل</Btn>
        </div>
      </section>

      {/* Split button */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>زر منقسم وأزرار الإجراءات</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex rounded-lg overflow-hidden border border-border">
            <button className="bg-primary text-primary-foreground px-4 h-10 text-sm font-medium hover:bg-blue-700 transition-colors">
              حفظ
            </button>
            <div className="w-px bg-blue-500" />
            <button className="bg-primary text-primary-foreground px-2 h-10 hover:bg-blue-700 transition-colors">
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <button className="px-3 h-8 text-sm rounded-md bg-white shadow-sm font-medium text-foreground">ترحيل</button>
            <button className="px-3 h-8 text-sm rounded-md text-muted-foreground hover:text-foreground">مسودة</button>
            <button className="px-3 h-8 text-sm rounded-md text-muted-foreground hover:text-foreground">إلغاء</button>
          </div>
        </div>
      </section>

      {/* Common Arabic actions */}
      <section className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3>إجراءات النظام الشائعة</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">إجراءات الحفظ</p>
            <div className="flex gap-2">
              <Btn variant="primary" icon={<Save size={15} />}>حفظ</Btn>
              <Btn variant="secondary">إلغاء</Btn>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">إجراءات الفاتورة</p>
            <div className="flex flex-wrap gap-2">
              <Btn variant="primary" icon={<Check size={15} />}>ترحيل</Btn>
              <Btn variant="outline" icon={<Printer size={15} />}>طباعة</Btn>
              <Btn variant="ghost" icon={<Download size={15} />}>تصدير</Btn>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">إجراءات التأكيد</p>
            <div className="flex gap-2">
              <Btn variant="danger" icon={<Trash2 size={15} />}>حذف</Btn>
              <Btn variant="ghost">إلغاء</Btn>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">إجراءات التحرير</p>
            <div className="flex gap-2">
              <Btn variant="outline" icon={<Pencil size={15} />}>تعديل</Btn>
              <Btn variant="ghost" icon={<X size={15} />}>إلغاء التعديل</Btn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
