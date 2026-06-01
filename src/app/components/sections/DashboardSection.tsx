import { TrendingUp, TrendingDown, AlertCircle, Users, FileText, Wallet, Clock, MoreVertical, Check, ArrowLeft } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ChartTooltip, PieTooltip, SingleTooltip } from "@/ui/components/ChartTooltips";

const revenueData = [
  { month: "يول", revenue: 180000, expenses: 110000 },
  { month: "أغس", revenue: 220000, expenses: 130000 },
  { month: "سبت", revenue: 195000, expenses: 120000 },
  { month: "أكت", revenue: 260000, expenses: 150000 },
  { month: "نوف", revenue: 230000, expenses: 135000 },
  { month: "ديس", revenue: 310000, expenses: 160000 },
  { month: "ينا", revenue: 248500, expenses: 142300 },
];

const expenseBreakdown = [
  { name: "مشتريات", value: 85000, color: "#2563eb" },
  { name: "رواتب", value: 32000, color: "#16a34a" },
  { name: "إيجار", value: 15000, color: "#d97706" },
  { name: "أخرى", value: 10300, color: "#dc2626" },
];

const recentActivity = [
  { type: "invoice", text: "فاتورة جديدة INV-2024-0130", sub: "شركة النور — 48,000 ج.م", time: "منذ 5 دقائق", status: "pending" },
  { type: "payment", text: "تسجيل قبض من مصنع الأهرام", sub: "20,000 ج.م — خزنة رئيسية", time: "منذ 20 دقيقة", status: "success" },
  { type: "purchase", text: "شراء أرز غلا — أمين مخزن", sub: "5 طن — مورد الغلة", time: "منذ ساعة", status: "success" },
  { type: "driver", text: "يومية سواق بانتظار المراجعة", sub: "أحمد محمد — 21 يناير", time: "منذ 3 ساعات", status: "warning" },
];

const pendingInvoices = [
  { id: "INV-2024-0125", customer: "شركة المستقبل", amount: "12,300.00", due: "20/01/2024", overdue: true },
  { id: "INV-2024-0124", customer: "مصنع الأهرام", amount: "28,750.00", due: "18/02/2024", overdue: false },
  { id: "INV-2024-0128", customer: "تجارة الخير", amount: "9,500.00", due: "25/01/2024", overdue: true },
];

const inventoryBalance = [
  { product: "أرز غلا", qty: "24 طن", value: "204,000 ج.م", status: "ok" },
  { product: "قمح", qty: "55 طن", value: "110,000 ج.م", status: "ok" },
  { product: "أرز أبيض", qty: "2 طن", value: "22,000 ج.م", status: "low" },
];

function KpiCard({ title, value, sub, trend, trendVal, icon: Icon, color }: {
  title: string; value: string; sub?: string; trend?: "up" | "down"; trendVal?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
          <MoreVertical size={13} />
        </button>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground amount mt-1">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {trend && trendVal && (
        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: trend === "up" ? "var(--success)" : "var(--destructive)" }}>
          {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{trendVal} عن الشهر الماضي</span>
        </div>
      )}
    </div>
  );
}


export function DashboardSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-foreground mb-1">لوحة التحكم</h1>
          <p className="text-muted-foreground">يناير ٢٠٢٤ — نظرة عامة على الوضع المالي</p>
        </div>
        <div className="flex gap-2">
          <button className="h-9 px-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
            <ArrowLeft size={14} />
            تصدير
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="إجمالي الإيرادات" value="248,500 ج.م" sub="يناير 2024" trend="up" trendVal="+12.5%" icon={TrendingUp} color="#2563eb" />
        <KpiCard title="إجمالي المصروفات" value="142,300 ج.م" sub="يناير 2024" trend="up" trendVal="+8.2%" icon={TrendingDown} color="#dc2626" />
        <KpiCard title="صافي الربح" value="106,200 ج.م" sub="هامش 42.7%" trend="up" trendVal="+18.1%" icon={TrendingUp} color="#16a34a" />
        <KpiCard title="فواتير معلقة" value="34,750 ج.م" sub="5 فواتير" trend="down" trendVal="-3.4%" icon={AlertCircle} color="#d97706" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "أرصدة الخزن", value: "85,430 ج.م", icon: Wallet, color: "#0284c7" },
          { label: "العهد المفتوحة", value: "12,500 ج.م", icon: Clock, color: "#7c3aed" },
          { label: "العملاء النشطون", value: "48 عميل", icon: Users, color: "#16a34a" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}18` }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-bold text-foreground amount">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3>الإيرادات والمصروفات</h3>
              <p className="text-xs text-muted-foreground">آخر 7 أشهر</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary" />إيرادات</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-destructive" />مصروفات</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dash-grad-revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dash-grad-expenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={
                <ChartTooltip
                  seriesLabels={{ revenue: "الإيرادات", expenses: "المصروفات" }}
                  valueFormatter={(v) => `${(v / 1000).toFixed(0)}K ج.م`}
                />
              } />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#dash-grad-revenue)" />
              <Area type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={2} fill="url(#dash-grad-expenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="mb-4">
            <h3>توزيع المصروفات</h3>
            <p className="text-xs text-muted-foreground">يناير 2024</p>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" cornerRadius={6}>
                {expenseBreakdown.map((entry) => (
                  <Cell key={`pie-cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={
                <PieTooltip
                  total={expenseBreakdown.reduce((s, i) => s + i.value, 0)}
                  valueFormatter={(v) => `${(v / 1000).toFixed(0)}K ج.م`}
                />
              } />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {expenseBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-medium text-foreground amount">{(item.value / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower panels */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Pending invoices */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="border-b border-border px-4 py-3 flex items-center justify-between">
            <h4>فواتير معلقة</h4>
            <button className="text-xs text-primary hover:underline">عرض الكل</button>
          </div>
          <div className="divide-y divide-border">
            {pendingInvoices.map((inv) => (
              <div key={inv.id} className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-mono text-primary amount">{inv.id}</p>
                  <p className="text-sm text-foreground truncate">{inv.customer}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 amount">استحقاق: {inv.due}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground amount">{inv.amount}</p>
                  <p className="text-xs mt-0.5" style={{ color: inv.overdue ? "var(--destructive)" : "var(--warning)" }}>
                    {inv.overdue ? "متأخرة" : "في الانتظار"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h4>آخر الأنشطة</h4>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((a, i) => (
              <div key={i} className="p-4 flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: a.status === "success" ? "#dcfce7" : a.status === "warning" ? "#fef3c7" : "#e0f2fe",
                  }}
                >
                  {a.status === "success" ? <Check size={14} style={{ color: "#16a34a" }} />
                    : a.status === "warning" ? <Clock size={14} style={{ color: "#d97706" }} />
                    : <FileText size={14} style={{ color: "#0284c7" }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.sub}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory snapshot */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="border-b border-border px-4 py-3 flex items-center justify-between">
            <h4>رصيد المخزون</h4>
            <button className="text-xs text-primary hover:underline">تفاصيل</button>
          </div>
          <div className="divide-y divide-border">
            {inventoryBalance.map((item) => (
              <div key={item.product} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.product}</p>
                  <p className="text-xs text-muted-foreground amount mt-0.5">{item.qty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground amount">{item.value}</p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={
                      item.status === "ok"
                        ? { backgroundColor: "#dcfce7", color: "#15803d" }
                        : { backgroundColor: "#fef3c7", color: "#92400e" }
                    }
                  >
                    {item.status === "ok" ? "مناسب" : "منخفض"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={inventoryBalance.map((i) => ({ name: i.product.split(" ")[0], value: parseFloat(i.value.replace(/,/g, "").replace(" ج.م", "")) }))} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={
                  <SingleTooltip
                    seriesLabel="القيمة"
                    valueFormatter={(v) => `${(v / 1000).toFixed(0)}K ج.م`}
                  />
                } />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
