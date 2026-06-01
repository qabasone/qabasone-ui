import { useState } from "react";
import { Plus, Search, Phone, Mail, MapPin, ArrowLeft, FileText, Wallet, MoreVertical } from "lucide-react";

const customers = [
  { id: "C-0001", name: "شركة النور للتجارة", type: "مؤسسة", phone: "010 1234 5678", city: "القاهرة", balance: 45500, invoices: 12, status: "active" },
  { id: "C-0002", name: "مصنع الأهرام", type: "مؤسسة", phone: "011 9876 5432", city: "الجيزة", balance: -12000, invoices: 8, status: "active" },
  { id: "C-0003", name: "شركة المستقبل", type: "شخص", phone: "012 5555 4444", city: "الإسكندرية", balance: 0, invoices: 3, status: "inactive" },
  { id: "C-0004", name: "مؤسسة النيل", type: "مؤسسة", phone: "010 7777 8888", city: "القاهرة", balance: 28750, invoices: 21, status: "active" },
  { id: "C-0005", name: "تجارة الخير", type: "شخص", phone: "012 3333 2222", city: "المنصورة", balance: 15400, invoices: 6, status: "active" },
];

const transactions = [
  { id: "INV-2024-0123", type: "فاتورة", date: "15/01/2024", amount: 45500, direction: "debit", desc: "أرز غلا — 5 طن" },
  { id: "REC-2024-0045", type: "قبض", date: "20/01/2024", amount: 20000, direction: "credit", desc: "دفعة جزئية" },
  { id: "INV-2024-0089", type: "فاتورة", date: "10/12/2023", amount: 30000, direction: "debit", desc: "قمح — 15 طن" },
  { id: "REC-2024-0038", type: "قبض", date: "25/12/2023", amount: 30000, direction: "credit", desc: "سداد كامل" },
];

function CustomerList({ onSelect }: { onSelect: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const filtered = customers.filter((c) => c.name.includes(search) || c.id.includes(search) || c.city.includes(search));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>العملاء</h2>
          <p className="text-sm text-muted-foreground">{customers.length} عميل مسجل</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={15} />
          عميل جديد
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
        <input
          className="w-full h-10 ps-9 pe-3 rounded-xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="بحث بالاسم أو الرمز أو المدينة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              {["الرمز", "الاسم", "النوع", "المدينة", "الهاتف", "الرصيد", "الحالة", ""].map((h) => (
                <th key={h} className="p-3 text-start text-xs font-semibold text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer transition-colors"
                onClick={() => onSelect(c.id)}
              >
                <td className="p-3 font-mono text-xs text-muted-foreground amount">{c.id}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary text-xs font-bold">{c.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                  </div>
                </td>
                <td className="p-3 text-sm text-muted-foreground">{c.type}</td>
                <td className="p-3 text-sm text-muted-foreground">{c.city}</td>
                <td className="p-3 text-sm text-muted-foreground amount">{c.phone}</td>
                <td className="p-3 text-sm font-semibold amount" style={{ color: c.balance >= 0 ? "var(--success)" : "var(--destructive)" }}>
                  {c.balance.toLocaleString("ar-EG")} ج.م
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {c.status === "active" ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="p-3">
                  <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomerDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const c = customers.find((x) => x.id === id) || customers[0];
  const initials = c.name.split(" ").slice(0, 2).map((w) => w[0]).join("");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors" onClick={onBack}>
          <ArrowLeft size={16} />
        </button>
        <h2>ملف العميل</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Profile */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <div className="flex flex-col items-center text-center gap-3 pb-4 border-b border-border">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-xl">{initials}</span>
            </div>
            <div>
              <p className="font-bold text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5 amount">{c.id}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
              {c.status === "active" ? "نشط" : "غير نشط"}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone size={14} />
              <span className="amount">{c.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail size={14} />
              <span>contact@example.com</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={14} />
              <span>{c.city}، مصر</span>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <button className="w-full h-9 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <FileText size={14} />
              فاتورة جديدة
            </button>
            <button className="w-full h-9 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2 mt-2">
              <Wallet size={14} />
              تسجيل قبض
            </button>
          </div>
        </div>

        {/* Stats + Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "الرصيد الحالي", value: `${c.balance.toLocaleString("ar-EG")} ج.م`, color: c.balance >= 0 ? "text-success" : "text-destructive" },
              { label: "إجمالي الفواتير", value: c.invoices, color: "text-foreground" },
              { label: "متوسط قيمة الفاتورة", value: "25,450 ج.م", color: "text-foreground" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-lg font-bold mt-1 amount ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="border-b border-border px-4 py-3 flex items-center justify-between">
              <h4>كشف الحساب</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">رصيد أول المدة: <span className="amount">0.00 ج.م</span></span>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {["التاريخ", "المستند", "البيان", "مدين", "دائن", "الرصيد"].map((h) => (
                    <th key={h} className="p-3 text-start text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => {
                  const runningBalance = transactions.slice(0, i + 1).reduce((acc, t) => {
                    return t.direction === "debit" ? acc + t.amount : acc - t.amount;
                  }, 0);
                  return (
                    <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-3 text-sm text-muted-foreground amount">{tx.date}</td>
                      <td className="p-3 font-mono text-xs text-primary amount">{tx.id}</td>
                      <td className="p-3 text-sm text-foreground">{tx.desc}</td>
                      <td className="p-3 text-sm amount" style={{ color: tx.direction === "debit" ? "var(--destructive)" : "transparent" }}>
                        {tx.direction === "debit" ? `${tx.amount.toLocaleString("ar-EG")} ج.م` : "—"}
                      </td>
                      <td className="p-3 text-sm amount" style={{ color: tx.direction === "credit" ? "var(--success)" : "transparent" }}>
                        {tx.direction === "credit" ? `${tx.amount.toLocaleString("ar-EG")} ج.م` : "—"}
                      </td>
                      <td className="p-3 text-sm font-semibold amount" style={{ color: runningBalance >= 0 ? "var(--success)" : "var(--destructive)" }}>
                        {Math.abs(runningBalance).toLocaleString("ar-EG")} ج.م {runningBalance >= 0 ? "مدين" : "دائن"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t border-border bg-muted/20">
                <tr>
                  <td colSpan={3} className="p-3 text-sm font-semibold text-muted-foreground">الإجمالي</td>
                  <td className="p-3 text-sm font-bold text-destructive amount">75,500 ج.م</td>
                  <td className="p-3 text-sm font-bold text-success amount">50,000 ج.م</td>
                  <td className="p-3 text-sm font-bold text-destructive amount">25,500 ج.م مدين</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomerScreensSection() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedId, setSelectedId] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-1">شاشات العملاء</h1>
        <p className="text-muted-foreground">قائمة العملاء وملف العميل مع كشف الحساب</p>
      </div>

      <div className="flex items-center gap-2 bg-muted rounded-xl p-1 w-fit">
        {[
          { key: "list", label: "القائمة" },
          { key: "detail", label: "ملف العميل" },
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
        <CustomerList
          onSelect={(id) => {
            setSelectedId(id);
            setView("detail");
          }}
        />
      )}
      {view === "detail" && (
        <CustomerDetail id={selectedId || "C-0001"} onBack={() => setView("list")} />
      )}
    </div>
  );
}
