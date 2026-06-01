import { useState } from "react";
import { Plus, Printer, Download, Check, X, Pencil, ChevronDown, ArrowLeft, Trash2 } from "lucide-react";

const statusMap: Record<string, { label: string; bg: string; text: string }> = {
  paid: { label: "مدفوعة", bg: "#dcfce7", text: "#15803d" },
  pending: { label: "في الانتظار", bg: "#fef3c7", text: "#92400e" },
  overdue: { label: "متأخرة", bg: "#fee2e2", text: "#991b1b" },
  draft: { label: "مسودة", bg: "#f1f5f9", text: "#475569" },
};

const invoices = [
  { id: "INV-2024-0123", customer: "شركة النور للتجارة", amount: "45,500.00", status: "paid", date: "15/01/2024", due: "15/02/2024" },
  { id: "INV-2024-0124", customer: "مصنع الأهرام", amount: "28,750.00", status: "pending", date: "18/01/2024", due: "18/02/2024" },
  { id: "INV-2024-0125", customer: "شركة المستقبل", amount: "12,300.00", status: "overdue", date: "05/01/2024", due: "20/01/2024" },
  { id: "INV-2024-0126", customer: "تجارة الخير", amount: "67,200.00", status: "draft", date: "20/01/2024", due: "20/02/2024" },
];

const lineItems = [
  { product: "أرز غلا", qty: "5", unit: "طن", priceUnit: "طن", price: "8,500.00", total: "42,500.00" },
  { product: "قمح", qty: "1,500", unit: "كيلو", priceUnit: "طن", price: "2,000.00", total: "3,000.00" },
];

function InvoiceList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>الفواتير</h2>
          <p className="text-sm text-muted-foreground">إجمالي 127 فاتورة</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={15} />
          فاتورة جديدة
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["الكل", "مدفوعة", "في الانتظار", "متأخرة", "مسودة"].map((f, i) => (
          <button
            key={f}
            className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors ${
              i === 0 ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                {["رقم الفاتورة", "العميل", "التاريخ", "الاستحقاق", "الإجمالي", "الحالة", ""].map((h) => (
                  <th key={h} className="p-3 text-start text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const s = statusMap[inv.status];
                return (
                  <tr
                    key={inv.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => onSelect(inv.id)}
                  >
                    <td className="p-3 font-mono text-sm text-primary amount">{inv.id}</td>
                    <td className="p-3 text-sm text-foreground">{inv.customer}</td>
                    <td className="p-3 text-sm text-muted-foreground amount">{inv.date}</td>
                    <td className="p-3 text-sm text-muted-foreground amount">{inv.due}</td>
                    <td className="p-3 text-sm font-semibold text-foreground amount">{inv.amount} ج.م</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: s.bg, color: s.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.text }} />
                        {s.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Printer size={13} />
                        </button>
                        <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Pencil size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InvoiceDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const inv = invoices.find((i) => i.id === id) || invoices[0];
  const s = statusMap[inv.status];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors" onClick={onBack}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="font-mono amount">{inv.id}</h2>
          <p className="text-xs text-muted-foreground">{inv.customer}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ms-2" style={{ backgroundColor: s.bg, color: s.text }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.text }} />
          {s.label}
        </span>
        <div className="flex gap-2 ms-auto">
          {inv.status === "draft" && (
            <button className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Check size={14} />
              ترحيل
            </button>
          )}
          <button className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <Printer size={15} />
          </button>
          <button className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <Download size={15} />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h4 className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">بيانات العميل</h4>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">{inv.customer}</p>
              <p className="text-sm text-muted-foreground">C-0001</p>
              <p className="text-sm text-muted-foreground">010 1234 5678</p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">بيانات الفاتورة</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">تاريخ الإصدار</span>
              <span className="amount">{inv.date}</span>
              <span className="text-muted-foreground">تاريخ الاستحقاق</span>
              <span className="amount">{inv.due}</span>
              <span className="text-muted-foreground">المخزن</span>
              <span>المخزن الرئيسي</span>
              <span className="text-muted-foreground">طريقة الدفع</span>
              <span>آجل</span>
            </div>
          </div>
        </div>

        <table className="w-full mb-5">
          <thead className="border-b border-border">
            <tr className="text-xs font-semibold text-muted-foreground">
              <th className="py-2 text-start">المنتج</th>
              <th className="py-2 text-start">الكمية</th>
              <th className="py-2 text-start">وحدة الكمية</th>
              <th className="py-2 text-start">وحدة السعر</th>
              <th className="py-2 text-start">السعر</th>
              <th className="py-2 text-start">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-3 text-sm text-foreground">{item.product}</td>
                <td className="py-3 text-sm amount">{item.qty}</td>
                <td className="py-3 text-sm text-muted-foreground">{item.unit}</td>
                <td className="py-3 text-sm text-muted-foreground">{item.priceUnit}</td>
                <td className="py-3 text-sm amount">{item.price} ج.م</td>
                <td className="py-3 text-sm font-semibold amount">{item.total} ج.م</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span className="amount">45,500.00 ج.م</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ضريبة (14%)</span>
              <span className="amount text-warning">6,370.00 ج.م</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">خصم</span>
              <span className="amount text-success">0.00 ج.م</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
              <span>الإجمالي</span>
              <span className="amount text-primary">51,870.00 ج.م</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoiceForm() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2>فاتورة مبيعات جديدة</h2>
        <div className="flex gap-2">
          <button className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Check size={14} />
            ترحيل
          </button>
          <button className="h-9 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
            حفظ كمسودة
          </button>
          <button className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-sm font-medium">العميل <span className="text-destructive">*</span></label>
            <div className="relative">
              <select className="w-full h-10 px-3 pe-9 rounded-lg border border-border bg-input-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring">
                <option>اختر العميل...</option>
                <option>شركة النور للتجارة</option>
                <option>مصنع الأهرام</option>
              </select>
              <ChevronDown size={13} className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">تاريخ الفاتورة</label>
            <input type="date" className="w-full h-10 px-3 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring amount" defaultValue="2024-01-20" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">المخزن <span className="text-destructive">*</span></label>
            <div className="relative">
              <select className="w-full h-10 px-3 pe-9 rounded-lg border border-border bg-input-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring">
                <option>المخزن الرئيسي</option>
                <option>مخزن فرع الإسكندرية</option>
              </select>
              <ChevronDown size={13} className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">طريقة التحصيل</label>
            <div className="relative">
              <select className="w-full h-10 px-3 pe-9 rounded-lg border border-border bg-input-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring">
                <option>آجل</option>
                <option>نقدي — خزنة</option>
                <option>نقدي — عهدة</option>
                <option>مختلط</option>
              </select>
              <ChevronDown size={13} className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">تاريخ الاستحقاق</label>
            <input type="date" className="w-full h-10 px-3 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring amount" defaultValue="2024-02-20" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4>بنود الفاتورة</h4>
            <button className="h-8 px-3 rounded-lg border border-dashed border-primary text-primary text-xs font-medium flex items-center gap-1.5 hover:bg-primary/5 transition-colors">
              <Plus size={13} />
              إضافة بند
            </button>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/40 border-b border-border">
                <tr className="text-xs font-semibold text-muted-foreground">
                  <th className="p-3 text-start">المنتج</th>
                  <th className="p-3 text-start w-24">الكمية</th>
                  <th className="p-3 text-start w-28">وحدة الكمية</th>
                  <th className="p-3 text-start w-28">وحدة السعر</th>
                  <th className="p-3 text-start w-32">السعر</th>
                  <th className="p-3 text-start w-32">الإجمالي</th>
                  <th className="p-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="p-2">
                      <div className="relative">
                        <select className="w-full h-9 px-2 pe-7 rounded-lg border border-border bg-input-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring">
                          <option>{item.product}</option>
                          <option>أرز أبيض</option>
                          <option>قمح</option>
                        </select>
                        <ChevronDown size={11} className="absolute top-1/2 -translate-y-1/2 end-2 text-muted-foreground pointer-events-none" />
                      </div>
                    </td>
                    <td className="p-2">
                      <input className="w-full h-9 px-2 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring amount" defaultValue={item.qty} />
                    </td>
                    <td className="p-2">
                      <div className="relative">
                        <select className="w-full h-9 px-2 pe-7 rounded-lg border border-border bg-input-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring">
                          <option>{item.unit}</option>
                          <option>كيلو</option>
                          <option>أردب</option>
                          <option>شيكارة</option>
                        </select>
                        <ChevronDown size={11} className="absolute top-1/2 -translate-y-1/2 end-2 text-muted-foreground pointer-events-none" />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="relative">
                        <select className="w-full h-9 px-2 pe-7 rounded-lg border border-border bg-input-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring">
                          <option>{item.priceUnit}</option>
                          <option>كيلو</option>
                          <option>أردب</option>
                        </select>
                        <ChevronDown size={11} className="absolute top-1/2 -translate-y-1/2 end-2 text-muted-foreground pointer-events-none" />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="relative">
                        <span className="absolute top-1/2 -translate-y-1/2 end-2 text-muted-foreground text-xs">ج.م</span>
                        <input className="w-full h-9 px-2 pe-10 rounded-lg border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring amount" defaultValue={item.price} />
                      </div>
                    </td>
                    <td className="p-2">
                      <input className="w-full h-9 px-2 rounded-lg border border-transparent bg-muted text-sm cursor-not-allowed amount" readOnly value={`${item.total} ج.م`} />
                    </td>
                    <td className="p-2">
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-72 space-y-2 text-sm border border-border rounded-xl p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span className="amount">45,500.00 ج.م</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ضريبة (14%)</span>
              <span className="amount text-warning">6,370.00 ج.م</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold">
              <span>الإجمالي</span>
              <span className="amount text-primary">51,870.00 ج.م</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">ملاحظات</label>
          <textarea className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" rows={3} placeholder="ملاحظات إضافية..." />
        </div>
      </div>
    </div>
  );
}

export function InvoiceScreensSection() {
  const [view, setView] = useState<"list" | "detail" | "form">("list");
  const [selectedId, setSelectedId] = useState<string>("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-1">شاشات الفواتير</h1>
        <p className="text-muted-foreground">قائمة الفواتير — تفاصيل الفاتورة — نموذج إنشاء فاتورة</p>
      </div>

      {/* View switcher */}
      <div className="flex items-center gap-2 bg-muted rounded-xl p-1 w-fit">
        {[
          { key: "list", label: "القائمة" },
          { key: "detail", label: "التفاصيل" },
          { key: "form", label: "نموذج الإنشاء" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`h-8 px-4 rounded-lg text-sm font-medium transition-all ${
              view === tab.key ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setView(tab.key as typeof view)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "list" && (
        <InvoiceList
          onSelect={(id) => {
            setSelectedId(id);
            setView("detail");
          }}
        />
      )}
      {view === "detail" && (
        <InvoiceDetail id={selectedId || "INV-2024-0123"} onBack={() => setView("list")} />
      )}
      {view === "form" && <InvoiceForm />}
    </div>
  );
}
