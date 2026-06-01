export function SpacingSection() {
  const spacings = [
    { token: "4px", tw: "p-1", label: "4" },
    { token: "8px", tw: "p-2", label: "8" },
    { token: "12px", tw: "p-3", label: "12" },
    { token: "16px", tw: "p-4", label: "16" },
    { token: "20px", tw: "p-5", label: "20" },
    { token: "24px", tw: "p-6", label: "24" },
    { token: "32px", tw: "p-8", label: "32" },
    { token: "40px", tw: "p-10", label: "40" },
    { token: "48px", tw: "p-12", label: "48" },
    { token: "64px", tw: "p-16", label: "64" },
  ];

  const gaps = [
    { label: "xs — 4px", size: 4 },
    { label: "sm — 8px", size: 8 },
    { label: "md — 16px", size: 16 },
    { label: "lg — 24px", size: 24 },
    { label: "xl — 32px", size: 32 },
    { label: "2xl — 40px", size: 40 },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">المسافات</h1>
        <p className="text-muted-foreground">مقياس 4px — الوحدة الأساسية للتباعد</p>
      </div>

      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-6">مقياس التباعد</h3>
        <div className="space-y-4">
          {spacings.map((s) => (
            <div key={s.label} className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-12 text-left shrink-0 amount">{s.token}</span>
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="bg-primary/20 border border-primary/30 rounded"
                  style={{ width: `${parseInt(s.label) * 2}px`, height: "32px" }}
                />
                <span className="text-sm text-muted-foreground">{parseInt(s.label) * 2}px visual</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{s.tw}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-6">تباعد العناصر (Gap)</h3>
        <div className="space-y-6">
          {gaps.map((g) => (
            <div key={g.label}>
              <p className="text-sm text-muted-foreground mb-2">{g.label}</p>
              <div className="flex" style={{ gap: `${g.size}px` }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 rounded bg-primary/15 border border-primary/20 flex items-center justify-center"
                    style={{ width: "48px" }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-6">تطبيقات شائعة</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Padding داخلي للبطاقات (24px)</p>
            <div className="border-2 border-dashed border-border rounded-xl" style={{ padding: "24px" }}>
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center text-primary">محتوى البطاقة</div>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">Padding صفحة (32px)</p>
            <div className="border-2 border-dashed border-border rounded-xl" style={{ padding: "32px" }}>
              <div className="bg-success/10 rounded-lg p-3 text-sm text-center" style={{ color: "var(--success)" }}>محتوى الصفحة</div>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">تباعد عناصر النموذج (16px)</p>
            <div className="space-y-4 border border-border rounded-xl p-4">
              {["اسم العميل", "رقم الهاتف", "العنوان"].map((f) => (
                <div key={f} className="h-9 bg-muted rounded-lg flex items-center px-3 text-sm text-muted-foreground">
                  {f}...
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">تباعد عناصر القائمة (8px)</p>
            <div className="space-y-2 border border-border rounded-xl p-3">
              {["الفواتير", "العملاء", "المصروفات", "التقارير"].map((item) => (
                <div key={item} className="h-8 bg-muted/60 rounded-lg flex items-center px-3 text-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
