export function RadiusShadowsSection() {
  const radii = [
    { name: "sm", value: "6px", tw: "rounded-sm", desc: "العلامات الصغيرة، البادجات" },
    { name: "md", value: "8px", tw: "rounded-md", desc: "الأزرار، الحقول" },
    { name: "lg", value: "10px", tw: "rounded-lg", desc: "البطاقات الصغيرة" },
    { name: "xl", value: "14px", tw: "rounded-xl", desc: "البطاقات، الحوارات" },
    { name: "2xl", value: "16px", tw: "rounded-2xl", desc: "البطاقات الكبيرة" },
    { name: "full", value: "9999px", tw: "rounded-full", desc: "الشارات الدائرية، الصور" },
  ];

  const shadows = [
    {
      name: "card",
      label: "بطاقة",
      desc: "shadow-sm",
      style: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)",
    },
    {
      name: "popover",
      label: "منبثق",
      desc: "shadow-md",
      style: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.06)",
    },
    {
      name: "modal",
      label: "نافذة حوار",
      desc: "shadow-xl",
      style: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06)",
    },
    {
      name: "none",
      label: "بدون ظل",
      desc: "shadow-none",
      style: "none",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">الزوايا والظلال</h1>
        <p className="text-muted-foreground">مقياس الزوايا الدائرية ومستويات الظلال</p>
      </div>

      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-6">الزوايا الدائرية</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {radii.map((r) => (
            <div key={r.name} className="flex flex-col items-start gap-3">
              <div
                className="w-20 h-20 bg-primary/15 border-2 border-primary/30 flex items-center justify-center"
                style={{ borderRadius: r.value }}
              >
                <span className="text-xs text-primary font-mono">{r.value}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{r.tw}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-6">الظلال</h3>
        <div className="grid sm:grid-cols-2 gap-8">
          {shadows.map((s) => (
            <div key={s.name} className="flex flex-col gap-3">
              <div
                className="h-24 bg-white rounded-xl flex items-center justify-center"
                style={{ boxShadow: s.style }}
              >
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground font-mono">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border p-6">
        <h3 className="mb-6">الحدود (Borders)</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-3">حد خفيف — border</p>
            <div className="h-16 rounded-xl border border-border bg-background flex items-center justify-center text-sm text-muted-foreground">
              rgba(0,0,0,0.08)
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">حد قوي — border-strong</p>
            <div
              className="h-16 rounded-xl bg-background flex items-center justify-center text-sm text-muted-foreground"
              style={{ border: "1px solid rgba(0,0,0,0.14)" }}
            >
              rgba(0,0,0,0.14)
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">حد منقط — dashed</p>
            <div className="h-16 rounded-xl border-2 border-dashed border-border bg-background flex items-center justify-center text-sm text-muted-foreground">
              منقط
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
