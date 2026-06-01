export function ColorsSection() {
  const palette = [
    {
      group: "الألوان الأساسية",
      colors: [
        { name: "Primary", label: "الرئيسي", value: "#2563eb", text: "white" },
        { name: "Primary Muted", label: "رئيسي فاتح", value: "#eff6ff", text: "#1e40af" },
        { name: "Success", label: "نجاح", value: "#16a34a", text: "white" },
        { name: "Success Muted", label: "نجاح فاتح", value: "#dcfce7", text: "#15803d" },
        { name: "Warning", label: "تحذير", value: "#d97706", text: "white" },
        { name: "Warning Muted", label: "تحذير فاتح", value: "#fef3c7", text: "#92400e" },
        { name: "Destructive", label: "خطر", value: "#dc2626", text: "white" },
        { name: "Destructive Muted", label: "خطر فاتح", value: "#fee2e2", text: "#991b1b" },
        { name: "Info", label: "معلومة", value: "#0284c7", text: "white" },
        { name: "Info Muted", label: "معلومة فاتحة", value: "#e0f2fe", text: "#075985" },
      ],
    },
    {
      group: "الخلفيات والأسطح",
      colors: [
        { name: "Background", label: "خلفية التطبيق", value: "#f1f5f9", text: "#0f172a" },
        { name: "Card", label: "خلفية البطاقة", value: "#ffffff", text: "#0f172a", border: true },
        { name: "Muted", label: "رمادي فاتح", value: "#f1f5f9", text: "#0f172a", border: true },
        { name: "Input BG", label: "خلفية الحقل", value: "#f8fafc", text: "#0f172a", border: true },
        { name: "Sidebar", label: "خلفية الشريط الجانبي", value: "#1e293b", text: "#cbd5e1" },
      ],
    },
    {
      group: "النصوص",
      colors: [
        { name: "Foreground", label: "نص رئيسي", value: "#0f172a", text: "white" },
        { name: "Muted Foreground", label: "نص ثانوي", value: "#64748b", text: "white" },
        { name: "Sidebar FG", label: "نص الشريط", value: "#cbd5e1", text: "#1e293b" },
      ],
    },
    {
      group: "ألوان المخططات",
      colors: [
        { name: "Chart 1", label: "مخطط ١", value: "#2563eb", text: "white" },
        { name: "Chart 2", label: "مخطط ٢", value: "#16a34a", text: "white" },
        { name: "Chart 3", label: "مخطط ٣", value: "#d97706", text: "white" },
        { name: "Chart 4", label: "مخطط ٤", value: "#dc2626", text: "white" },
        { name: "Chart 5", label: "مخطط ٥", value: "#7c3aed", text: "white" },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">الألوان</h1>
        <p className="text-muted-foreground">لوحة الألوان الأساسية لنظام قبس المحاسبي</p>
      </div>

      {palette.map((group) => (
        <section key={group.group}>
          <h3 className="text-foreground mb-4">{group.group}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {group.colors.map((color) => (
              <div
                key={color.name}
                className="rounded-xl overflow-hidden shadow-sm"
                style={{ border: color.border ? "1px solid rgba(0,0,0,0.08)" : "none" }}
              >
                <div
                  className="h-20 flex items-end p-3"
                  style={{ backgroundColor: color.value, color: color.text }}
                >
                  <span className="text-xs font-mono opacity-80 amount">{color.value}</span>
                </div>
                <div className="bg-white px-3 py-2 border-t border-border">
                  <p className="text-xs font-medium text-foreground">{color.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">{color.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h3 className="text-foreground mb-4">حالات الفواتير — مجموعات الألوان</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "مدفوعة", bg: "#dcfce7", text: "#15803d", dot: "#16a34a" },
            { label: "في الانتظار", bg: "#fef3c7", text: "#92400e", dot: "#d97706" },
            { label: "متأخرة", bg: "#fee2e2", text: "#991b1b", dot: "#dc2626" },
            { label: "مسودة", bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ backgroundColor: s.bg }}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: s.dot }}
              />
              <span className="font-medium" style={{ color: s.text }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
