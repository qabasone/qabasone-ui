import { useState } from "react";
import { Search, Eye, EyeOff, ChevronDown, Calendar, Phone, Mail, Percent } from "lucide-react";
import {
  SearchableDropdown,
  MultiSelectDropdown,
  UserDropdown,
  AccountDropdown,
  type DropdownOption,
  type UserOption,
  type AccountOption,
} from "../SearchableDropdowns";

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive mr-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

const inputBase =
  "w-full h-10 px-3 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm";

export function InputsSection() {
  const [showPwd, setShowPwd] = useState(false);
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState("cash");
  const [toggled, setToggled] = useState(true);

  // Searchable dropdown states
  const [warehouse, setWarehouse] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [assignee, setAssignee] = useState<string>("");
  const [account, setAccount] = useState<string>("");

  const warehouseOptions: DropdownOption[] = [
    { value: "main", label: "المخزن الرئيسي" },
    { value: "alex", label: "مخزن فرع الإسكندرية" },
    { value: "driver", label: "مخزن السواق — أحمد محمد" },
    { value: "cairo", label: "مخزن فرع القاهرة" },
    { value: "delta", label: "مخزن الدلتا" },
  ];

  const categoryOptions: DropdownOption[] = [
    { value: "sales", label: "مبيعات" },
    { value: "purchases", label: "مشتريات" },
    { value: "expenses", label: "مصروفات" },
    { value: "returns", label: "مردودات" },
    { value: "transfers", label: "تحويلات" },
    { value: "adjustments", label: "تسويات" },
  ];

  const userOptions: UserOption[] = [
    { value: "u1", name: "أحمد محمد السيد", role: "مدير المبيعات", initials: "أم", color: "bg-blue-500" },
    { value: "u2", name: "سارة إبراهيم", role: "محاسب", initials: "سإ", color: "bg-emerald-500" },
    { value: "u3", name: "محمود عبدالله", role: "مشرف المخزن", initials: "مع", color: "bg-violet-500" },
    { value: "u4", name: "نورا حسن", role: "خدمة العملاء", initials: "نح", color: "bg-amber-500" },
    { value: "u5", name: "كريم طارق", role: "مندوب مبيعات", initials: "كط", color: "bg-rose-500" },
  ];

  const accountOptions: AccountOption[] = [
    { value: "a1", name: "البنك الأهلي المصري", number: "1234-5678", type: "بنك", balance: "45,200.00 ج.م" },
    { value: "a2", name: "خزنة المقر الرئيسي", number: "CASH-001", type: "خزنة", balance: "12,800.50 ج.م" },
    { value: "a3", name: "عهدة أحمد السواق", number: "DRV-007", type: "عهدة", balance: "3,400.00 ج.م" },
    { value: "a4", name: "بنك مصر — فرع المعادي", number: "9876-5432", type: "بنك", balance: "98,750.00 ج.م" },
    { value: "a5", name: "محفظة فودافون كاش", number: "VF-2024", type: "محفظة", balance: "2,100.00 ج.م" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">الحقول وعناصر النموذج</h1>
        <p className="text-muted-foreground">جميع أنواع حقول الإدخال في النظام</p>
      </div>

      {/* Text inputs */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-5">الحقول النصية</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="اسم العميل" required>
            <input className={inputBase} placeholder="مثال: شركة النور للتجارة" />
          </Field>
          <Field label="رقم الهاتف" hint="مثال: 010 1234 5678">
            <div className="relative">
              <Phone size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
              <input className={`${inputBase} ps-9`} placeholder="010 0000 0000" type="tel" />
            </div>
          </Field>
          <Field label="البريد الإلكتروني">
            <div className="relative">
              <Mail size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
              <input className={`${inputBase} ps-9`} placeholder="example@company.com" type="email" />
            </div>
          </Field>
          <Field label="كلمة السر">
            <div className="relative">
              <input
                className={`${inputBase} pe-10`}
                type={showPwd ? "text" : "password"}
                placeholder="كلمة السر"
              />
              <button
                className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>
          <Field label="البحث">
            <div className="relative">
              <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
              <input className={`${inputBase} ps-9`} placeholder="ابحث في الفواتير..." />
            </div>
          </Field>
          <Field label="الملاحظات" hint="حقل نصي متعدد الأسطر">
            <textarea
              className={`${inputBase} h-auto pt-2 pb-2 resize-none`}
              rows={3}
              placeholder="أضف ملاحظات إضافية هنا..."
            />
          </Field>
        </div>
      </section>

      {/* Number & currency */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-5">حقول الأرقام والمبالغ</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="الكمية" hint="يمكن إدخال أجزاء عشرية">
            <input className={`${inputBase} amount`} type="number" placeholder="0.000" step="0.001" />
          </Field>
          <Field label="السعر (ج.م)">
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground text-xs">ج.م</span>
              <input className={`${inputBase} amount pe-12`} type="number" placeholder="0.00" step="0.01" />
            </div>
          </Field>
          <Field label="نسبة الخصم">
            <div className="relative">
              <Percent size={14} className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground" />
              <input className={`${inputBase} amount pe-9`} type="number" placeholder="0" min="0" max="100" />
            </div>
          </Field>
          <Field label="المبلغ الإجمالي (ج.م)" hint="يحسب تلقائياً">
            <div className="relative">
              <span className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground text-xs">ج.م</span>
              <input
                className={`${inputBase} amount pe-12 bg-muted cursor-not-allowed`}
                value="45,750.00"
                readOnly
              />
            </div>
          </Field>
        </div>
      </section>

      {/* Select & Date */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-5">القوائم المنسدلة والتواريخ</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="المخزن" required>
            <div className="relative">
              <select className={`${inputBase} appearance-none pe-9`}>
                <option value="">اختر المخزن...</option>
                <option>المخزن الرئيسي</option>
                <option>مخزن فرع الإسكندرية</option>
                <option>مخزن السواق — أحمد محمد</option>
              </select>
              <ChevronDown size={14} className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground pointer-events-none" />
            </div>
          </Field>
          <Field label="طريقة الدفع">
            <div className="relative">
              <select className={`${inputBase} appearance-none pe-9`}>
                <option>آجل</option>
                <option>نقدي — خزنة</option>
                <option>نقدي — عهدة</option>
                <option>مختلط</option>
              </select>
              <ChevronDown size={14} className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground pointer-events-none" />
            </div>
          </Field>
          <Field label="تاريخ الفاتورة" required>
            <div className="relative">
              <Calendar size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
              <input className={`${inputBase} ps-9 amount`} type="date" defaultValue="2024-01-15" />
            </div>
          </Field>
          <Field label="تاريخ الاستحقاق">
            <div className="relative">
              <Calendar size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
              <input className={`${inputBase} ps-9 amount`} type="date" defaultValue="2024-02-15" />
            </div>
          </Field>
        </div>
      </section>

      {/* Checkbox, Radio, Toggle */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-5">الاختيارات والتبديل</h3>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">مربع الاختيار</p>
            {[
              { label: "فاتورة مبيعات", checked: true },
              { label: "مشتريات", checked: false },
              { label: "مصروفات", checked: true },
              { label: "مردودات", checked: false },
            ].map((item) => (
              <label key={item.label} className="flex items-center gap-2.5 cursor-pointer">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    item.checked ? "bg-primary border-primary" : "border-border bg-input-background"
                  }`}
                >
                  {item.checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-foreground">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">زر الراديو — طريقة الدفع</p>
            {[
              { value: "cash", label: "نقدي" },
              { value: "bank", label: "تحويل بنكي" },
              { value: "card", label: "بطاقة" },
              { value: "wallet", label: "محفظة إلكترونية" },
              { value: "check", label: "شيك" },
            ].map((item) => (
              <label key={item.value} className="flex items-center gap-2.5 cursor-pointer" onClick={() => setRadio(item.value)}>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    radio === item.value ? "border-primary" : "border-border"
                  }`}
                >
                  {radio === item.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm text-foreground">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">مفتاح التبديل</p>
            {[
              { label: "تفعيل الحساب", on: true },
              { label: "إشعارات الاستحقاق", on: false },
              { label: "تصدير تلقائي", on: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.label}</span>
                <div
                  className={`w-10 h-6 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${
                    item.on ? "bg-primary" : "bg-switch-background"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      item.on ? "translate-x-4" : "translate-x-0"
                    }`}
                    style={{ transform: item.on ? "translateX(-16px)" : "translateX(0)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* States */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-5">حالات الحقل</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="عادي">
            <input className={inputBase} placeholder="اكتب هنا..." />
          </Field>
          <Field label="في حالة التركيز">
            <input className={`${inputBase} ring-2 ring-ring border-transparent`} placeholder="الحقل نشط" />
          </Field>
          <Field label="به خطأ" error="هذا الحقل مطلوب">
            <input className={`${inputBase} border-destructive ring-1 ring-destructive`} placeholder="قيمة خاطئة" />
          </Field>
          <Field label="معطل">
            <input className={`${inputBase} opacity-50 cursor-not-allowed`} disabled placeholder="معطل" />
          </Field>
          <Field label="للقراءة فقط">
            <input className={`${inputBase} bg-muted cursor-not-allowed`} readOnly value="للقراءة فقط" />
          </Field>
          <Field label="ناجح" hint="تم التحقق بنجاح">
            <input className={`${inputBase} border-success ring-1 ring-success`} value="قيمة صحيحة" readOnly />
          </Field>
        </div>
      </section>

      {/* Searchable Dropdowns */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-1">القوائم المنسدلة القابلة للبحث</h3>
        <p className="text-muted-foreground mb-6 text-sm">مكونات قابلة لإعادة الاستخدام — أحادية ومتعددة ومع ملفات مستخدمين وحسابات</p>
        <div className="grid sm:grid-cols-2 gap-4">

          <Field label="اختيار المخزن" required hint="قائمة منسدلة بحث — أحادية الاختيار">
            <SearchableDropdown
              options={warehouseOptions}
              value={warehouse}
              onChange={setWarehouse}
              placeholder="اختر المخزن..."
            />
          </Field>

          <Field label="تصنيف الحركة" hint="اختيار متعدد مع شارات قابلة للإزالة">
            <MultiSelectDropdown
              options={categoryOptions}
              value={tags}
              onChange={setTags}
              placeholder="اختر التصنيفات..."
            />
          </Field>

          <Field label="المسؤول" hint="قائمة بصورة المستخدم والدور — RTL">
            <UserDropdown
              options={userOptions}
              value={assignee}
              onChange={setAssignee}
              placeholder="اختر المسؤول..."
            />
          </Field>

          <Field label="الحساب" hint="قائمة اختيار الحسابات مع الرصيد والنوع">
            <AccountDropdown
              options={accountOptions}
              value={account}
              onChange={setAccount}
              placeholder="اختر الحساب..."
            />
          </Field>

        </div>
      </section>
    </div>
  );
}
