import { useState } from "react";
import {
  AlertCircle,
  Archive,
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Mail,
  Package,
  Phone,
  Settings,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/components/Tabs";

const invoices = [
  { id: "INV-2026-0101", customer: "شركة النور للتجارة", amount: "45,500.00", status: "open" },
  { id: "INV-2026-0102", customer: "مصنع الأهرام", amount: "28,750.00", status: "posted" },
  { id: "INV-2026-0103", customer: "تجارة الخير", amount: "12,300.00", status: "late" },
];

export function TabsSection() {
  const [pageTab, setPageTab] = useState("overview");
  const [invoiceTab, setInvoiceTab] = useState("all");
  const [settingsTab, setSettingsTab] = useState("general");
  const [activityTab, setActivityTab] = useState("all");

  const filteredInvoices = invoiceTab === "all"
    ? invoices
    : invoices.filter((invoice) => invoice.status === invoiceTab);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-1 text-foreground">التبويبات</h1>
        <p className="text-muted-foreground">
          تبويبات قابلة لإعادة الاستخدام للتنقل داخل الصفحة، فلاتر سريعة، إعدادات، وحالات تشغيل عملية مع دعم RTL ولوحة المفاتيح.
        </p>
      </div>

      <section className="qbs-surface overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-semibold text-foreground">تنقل داخل صفحة الفاتورة</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Top navigation tabs لصفحات التفاصيل ذات الأقسام المستقلة.</p>
        </div>
        <div className="p-5">
          <Tabs value={pageTab} onValueChange={setPageTab} defaultValue="overview" dir="rtl">
            <TabsList variant="top-navigation" aria-label="أقسام الفاتورة">
              <TabsTrigger value="overview" startIcon={<FileText size={14} />}>الملخص</TabsTrigger>
              <TabsTrigger value="items" startIcon={<Package size={14} />} badge={8}>الأصناف</TabsTrigger>
              <TabsTrigger value="payments" startIcon={<CreditCard size={14} />} badge={2}>المدفوعات</TabsTrigger>
              <TabsTrigger value="delivery" startIcon={<Truck size={14} />}>التسليم</TabsTrigger>
              <TabsTrigger value="audit" startIcon={<ShieldCheck size={14} />}>المراجعة</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <InfoGrid items={[
                ["رقم الفاتورة", "INV-2026-0101"],
                ["العميل", "شركة النور للتجارة"],
                ["الحالة", "مفتوحة"],
                ["الإجمالي", "45,500.00 ج.م"],
              ]} />
            </TabsContent>
            <TabsContent value="items">
              <MutedPanel icon={Package} text="جدول الأصناف والكميات والأسعار يظهر هنا." />
            </TabsContent>
            <TabsContent value="payments">
              <MutedPanel icon={CreditCard} text="دفعات مرتبطة بالفاتورة مع حالة كل دفعة." />
            </TabsContent>
            <TabsContent value="delivery">
              <MutedPanel icon={Truck} text="بيانات السائق والمخزن وخط التسليم." />
            </TabsContent>
            <TabsContent value="audit">
              <MutedPanel icon={ShieldCheck} text="سجل التعديلات والترحيل والمراجعة." />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="qbs-surface overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-semibold text-foreground">تبويبات فلترة للجدول</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Pill tabs مناسبة لتغيير نطاق البيانات دون مغادرة الجدول.</p>
        </div>
        <div className="space-y-4 p-5">
          <Tabs value={invoiceTab} onValueChange={setInvoiceTab} defaultValue="all" dir="rtl">
            <TabsList variant="pill-group" aria-label="فلترة الفواتير">
              <TabsTrigger variant="pill" value="all" badge={invoices.length}>الكل</TabsTrigger>
              <TabsTrigger variant="pill" value="open" badge={1} startIcon={<Clock size={14} />}>مفتوحة</TabsTrigger>
              <TabsTrigger variant="pill" value="posted" badge={1} startIcon={<CheckCircle2 size={14} />}>مرحلة</TabsTrigger>
              <TabsTrigger variant="pill" value="late" badge={1} startIcon={<AlertCircle size={14} />}>متأخرة</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/45 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 text-start">رقم الفاتورة</th>
                  <th className="px-3 py-3 text-start">العميل</th>
                  <th className="px-3 py-3 text-start">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/45">
                    <td className="amount px-3 py-3 font-semibold text-primary">{invoice.id}</td>
                    <td className="px-3 py-3 text-foreground">{invoice.customer}</td>
                    <td className="amount px-3 py-3 text-foreground">{invoice.amount} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="qbs-surface overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-semibold text-foreground">Segmented tabs للإعدادات</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Variant جديد مناسب للتبديل بين أوضاع قصيرة داخل نفس السطح.</p>
        </div>
        <div className="p-5">
          <Tabs value={settingsTab} onValueChange={setSettingsTab} defaultValue="general" dir="rtl">
            <TabsList variant="segmented" fullWidth aria-label="إعدادات المستخدم" className="justify-between">
              <TabsTrigger variant="segmented" value="general" startIcon={<Settings size={14} />}>عام</TabsTrigger>
              <TabsTrigger variant="segmented" value="users" startIcon={<User size={14} />}>المستخدمين</TabsTrigger>
              <TabsTrigger variant="segmented" value="security" startIcon={<ShieldCheck size={14} />}>الأمان</TabsTrigger>
              <TabsTrigger variant="segmented" value="archive" startIcon={<Archive size={14} />}>الأرشفة</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <SettingsPanel title="الإعدادات العامة" text="اسم الشركة، اللغة الافتراضية، والمنطقة الزمنية." />
            </TabsContent>
            <TabsContent value="users">
              <SettingsPanel title="إدارة المستخدمين" text="الأدوار، الصلاحيات، وربط المستخدمين بالمخازن." />
            </TabsContent>
            <TabsContent value="security">
              <SettingsPanel title="الأمان" text="سياسات كلمة المرور، الجلسات، والمصادقة الثنائية." />
            </TabsContent>
            <TabsContent value="archive">
              <SettingsPanel title="الأرشفة" text="سياسات الاحتفاظ بالبيانات والنسخ الاحتياطي." />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="qbs-surface overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-semibold text-foreground">Tabs داخل Tabs</p>
          <p className="mt-0.5 text-xs text-muted-foreground">مفيد في CRM أو شاشة عميل تجمع النشاط مع فلاتر فرعية.</p>
        </div>
        <div className="p-5">
          <Tabs value={activityTab} onValueChange={setActivityTab} defaultValue="all" dir="rtl">
            <TabsList variant="pill-group" aria-label="فلترة النشاط">
              <TabsTrigger variant="pill" value="all">الكل</TabsTrigger>
              <TabsTrigger variant="pill" value="calls" badge={4} startIcon={<Phone size={14} />}>المكالمات</TabsTrigger>
              <TabsTrigger variant="pill" value="emails" badge={3} startIcon={<Mail size={14} />}>الرسائل</TabsTrigger>
              <TabsTrigger variant="pill" value="appointments" badge={2} startIcon={<CalendarClock size={14} />}>المواعيد</TabsTrigger>
            </TabsList>
            <TabsContent value="all"><ActivityCard title="تم تحديث حالة العميل" body="تغيير المرحلة إلى متابعة، وإضافة ملاحظة للفريق." /></TabsContent>
            <TabsContent value="calls"><ActivityCard title="مكالمة متابعة" body="تم الاتفاق على إرسال عرض سعر محدث." /></TabsContent>
            <TabsContent value="emails"><ActivityCard title="رسالة واردة" body="العميل طلب تفاصيل إضافية قبل اعتماد الفاتورة." /></TabsContent>
            <TabsContent value="appointments"><ActivityCard title="موعد زيارة" body="زيارة ميدانية للمخزن الرئيسي الساعة 11 صباحًا." /></TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="qbs-surface overflow-hidden">
        <div className="border-b border-border px-5 py-3">
          <p className="text-sm font-semibold text-foreground">استخدام مختصر</p>
        </div>
        <pre className="overflow-x-auto bg-muted/20 p-5 text-xs leading-relaxed text-foreground" dir="ltr">{`<Tabs value={tab} onValueChange={setTab} defaultValue="overview" dir="rtl">
  <TabsList variant="segmented" fullWidth>
    <TabsTrigger variant="segmented" value="overview">الملخص</TabsTrigger>
    <TabsTrigger variant="segmented" value="items" badge={8}>الأصناف</TabsTrigger>
  </TabsList>

  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="items">...</TabsContent>
</Tabs>`}</pre>
      </section>
    </div>
  );
}

function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-border bg-muted/25 p-3">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}

function MutedPanel({ icon: Icon, text }: { icon: typeof FileText; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/25 p-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Icon size={15} className="shrink-0" />
        <span>{text}</span>
      </div>
    </div>
  );
}

function SettingsPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function ActivityCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
