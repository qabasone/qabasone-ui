import { TrendingUp, TrendingDown, Minus, MoreVertical, Printer, Download, Users, FileText, Wallet, AlertCircle } from "lucide-react";

function KpiCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  color = "primary",
}: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: React.ElementType;
  color?: "primary" | "success" | "warning" | "danger";
}) {
  const colorMap: Record<string, { bg: string; icon: string }> = {
    primary: { bg: "bg-primary/10", icon: "text-primary" },
    success: { bg: "bg-success/10", icon: "text-success" },
    warning: { bg: "bg-warning/10", icon: "text-warning" },
    danger: { bg: "bg-destructive/10", icon: "text-destructive" },
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color].bg}`}>
          <Icon size={20} className={colorMap[color].icon} />
        </div>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
          <MoreVertical size={14} />
        </button>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground amount mt-1">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {trend && trendValue && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon size={13} />
          <span>{trendValue} عن الشهر الماضي</span>
        </div>
      )}
    </div>
  );
}

function CustomerCard({
  name,
  id,
  phone,
  balance,
  status,
}: {
  name: string;
  id: string;
  phone: string;
  balance: string;
  status: "active" | "inactive";
}) {
  const isPositive = !balance.startsWith("-");
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("");

  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-primary font-bold text-sm">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{name}</p>
          <p className="text-xs text-muted-foreground font-mono amount">{id}</p>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
          }`}
        >
          {status === "active" ? "نشط" : "غير نشط"}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm border-t border-border pt-3">
        <span className="text-muted-foreground">{phone}</span>
        <span className={`font-semibold amount ${isPositive ? "text-success" : "text-destructive"}`}>
          {balance} ج.م
        </span>
      </div>
    </div>
  );
}

export function CardsSection() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">البطاقات</h1>
        <p className="text-muted-foreground">أنواع البطاقات المستخدمة في النظام</p>
      </div>

      {/* KPI cards */}
      <section>
        <h3 className="mb-4">بطاقات المؤشرات (KPI)</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="إجمالي الإيرادات"
            value="248,500 ج.م"
            subtitle="يناير 2024"
            trend="up"
            trendValue="+12.5%"
            icon={TrendingUp}
            color="primary"
          />
          <KpiCard
            title="إجمالي المصروفات"
            value="142,300 ج.م"
            subtitle="يناير 2024"
            trend="up"
            trendValue="+8.2%"
            icon={TrendingDown}
            color="danger"
          />
          <KpiCard
            title="صافي الربح"
            value="106,200 ج.م"
            subtitle="يناير 2024"
            trend="up"
            trendValue="+18.1%"
            icon={TrendingUp}
            color="success"
          />
          <KpiCard
            title="فواتير غير مدفوعة"
            value="34,750 ج.م"
            subtitle="5 فواتير معلقة"
            trend="down"
            trendValue="-3.4%"
            icon={AlertCircle}
            color="warning"
          />
        </div>
      </section>

      {/* Customer cards */}
      <section>
        <h3 className="mb-4">بطاقات العملاء</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CustomerCard name="شركة النور للتجارة" id="C-0001" phone="010 1234 5678" balance="45,500.00" status="active" />
          <CustomerCard name="مصنع الأهرام" id="C-0002" phone="011 9876 5432" balance="-12,000.00" status="active" />
          <CustomerCard name="شركة المستقبل" id="C-0003" phone="012 5555 4444" balance="0.00" status="inactive" />
        </div>
      </section>

      {/* Base card variants */}
      <section>
        <h3 className="mb-4">أنواع البطاقات الأساسية</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h4>بطاقة بسيطة</h4>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-muted-foreground">محتوى البطاقة يظهر هنا. يمكن استخدام هذه البطاقة لعرض أي معلومات.</p>
            </div>
            <div className="p-5 pt-0">
              <button className="h-9 w-full rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-blue-700 transition-colors">
                إجراء
              </button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border">
              <h4>معلومات الخزنة</h4>
              <p className="text-xs text-muted-foreground mt-1">الخزنة الرئيسية</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "الرصيد الحالي", value: "85,430.00 ج.م" },
                { label: "إجمالي الدخول", value: "120,000.00 ج.م" },
                { label: "إجمالي الخروج", value: "34,570.00 ج.م" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-semibold text-foreground amount">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h4>ملخص الفاتورة</h4>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted">
                  <Printer size={14} />
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted">
                  <Download size={14} />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="amount">45,000.00 ج.م</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ضريبة القيمة المضافة (14%)</span>
                <span className="amount text-warning">6,300.00 ج.م</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">خصم</span>
                <span className="amount text-success">-2,250.00 ج.م</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span>الإجمالي</span>
                <span className="amount text-primary">49,050.00 ج.م</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alert cards */}
      
    </div>
  );
}
