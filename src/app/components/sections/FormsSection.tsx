import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Plus, Trash2, ChevronLeft, ChevronRight, FileText,
  Users, ArrowLeftRight, Package, Check, X,
} from "lucide-react";
import { SearchableDropdown, UserDropdown, AccountDropdown } from "../SearchableDropdowns";
import type { DropdownOption, UserOption, AccountOption } from "../SearchableDropdowns";

// ─── Shared primitives ────────────────────────────────────────────────────────

const inputBase =
  "w-full h-10 px-3 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm";

function Field({
  label, required, hint, error, children, col,
}: {
  label: string; required?: boolean; hint?: string; error?: string;
  children: React.ReactNode; col?: "full" | "half" | "third";
}) {
  const colClass = col === "half" ? "sm:col-span-1" : col === "third" ? "" : "sm:col-span-2";
  return (
    <div className={`space-y-1.5 ${colClass}`}>
      <label className="block text-sm text-foreground" style={{ fontWeight: 500 }}>
        {label}
        {required && <span className="text-destructive me-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="pb-3 mb-4 border-b border-border">
      <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{title}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

interface StepDef { id: string; label: string }

function StepBar({ steps, current }: { steps: StepDef[]; current: number }) {
  return (
    <div className="flex items-center gap-0 mb-7">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs transition-all"
                style={{
                  backgroundColor: done ? "var(--success)" : active ? "var(--primary)" : "var(--muted)",
                  color: done || active ? "#fff" : "var(--muted-foreground)",
                  fontWeight: 600,
                }}
              >
                {done ? <Check size={13} strokeWidth={2.5} /> : String(i + 1).padStart(2, "0")}
              </div>
              <span
                className="text-xs hidden sm:block"
                style={{
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--foreground)" : done ? "var(--success)" : "var(--muted-foreground)",
                }}
              >
                {s.label}
              </span>
            </div>
            {!last && (
              <div className="flex-1 h-px mx-3" style={{ backgroundColor: done ? "var(--success)" : "var(--border)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FormActions({
  step, totalSteps, onBack, onNext, onDraft, nextLabel, finalLabel,
}: {
  step: number; totalSteps: number;
  onBack: () => void; onNext: () => void; onDraft?: () => void;
  nextLabel?: string; finalLabel?: string;
}) {
  const isFirst = step === 0;
  const isLast = step === totalSteps - 1;
  return (
    <div className="flex items-center justify-between pt-5 mt-6 border-t border-border sticky bottom-0 bg-card pb-1" style={{ marginLeft: "-1.5rem", marginRight: "-1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
      <div className="flex items-center gap-2">
        {!isFirst && (
          <button
            onClick={onBack}
            className="h-9 px-4 rounded-xl border border-border text-sm hover:bg-muted transition-colors flex items-center gap-1.5"
            style={{ fontWeight: 500 }}
          >
            <ChevronRight size={15} />
            السابق
          </button>
        )}
        {onDraft && (
          <button
            onClick={onDraft}
            className="h-9 px-4 rounded-xl border border-border text-sm hover:bg-muted transition-colors"
            style={{ fontWeight: 500 }}
          >
            حفظ كمسودة
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        className="h-9 px-5 rounded-xl bg-primary text-white text-sm hover:opacity-90 transition-opacity flex items-center gap-1.5"
        style={{ fontWeight: 600 }}
      >
        {isLast ? (finalLabel ?? "حفظ") : (nextLabel ?? "التالي")}
        {!isLast && <ChevronLeft size={15} />}
        {isLast && <Check size={14} />}
      </button>
    </div>
  );
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const customers: DropdownOption[] = [
  { value: "c1", label: "شركة النور للتجارة" },
  { value: "c2", label: "مصنع الأهرام" },
  { value: "c3", label: "تجارة الخير" },
  { value: "c4", label: "شركة المستقبل" },
];

const suppliers: DropdownOption[] = [
  { value: "s1", label: "شركة الغلة للتوريدات" },
  { value: "s2", label: "مورد القمح الذهبي" },
  { value: "s3", label: "مؤسسة الأمل للتجارة" },
];

const items: DropdownOption[] = [
  { value: "i1", label: "أرز غلا — كيلو" },
  { value: "i2", label: "قمح مطحون — كيلو" },
  { value: "i3", label: "أرز أبيض — كيلو" },
  { value: "i4", label: "سكر أبيض — كيلو" },
  { value: "i5", label: "زيت طعام — لتر" },
];

const warehouses: DropdownOption[] = [
  { value: "w1", label: "المخزن الرئيسي" },
  { value: "w2", label: "مخزن فرع الإسكندرية" },
  { value: "w3", label: "مخزن السواق" },
];

const units: DropdownOption[] = [
  { value: "u1", label: "كيلوغرام (كجم)" },
  { value: "u2", label: "طن" },
  { value: "u3", label: "لتر" },
  { value: "u4", label: "قطعة" },
  { value: "u5", label: "كرتونة" },
];

const categories: DropdownOption[] = [
  { value: "cat1", label: "حبوب ومحاصيل" },
  { value: "cat2", label: "زيوت وأطعمة" },
  { value: "cat3", label: "مواد خام" },
];

const salesReps: UserOption[] = [
  { value: "r1", name: "أحمد محمد السيد", role: "مندوب مبيعات", initials: "أم", color: "bg-blue-500" },
  { value: "r2", name: "سارة إبراهيم", role: "مندوب مبيعات", initials: "سإ", color: "bg-emerald-500" },
  { value: "r3", name: "كريم طارق", role: "مشرف مبيعات", initials: "كط", color: "bg-violet-500" },
];

const accounts: AccountOption[] = [
  { value: "a1", name: "البنك الأهلي المصري", number: "1234-5678", type: "بنك", balance: "45,200.00 ج.م" },
  { value: "a2", name: "خزنة المقر الرئيسي", number: "CASH-001", type: "خزنة", balance: "12,800.50 ج.م" },
  { value: "a3", name: "عهدة أحمد السواق", number: "DRV-007", type: "عهدة", balance: "3,400.00 ج.م" },
];

// ─── Form 1: فاتورة مبيعات ────────────────────────────────────────────────────

const INV_STEPS: StepDef[] = [
  { id: "customer", label: "بيانات العميل" },
  { id: "items",    label: "الأصناف" },
  { id: "payment",  label: "الدفع" },
  { id: "review",   label: "المراجعة" },
];

interface InvItem { id: number; item: string; qty: string; price: string; discount: string }

function InvoiceForm() {
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [invDate, setInvDate] = useState("2024-01-21");
  const [dueDate, setDueDate] = useState("2024-02-21");
  const [payMethod, setPayMethod] = useState("credit");
  const [account, setAccount] = useState("");
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState<InvItem[]>([
    { id: 1, item: "i1", qty: "500", price: "12.50", discount: "0" },
    { id: 2, item: "i3", qty: "200", price: "10.00", discount: "5" },
  ]);
  const nextId = useRef(3);

  const addRow = () => {
    setRows(r => [...r, { id: nextId.current++, item: "", qty: "", price: "", discount: "0" }]);
  };
  const removeRow = (id: number) => setRows(r => r.filter(x => x.id !== id));
  const updateRow = (id: number, field: keyof InvItem, val: string) =>
    setRows(r => r.map(x => x.id === id ? { ...x, [field]: val } : x));

  const subtotal = rows.reduce((s, r) => {
    const qty = parseFloat(r.qty) || 0;
    const price = parseFloat(r.price) || 0;
    const disc = parseFloat(r.discount) || 0;
    return s + qty * price * (1 - disc / 100);
  }, 0);
  const tax = subtotal * 0.14;
  const total = subtotal + tax;

  const fmt = (n: number) => n.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      <StepBar steps={INV_STEPS} current={step} />

      {/* Step 0 — Customer */}
      {step === 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <SectionHeading title="بيانات الفاتورة" sub="اختر العميل وحدد تواريخ الفاتورة" />
          <div /> {/* spacer */}
          <Field label="العميل" required col="full">
            <SearchableDropdown options={customers} value={customer} onChange={setCustomer} placeholder="اختر العميل..." />
          </Field>
          <Field label="رقم الفاتورة" hint="يُولَّد تلقائياً" col="half">
            <input className={`${inputBase} bg-muted cursor-not-allowed opacity-70`} readOnly value="INV-2024-0131" />
          </Field>
          <Field label="المخزن" required col="half">
            <SearchableDropdown options={warehouses} value={warehouse} onChange={setWarehouse} placeholder="اختر المخزن..." />
          </Field>
          <Field label="تاريخ الفاتورة" required col="half">
            <input className={`${inputBase} amount`} type="date" value={invDate} onChange={e => setInvDate(e.target.value)} />
          </Field>
          <Field label="تاريخ الاستحقاق" col="half">
            <input className={`${inputBase} amount`} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </Field>
          <Field label="ملاحظات الفاتورة" col="full">
            <textarea className={`${inputBase} h-auto pt-2 resize-none`} rows={2} placeholder="ملاحظات اختيارية..." />
          </Field>
        </div>
      )}

      {/* Step 1 — Items */}
      {step === 1 && (
        <div>
          <SectionHeading title="أصناف الفاتورة" sub="أضف الأصناف والكميات والأسعار" />
          <div className="rounded-xl border border-border overflow-hidden mb-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {["الصنف", "الكمية", "سعر الوحدة (ج.م)", "الخصم %", "الإجمالي (ج.م)", ""].map(h => (
                    <th key={h} className="text-right px-3 py-2.5 text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map(row => {
                  const qty = parseFloat(row.qty) || 0;
                  const price = parseFloat(row.price) || 0;
                  const disc = parseFloat(row.discount) || 0;
                  const lineTotal = qty * price * (1 - disc / 100);
                  return (
                    <tr key={row.id}>
                      <td className="px-3 py-2 w-44">
                        <SearchableDropdown options={items} value={row.item} onChange={v => updateRow(row.id, "item", v)} placeholder="اختر صنفاً..." />
                      </td>
                      <td className="px-3 py-2 w-24">
                        <input className={`${inputBase} amount`} value={row.qty} onChange={e => updateRow(row.id, "qty", e.target.value)} placeholder="0" />
                      </td>
                      <td className="px-3 py-2 w-32">
                        <input className={`${inputBase} amount`} value={row.price} onChange={e => updateRow(row.id, "price", e.target.value)} placeholder="0.00" />
                      </td>
                      <td className="px-3 py-2 w-24">
                        <input className={`${inputBase} amount`} value={row.discount} onChange={e => updateRow(row.id, "discount", e.target.value)} placeholder="0" />
                      </td>
                      <td className="px-3 py-2 w-32 text-foreground amount text-sm" style={{ fontWeight: 500 }}>
                        {fmt(lineTotal)}
                      </td>
                      <td className="px-3 py-2">
                        <button onClick={() => removeRow(row.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button onClick={addRow} className="h-9 px-4 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5 transition-colors flex items-center gap-2">
            <Plus size={15} />
            إضافة صنف
          </button>
          {/* Totals */}
          <div className="mt-5 flex justify-end">
            <div className="w-64 space-y-2">
              {[
                { label: "الإجمالي قبل الخصم", val: fmt(subtotal) },
                { label: "ضريبة القيمة المضافة (14%)", val: fmt(tax) },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-foreground amount">{row.val}</span>
                  <span className="text-muted-foreground">{row.label}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-foreground amount" style={{ fontWeight: 700, fontSize: "15px" }}>{fmt(total)} ج.م</span>
                <span className="text-sm text-foreground" style={{ fontWeight: 600 }}>الإجمالي النهائي</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Payment */}
      {step === 2 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <SectionHeading title="طريقة الدفع" sub="حدد كيفية تسوية هذه الفاتورة" />
          <div />
          <Field label="طريقة الدفع" required col="full">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: "credit", label: "آجل" },
                { val: "cash",   label: "نقدي" },
                { val: "bank",   label: "تحويل بنكي" },
                { val: "mixed",  label: "مختلط" },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setPayMethod(opt.val)}
                  className="h-10 rounded-lg border text-sm transition-all"
                  style={{
                    borderColor: payMethod === opt.val ? "var(--primary)" : "var(--border)",
                    backgroundColor: payMethod === opt.val ? "var(--accent)" : "var(--input-background)",
                    color: payMethod === opt.val ? "var(--primary)" : "var(--muted-foreground)",
                    fontWeight: payMethod === opt.val ? 600 : 400,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>
          {payMethod !== "credit" && (
            <Field label="الحساب" required col="full">
              <AccountDropdown options={accounts} value={account} onChange={setAccount} placeholder="اختر الحساب..." />
            </Field>
          )}
          <Field label="مندوب المبيعات" col="half">
            <UserDropdown options={salesReps} placeholder="اختر المندوب..." />
          </Field>
          <Field label="رقم المرجع / الشيك" hint="اختياري" col="half">
            <input className={`${inputBase} amount`} placeholder="مثال: CHK-001234" />
          </Field>
          <Field label="ملاحظات الدفع" col="full">
            <textarea className={`${inputBase} h-auto pt-2 resize-none`} rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="أضف ملاحظات خاصة بالدفع..." />
          </Field>
        </div>
      )}

      {/* Step 3 — Review */}
      {step === 3 && (
        <div>
          <SectionHeading title="مراجعة وتأكيد" sub="راجع بيانات الفاتورة قبل الحفظ" />
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "العميل", val: customers.find(c => c.value === customer)?.label ?? "—" },
              { label: "رقم الفاتورة", val: "INV-2024-0131" },
              { label: "تاريخ الفاتورة", val: invDate },
              { label: "تاريخ الاستحقاق", val: dueDate },
              { label: "طريقة الدفع", val: { credit: "آجل", cash: "نقدي", bank: "تحويل بنكي", mixed: "مختلط" }[payMethod] ?? payMethod },
              { label: "عدد الأصناف", val: `${rows.length} صنف` },
            ].map(row => (
              <div key={row.label} className="flex items-start justify-between gap-2 bg-muted/40 rounded-xl px-4 py-3">
                <span className="text-foreground text-sm" style={{ fontWeight: 500 }}>{row.val}</span>
                <span className="text-muted-foreground text-xs mt-0.5">{row.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between bg-primary/8 rounded-xl px-5 py-4 border border-primary/20">
            <span className="text-primary amount" style={{ fontWeight: 700, fontSize: "18px" }}>{fmt(total)} ج.م</span>
            <span className="text-sm text-primary" style={{ fontWeight: 600 }}>الإجمالي النهائي شامل الضريبة</span>
          </div>
        </div>
      )}

      <FormActions
        step={step} totalSteps={INV_STEPS.length}
        onBack={() => setStep(s => s - 1)}
        onNext={() => setStep(s => Math.min(s + 1, INV_STEPS.length - 1))}
        onDraft={() => {}}
        finalLabel="حفظ الفاتورة"
      />
    </div>
  );
}

// ─── Form 2: إضافة عميل / مورد ───────────────────────────────────────────────

const PARTY_STEPS: StepDef[] = [
  { id: "basic",   label: "البيانات الأساسية" },
  { id: "contact", label: "بيانات الاتصال" },
  { id: "finance", label: "البيانات المالية" },
];

function CustomerForm({ type }: { type: "customer" | "supplier" }) {
  const [step, setStep] = useState(0);
  const [partyType, setPartyType] = useState("company");

  return (
    <div>
      <StepBar steps={PARTY_STEPS} current={step} />

      {/* Step 0 — Basic */}
      {step === 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <SectionHeading
            title={type === "customer" ? "بيانات العميل الأساسية" : "بيانات المورد الأساسية"}
            sub="أدخل الاسم والتصنيف والكود المرجعي"
          />
          <div />
          <Field label={type === "customer" ? "اسم العميل" : "اسم المورد"} required col="full">
            <input className={inputBase} placeholder={type === "customer" ? "مثال: شركة النور للتجارة" : "مثال: شركة الغلة للتوريدات"} />
          </Field>
          <Field label="الكود المرجعي" hint="يُولَّد تلقائياً أو يمكن تعديله" col="half">
            <input className={`${inputBase} amount`} defaultValue={type === "customer" ? "CUST-0048" : "SUPP-0019"} />
          </Field>
          <Field label="النوع" required col="half">
            <div className="flex gap-2">
              {[{ val: "company", label: "شركة" }, { val: "individual", label: "فرد" }].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setPartyType(opt.val)}
                  className="flex-1 h-10 rounded-lg border text-sm transition-all"
                  style={{
                    borderColor: partyType === opt.val ? "var(--primary)" : "var(--border)",
                    backgroundColor: partyType === opt.val ? "var(--accent)" : "var(--input-background)",
                    color: partyType === opt.val ? "var(--primary)" : "var(--muted-foreground)",
                    fontWeight: partyType === opt.val ? 600 : 400,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="التصنيف" col="half">
            <div className="relative">
              <select className={`${inputBase} appearance-none pe-9`}>
                <option>عميل عادي</option>
                <option>عميل VIP</option>
                <option>عميل جملة</option>
                <option>عميل تجزئة</option>
              </select>
              <span className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground pointer-events-none">▾</span>
            </div>
          </Field>
          <Field label="مندوب المبيعات" col="half">
            <UserDropdown options={salesReps} placeholder="اختر المندوب..." />
          </Field>
          {partyType === "company" && (
            <Field label="الرقم الضريبي" hint="الرقم التعريفي الضريبي للشركة" col="half">
              <input className={`${inputBase} amount`} placeholder="100-234-567" />
            </Field>
          )}
        </div>
      )}

      {/* Step 1 — Contact */}
      {step === 1 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <SectionHeading title="بيانات الاتصال" sub="معلومات التواصل مع العميل أو المورد" />
          <div />
          <Field label="رقم الهاتف" required col="half">
            <input className={`${inputBase} amount`} type="tel" placeholder="010 0000 0000" />
          </Field>
          <Field label="رقم هاتف إضافي" col="half">
            <input className={`${inputBase} amount`} type="tel" placeholder="011 0000 0000" />
          </Field>
          <Field label="البريد الإلكتروني" col="full">
            <input className={inputBase} type="email" placeholder="info@company.com" />
          </Field>
          <Field label="العنوان" col="full">
            <input className={inputBase} placeholder="الشارع، الحي..." />
          </Field>
          <Field label="المحافظة" col="half">
            <div className="relative">
              <select className={`${inputBase} appearance-none pe-9`}>
                <option>القاهرة</option>
                <option>الإسكندرية</option>
                <option>الجيزة</option>
                <option>بورسعيد</option>
                <option>السويس</option>
              </select>
              <span className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground pointer-events-none">▾</span>
            </div>
          </Field>
          <Field label="المدينة / المنطقة" col="half">
            <input className={inputBase} placeholder="مثال: مدينة نصر" />
          </Field>
          <Field label="ملاحظات الاتصال" col="full">
            <textarea className={`${inputBase} h-auto pt-2 resize-none`} rows={2} placeholder="أوقات التواصل المفضلة، طريقة التواصل..." />
          </Field>
        </div>
      )}

      {/* Step 2 — Financial */}
      {step === 2 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <SectionHeading title="البيانات المالية" sub="حدد الحدود الائتمانية وشروط الدفع" />
          <div />
          <Field label="حد الائتمان (ج.م)" hint="0 = غير محدود" col="half">
            <input className={`${inputBase} amount`} type="number" placeholder="0.00" defaultValue="50000" />
          </Field>
          <Field label="شروط الدفع (يوم)" col="half">
            <div className="relative">
              <select className={`${inputBase} appearance-none pe-9`}>
                <option value="0">فوري</option>
                <option value="15">15 يوم</option>
                <option value="30" selected>30 يوم</option>
                <option value="60">60 يوم</option>
                <option value="90">90 يوم</option>
              </select>
              <span className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground pointer-events-none">▾</span>
            </div>
          </Field>
          <Field label="الرصيد الافتتاحي (ج.م)" hint="الرصيد المبدئي عند إضافة العميل" col="half">
            <input className={`${inputBase} amount`} type="number" placeholder="0.00" />
          </Field>
          <Field label="نوع الرصيد الافتتاحي" col="half">
            <div className="flex gap-2">
              {[{ val: "debit", label: "مدين (له)" }, { val: "credit", label: "دائن (عليه)" }].map(opt => (
                <button key={opt.val} className="flex-1 h-10 rounded-lg border border-border bg-input-background text-sm text-muted-foreground hover:border-primary hover:text-primary transition-all">
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="تاريخ الرصيد الافتتاحي" col="half">
            <input className={`${inputBase} amount`} type="date" defaultValue="2024-01-01" />
          </Field>
          <Field label="الحساب المحاسبي" hint="حساب دفتر الأستاذ المرتبط" col="half">
            <input className={`${inputBase} amount`} placeholder="120001" />
          </Field>
        </div>
      )}

      <FormActions
        step={step} totalSteps={PARTY_STEPS.length}
        onBack={() => setStep(s => s - 1)}
        onNext={() => setStep(s => Math.min(s + 1, PARTY_STEPS.length - 1))}
        onDraft={() => {}}
        finalLabel={type === "customer" ? "إضافة العميل" : "إضافة المورد"}
      />
    </div>
  );
}

// ─── Form 3: تسجيل قبض / صرف ─────────────────────────────────────────────────

function TransactionForm({ type }: { type: "receipt" | "payment" }) {
  const [payMethod, setPayMethod] = useState("cash");

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <SectionHeading
        title={type === "receipt" ? "تسجيل قبض من عميل" : "تسجيل صرف لمورد"}
        sub={type === "receipt" ? "سجّل مبلغاً تم استلامه من عميل" : "سجّل مبلغاً تم صرفه لمورد"}
      />
      <div />
      <Field label={type === "receipt" ? "العميل" : "المورد"} required col="full">
        <SearchableDropdown
          options={type === "receipt" ? customers : suppliers}
          placeholder={type === "receipt" ? "اختر العميل..." : "اختر المورد..."}
        />
      </Field>
      <Field label="المبلغ (ج.م)" required col="half">
        <input className={`${inputBase} amount`} type="number" placeholder="0.00" step="0.01" />
      </Field>
      <Field label="التاريخ" required col="half">
        <input className={`${inputBase} amount`} type="date" defaultValue="2024-01-21" />
      </Field>
      <Field label="طريقة الدفع" required col="full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { val: "cash", label: "نقدي" },
            { val: "bank", label: "تحويل بنكي" },
            { val: "check", label: "شيك" },
            { val: "wallet", label: "محفظة إلكترونية" },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => setPayMethod(opt.val)}
              className="h-10 rounded-lg border text-sm transition-all"
              style={{
                borderColor: payMethod === opt.val ? "var(--primary)" : "var(--border)",
                backgroundColor: payMethod === opt.val ? "var(--accent)" : "var(--input-background)",
                color: payMethod === opt.val ? "var(--primary)" : "var(--muted-foreground)",
                fontWeight: payMethod === opt.val ? 600 : 400,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>
      <Field label="الحساب" required col="half">
        <AccountDropdown options={accounts} placeholder="اختر الحساب..." />
      </Field>
      <Field label="رقم المرجع" hint={payMethod === "check" ? "رقم الشيك" : "رقم الإيصال أو التحويل"} col="half">
        <input className={`${inputBase} amount`} placeholder="REF-001234" />
      </Field>
      <Field label="الفاتورة المرتبطة" hint="اختياري" col="full">
        <SearchableDropdown
          options={[
            { value: "inv1", label: "INV-2024-0125 — شركة النور (12,300 ج.م)" },
            { value: "inv2", label: "INV-2024-0124 — مصنع الأهرام (28,750 ج.م)" },
            { value: "inv3", label: "INV-2024-0128 — تجارة الخير (9,500 ج.م)" },
          ]}
          placeholder="اختر الفاتورة..."
        />
      </Field>
      <Field label="ملاحظات" col="full">
        <textarea className={`${inputBase} h-auto pt-2 resize-none`} rows={2} placeholder="ملاحظات اختيارية..." />
      </Field>

      <div className="sm:col-span-2 flex items-center justify-between pt-5 border-t border-border sticky bottom-0 bg-card pb-1" style={{ marginLeft: "-1.5rem", marginRight: "-1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <button className="h-9 px-4 rounded-xl border border-border text-sm hover:bg-muted transition-colors" style={{ fontWeight: 500 }}>
          إلغاء
        </button>
        <button
          className="h-9 px-5 rounded-xl text-white text-sm hover:opacity-90 transition-opacity flex items-center gap-1.5"
          style={{ backgroundColor: type === "receipt" ? "var(--success)" : "var(--destructive)", fontWeight: 600 }}
        >
          <Check size={14} />
          {type === "receipt" ? "تسجيل القبض" : "تسجيل الصرف"}
        </button>
      </div>
    </div>
  );
}

// ─── Form 4: إضافة صنف ───────────────────────────────────────────────────────

const ITEM_STEPS: StepDef[] = [
  { id: "basic",   label: "البيانات الأساسية" },
  { id: "pricing", label: "التسعير والمخزون" },
];

function ItemForm() {
  const [step, setStep] = useState(0);
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [hasTax, setHasTax] = useState(true);
  const [trackStock, setTrackStock] = useState(true);
  const [warehouse, setWarehouse] = useState("");

  return (
    <div>
      <StepBar steps={ITEM_STEPS} current={step} />

      {/* Step 0 — Basic */}
      {step === 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <SectionHeading title="بيانات الصنف" sub="أدخل اسم الصنف وتصنيفه وحدة القياس" />
          <div />
          <Field label="اسم الصنف" required col="full">
            <input className={inputBase} placeholder="مثال: أرز غلا" />
          </Field>
          <Field label="كود الصنف" hint="يُولَّد تلقائياً أو أدخل كوداً مخصصاً" col="half">
            <input className={`${inputBase} amount`} defaultValue="ITEM-0089" />
          </Field>
          <Field label="الباركود" hint="اختياري" col="half">
            <input className={`${inputBase} amount`} placeholder="6901234567890" />
          </Field>
          <Field label="التصنيف" required col="half">
            <SearchableDropdown options={categories} value={category} onChange={setCategory} placeholder="اختر التصنيف..." />
          </Field>
          <Field label="وحدة القياس" required col="half">
            <SearchableDropdown options={units} value={unit} onChange={setUnit} placeholder="اختر الوحدة..." />
          </Field>
          <Field label="الوصف" col="full">
            <textarea className={`${inputBase} h-auto pt-2 resize-none`} rows={2} placeholder="وصف مختصر للصنف..." />
          </Field>
          {/* Toggles */}
          <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
            {[
              { label: "خاضع للضريبة (14% VAT)", val: hasTax, set: setHasTax },
              { label: "تتبع المخزون", val: trackStock, set: setTrackStock },
            ].map(t => (
              <label key={t.label} className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => t.set(!t.val)}
                  className="w-10 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer"
                  style={{ backgroundColor: t.val ? "var(--primary)" : "var(--switch-background)" }}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
                    style={{ transform: t.val ? "translateX(-16px)" : "translateX(0)" }} />
                </div>
                <span className="text-sm text-foreground">{t.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 — Pricing & Stock */}
      {step === 1 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <SectionHeading title="التسعير" sub="أسعار الشراء والبيع وهامش الربح" />
          <div />
          <Field label="سعر الشراء (ج.م)" required col="half">
            <input className={`${inputBase} amount`} type="number" placeholder="0.000" step="0.001" />
          </Field>
          <Field label="سعر البيع (ج.م)" required col="half">
            <input className={`${inputBase} amount`} type="number" placeholder="0.000" step="0.001" />
          </Field>
          <Field label="أدنى سعر بيع (ج.م)" hint="لن يُسمح ببيع الصنف بأقل من هذا السعر" col="half">
            <input className={`${inputBase} amount`} type="number" placeholder="0.000" />
          </Field>
          <Field label="هامش الربح المستهدف (%)" col="half">
            <input className={`${inputBase} amount`} type="number" placeholder="0" min="0" max="100" />
          </Field>

          <div className="sm:col-span-2">
            <SectionHeading title="المخزون الافتتاحي" sub="الكمية والمخزن عند إضافة الصنف لأول مرة" />
          </div>
          <Field label="المخزن" required col="half">
            <SearchableDropdown options={warehouses} value={warehouse} onChange={setWarehouse} placeholder="اختر المخزن..." />
          </Field>
          <Field label="الكمية الافتتاحية" col="half">
            <input className={`${inputBase} amount`} type="number" placeholder="0" />
          </Field>
          <Field label="الحد الأدنى للمخزون" hint="سيظهر تحذير عند الوصول لهذا الحد" col="half">
            <input className={`${inputBase} amount`} type="number" placeholder="0" defaultValue="10" />
          </Field>
          <Field label="الحد الأقصى للمخزون" hint="اختياري" col="half">
            <input className={`${inputBase} amount`} type="number" placeholder="0" />
          </Field>
        </div>
      )}

      <FormActions
        step={step} totalSteps={ITEM_STEPS.length}
        onBack={() => setStep(s => s - 1)}
        onNext={() => setStep(s => Math.min(s + 1, ITEM_STEPS.length - 1))}
        finalLabel="إضافة الصنف"
      />
    </div>
  );
}

// ─── Form catalogue ───────────────────────────────────────────────────────────

interface FormDef {
  id: string;
  label: string;
  sub: string;
  desc: string;
  icon: React.ElementType;
  iconBg: string;
  badge?: string;
}

const FORMS: FormDef[] = [
  {
    id: "invoice",
    label: "فاتورة مبيعات",
    sub: "4 خطوات",
    desc: "أنشئ فاتورة مبيعات، أضف الأصناف والكميات، وحدد طريقة الدفع.",
    icon: FileText,
    iconBg: "var(--primary)",
    badge: "الأكثر استخداماً",
  },
  {
    id: "customer",
    label: "إضافة عميل",
    sub: "3 خطوات",
    desc: "سجّل عميلاً جديداً مع بياناته الكاملة وحدوده الائتمانية.",
    icon: Users,
    iconBg: "var(--info)",
  },
  {
    id: "supplier",
    label: "إضافة مورد",
    sub: "3 خطوات",
    desc: "أضف موردًا جديداً مع بيانات الاتصال وشروط التعامل.",
    icon: Users,
    iconBg: "var(--warning)",
  },
  {
    id: "receipt",
    label: "تسجيل قبض",
    sub: "صفحة واحدة",
    desc: "سجّل مبلغاً استُلم من عميل وحدد الحساب وطريقة الاستلام.",
    icon: ArrowLeftRight,
    iconBg: "var(--success)",
  },
  {
    id: "payment",
    label: "تسجيل صرف",
    sub: "صفحة واحدة",
    desc: "سجّل مبلغاً صُرف لمورد وحدد الحساب وطريقة الدفع.",
    icon: ArrowLeftRight,
    iconBg: "var(--destructive)",
  },
  {
    id: "item",
    label: "إضافة صنف",
    sub: "خطوتان",
    desc: "أضف صنفاً للمخزون مع التسعير والوحدة والكميات الافتتاحية.",
    icon: Package,
    iconBg: "#7c3aed",
  },
];

const FORM_DESC: Record<string, string> = {
  invoice:  "أنشئ فاتورة مبيعات جديدة وأضف الأصناف وحدد طريقة الدفع",
  customer: "أضف عميلاً جديداً مع بياناته الكاملة وحدوده الائتمانية",
  supplier: "أضف موردًا جديدًا مع بياناته وشروط التعامل",
  receipt:  "سجّل مبلغ قبض من عميل وحدد طريقة الاستلام والحساب",
  payment:  "سجّل مبلغ صرف لمورد وحدد طريقة الدفع والحساب",
  item:     "أضف صنفاً جديداً للمخزون مع التسعير والكميات",
};

// ─── Modal ────────────────────────────────────────────────────────────────────

function FormModal({
  formId,
  onClose,
}: {
  formId: string;
  onClose: () => void;
}) {
  const def = FORMS.find(f => f.id === formId)!;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", animation: "modal-backdrop-in 0.18s ease both" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        dir="rtl"
        lang="ar"
        className="bg-card rounded-2xl border border-border flex flex-col"
        style={{
          width: "min(680px, 100%)",
          maxHeight: "min(85vh, 780px)",
          boxShadow: "var(--shadow-modal)",
          animation: "modal-slide-in 0.22s cubic-bezier(0.16,1,0.3,1) both",
          fontFamily: "var(--font-family)",
        }}
      >
        {/* Modal header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: def.iconBg }}
          >
            <def.icon size={17} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-foreground truncate">{def.label}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{FORM_DESC[formId]}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
            aria-label="إغلاق"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto p-6 dropdown-scroll">
          {formId === "invoice"  && <InvoiceForm key="invoice" />}
          {formId === "customer" && <CustomerForm key="customer" type="customer" />}
          {formId === "supplier" && <CustomerForm key="supplier" type="supplier" />}
          {formId === "receipt"  && <TransactionForm key="receipt" type="receipt" />}
          {formId === "payment"  && <TransactionForm key="payment" type="payment" />}
          {formId === "item"     && <ItemForm key="item" />}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function FormsSection() {
  const [openForm, setOpenForm] = useState<string | null>(null);
  const close = useCallback(() => setOpenForm(null), []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground mb-1">النماذج</h1>
        <p className="text-muted-foreground">نماذج تفاعلية متعددة الخطوات — اضغط على أي بطاقة لفتح النموذج</p>
      </div>

      {/* Launcher grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FORMS.map(f => (
          <button
            key={f.id}
            onClick={() => setOpenForm(f.id)}
            className="group bg-card rounded-2xl border border-border p-5 text-right hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col gap-3"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {f.badge && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--primary-muted)", color: "var(--primary)", fontWeight: 600 }}
                  >
                    {f.badge}
                  </span>
                )}
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: f.iconBg + "18" }}
              >
                <f.icon size={18} style={{ color: f.iconBg }} />
              </div>
            </div>
            <div>
              <p className="text-foreground text-sm mb-1" style={{ fontWeight: 600 }}>{f.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
              <span
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)", fontWeight: 500 }}
              >
                {f.sub}
              </span>
              <span
                className="text-xs flex items-center gap-1 transition-colors"
                style={{ color: "var(--primary)", fontWeight: 500, opacity: 0 }}
                data-open-hint
              >
                فتح النموذج
                <ChevronLeft size={13} />
              </span>
            </div>
          </button>
        ))}
      </div>

      {openForm && <FormModal formId={openForm} onClose={close} />}
    </div>
  );
}

