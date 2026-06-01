import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, Fingerprint, ShieldCheck } from "lucide-react";

// ── Brand panel logo ──────────────────────────────────────────────────────────

function QabsLogo({ size = 72 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-[22%]"
      style={{ width: size, height: size, backgroundColor: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 44 44" fill="none">
        {/* Blue arc — body of Q */}
        <path
          d="M32 8C22.059 8 14 16.059 14 26C14 35.941 22.059 44 32 44"
          stroke="#1e40af"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M14 26C14 16.059 22.059 8 32 8C36.5 8 40.6 9.8 43.6 12.7"
          stroke="#2563eb"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Red tail — diagonal slash */}
        <path
          d="M34 33L43 43"
          stroke="#dc2626"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ── Login screen (full height, self-contained) ────────────────────────────────

function LoginScreen() {
  const [email, setEmail]       = useState("mahros");
  const [password, setPassword] = useState("12345678");
  const [showPwd, setShowPwd]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [done, setDone]         = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1600);
  };

  // Input base style
  const inputWrap = "relative flex items-center";
  const inputCls  = `w-full h-11 pe-10 ps-4 rounded-xl text-sm focus:outline-none transition-all`;
  const inputStyle: React.CSSProperties = {
    backgroundColor: "#f0f3f8",
    border: "1.5px solid transparent",
    color: "var(--foreground)",
    fontFamily: "var(--font-family)",
  };
  const inputFocusStyle = `focus:border-[var(--ring)] focus:ring-2 focus:ring-ring/30`;

  return (
    <div
      dir="rtl"
      lang="ar"
      className="flex h-full"
      style={{ fontFamily: "var(--font-family)", backgroundColor: "#f4f5f7" }}
    >
      {/* ── Brand panel — RIGHT in RTL (first child) ─────────────────── */}
      <div
        className="hidden md:flex flex-col items-center justify-between py-12 px-10 shrink-0"
        style={{
          width: "42%",
          background: "linear-gradient(160deg, #1e3a8a 0%, #1a3166 60%, #152a58 100%)",
          backgroundImage: `
            linear-gradient(160deg, #1e3a8a 0%, #152a58 100%),
            radial-gradient(circle, rgba(255,255,255,0.13) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "100% 100%, 26px 26px",
          backgroundBlendMode: "normal",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.11) 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Top spacer */}
        <div />

        {/* Center: logo + name + tagline */}
        <div className="relative flex flex-col items-center gap-5 text-center">
          <QabsLogo size={88} />

          <div>
            <h1
              className="text-white mb-2"
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                textShadow: "0 2px 12px rgba(0,0,0,0.2)",
              }}
            >
              قَبَسْ
            </h1>
            <p
              className="text-center leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: "14px",
                fontWeight: 400,
                maxWidth: "220px",
              }}
            >
              نظام قَبَسْ لإدارة العمليات التجارية واللوجستية
            </p>
          </div>
        </div>

        {/* Bottom: secure badge */}
        <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <ShieldCheck size={15} style={{ color: "rgba(255,255,255,0.8)" }} />
          <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", fontWeight: 500 }}>اتصال آمن ومُشفَّر</span>
        </div>
      </div>

      {/* ── Form panel — LEFT in RTL (second child) ──────────────────── */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: "#fff" }}>

        {/* Scrollable form area — centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 overflow-y-auto">
          <div className="w-full" style={{ maxWidth: "380px" }}>

            {/* Greeting */}
            <div className="mb-8">
              <h1 className="text-foreground mb-2" style={{ fontSize: "1.85rem" }}>أهلاً بك</h1>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                سجل دخولك لمتابعة عملك في لوحة التحكم
              </p>
            </div>

            {/* Success state */}
            {done ? (
              <div
                className="flex flex-col items-center gap-4 py-10 rounded-2xl"
                style={{ backgroundColor: "var(--success-muted)", border: "1.5px solid color-mix(in srgb, var(--success) 25%, transparent)" }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--success)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-base" style={{ fontWeight: 700, color: "var(--success)" }}>تم تسجيل الدخول بنجاح</p>
                  <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>جارٍ تحميل لوحة التحكم...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* Global error */}
                {error && (
                  <div
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm"
                    style={{ backgroundColor: "var(--destructive-muted)", border: "1px solid color-mix(in srgb, var(--destructive) 20%, transparent)", color: "var(--destructive)" }}
                  >
                    <span style={{ fontWeight: 500 }}>{error}</span>
                  </div>
                )}

                {/* Email field */}
                <div className="space-y-1.5">
                  <label className="block text-sm" style={{ fontWeight: 600, color: "var(--foreground)" }}>
                    البريد الإلكتروني أو اسم المستخدم
                  </label>
                  <div className={inputWrap}>
                    <input
                      type="text"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="أدخل البريد أو اسم المستخدم"
                      autoComplete="username"
                      className={`${inputCls} ${inputFocusStyle}`}
                      style={inputStyle}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "var(--ring)"; }}
                      onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = "transparent"; }}
                    />
                    <Mail
                      size={16}
                      className="absolute end-3.5 pointer-events-none"
                      style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="block text-sm" style={{ fontWeight: 600, color: "var(--foreground)" }}>
                    كلمة المرور
                  </label>
                  <div className={inputWrap}>
                    <input
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور"
                      autoComplete="current-password"
                      className={`${inputCls} pe-10 ps-10 ${inputFocusStyle}`}
                      style={inputStyle}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "var(--ring)"; }}
                      onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = "transparent"; }}
                    />
                    {/* Lock icon — end (right in RTL = field start) */}
                    <Lock
                      size={15}
                      className="absolute end-3.5 pointer-events-none"
                      style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
                    />
                    {/* Show/hide — start (left in RTL) */}
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      className="absolute start-3.5 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPwd
                        ? <Eye size={15} />
                        : <EyeOff size={15} />
                      }
                    </button>
                  </div>
                </div>

                {/* Remember me + forgot password */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-sm transition-colors hover:underline"
                    style={{ color: "var(--primary)", fontWeight: 500 }}
                  >
                    نسيت كلمة المرور؟
                  </button>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-sm" style={{ color: "var(--foreground)", fontWeight: 500 }}>تذكرني</span>
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                      style={{
                        border: `1.5px solid ${remember ? "var(--primary)" : "var(--border-strong)"}`,
                        backgroundColor: remember ? "var(--primary)" : "transparent",
                        cursor: "pointer",
                      }}
                      onClick={() => setRemember(v => !v)}
                    >
                      {remember && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </label>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2.5 text-sm transition-all disabled:opacity-70 active:scale-[0.98]"
                    style={{
                      backgroundColor: "#1B3166",
                      color: "#fff",
                      fontWeight: 700,
                      letterSpacing: "0.01em",
                      boxShadow: "0 4px 16px rgba(27,49,102,0.35)",
                    }}
                    onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = "#162958"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#1B3166"; }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0"
                          style={{ borderTopColor: "white" }}
                        />
                        جارٍ الدخول...
                      </>
                    ) : (
                      <>
                        <LogIn size={16} />
                        دخول
                      </>
                    )}
                  </button>

                  {/* Biometric button */}
                  <button
                    type="button"
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-95"
                    style={{
                      border: "1.5px solid var(--border-strong)",
                      backgroundColor: "#f0f3f8",
                      color: "var(--muted-foreground)",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#e5e9f2"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f3f8"; }}
                    title="تسجيل الدخول بالبصمة"
                  >
                    <Fingerprint size={19} />
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-8 py-4 border-t"
          style={{ borderColor: "var(--border)", backgroundColor: "#fafbfd" }}
        >
          <button
            type="button"
            className="text-sm transition-colors hover:underline"
            style={{ color: "var(--primary)", fontWeight: 500 }}
          >
            ليس لديك حساب؟
          </button>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            © قبس وان، جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Section export ────────────────────────────────────────────────────────────

export function LoginSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-1">شاشة تسجيل الدخول</h1>
        <p className="text-muted-foreground">صفحة دخول كاملة — تخطيط لوحي مزدوج، تحقق، حالة تحميل، بصمة</p>
      </div>

      {/* Full-page preview */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ height: "600px", boxShadow: "var(--shadow-modal)", border: "1px solid var(--border)" }}
      >
        <LoginScreen />
      </div>

      {/* Mobile preview */}
      <div>
        <h3 className="mb-4">معاينة الجوال</h3>
        <div className="flex justify-center">
          <div
            className="rounded-[2rem] overflow-hidden"
            style={{
              width: "375px",
              height: "700px",
              boxShadow: "var(--shadow-modal)",
              border: "8px solid var(--foreground)",
            }}
          >
            {/* Mobile: single column, form only */}
            <div
              dir="rtl"
              lang="ar"
              className="flex flex-col h-full"
              style={{ fontFamily: "var(--font-family)", backgroundColor: "#fff" }}
            >
              {/* Mobile top brand strip */}
              <div
                className="flex flex-col items-center justify-center py-10 shrink-0"
                style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #152a58 100%)", position: "relative", overflow: "hidden" }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1.5px, transparent 1.5px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                <div className="relative flex items-center gap-3">
                  <QabsLogo size={44} />
                  <span className="text-white text-xl" style={{ fontWeight: 800 }}>قَبَسْ</span>
                </div>
              </div>

              {/* Mobile form */}
              <div className="flex-1 overflow-y-auto px-6 py-7 space-y-5">
                <div className="mb-6">
                  <h2 className="text-foreground mb-1">أهلاً بك</h2>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>سجل دخولك لمتابعة عملك في لوحة التحكم</p>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-sm" style={{ fontWeight: 600 }}>البريد الإلكتروني أو اسم المستخدم</label>
                  <div className="relative flex items-center">
                    <input defaultValue="mahros" className="w-full h-11 pe-10 ps-4 rounded-xl text-sm focus:outline-none" style={{ backgroundColor: "#f0f3f8", border: "1.5px solid transparent", color: "var(--foreground)", fontFamily: "var(--font-family)" }} />
                    <Mail size={15} className="absolute end-3.5 pointer-events-none" style={{ color: "var(--muted-foreground)", opacity: 0.6 }} />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-sm" style={{ fontWeight: 600 }}>كلمة المرور</label>
                  <div className="relative flex items-center">
                    <input type="password" defaultValue="12345678" className="w-full h-11 pe-10 ps-4 rounded-xl text-sm focus:outline-none" style={{ backgroundColor: "#f0f3f8", border: "1.5px solid transparent", color: "var(--foreground)", fontFamily: "var(--font-family)" }} />
                    <Lock size={15} className="absolute end-3.5 pointer-events-none" style={{ color: "var(--muted-foreground)", opacity: 0.6 }} />
                  </div>
                </div>

                {/* Remember + forgot */}
                <div className="flex items-center justify-between">
                  <button type="button" className="text-xs" style={{ color: "var(--primary)", fontWeight: 500 }}>نسيت كلمة المرور؟</button>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <span className="text-xs" style={{ fontWeight: 500 }}>تذكرني</span>
                    <div className="w-4 h-4 rounded" style={{ border: "1.5px solid var(--border-strong)" }} />
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button type="button" className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-sm" style={{ backgroundColor: "#1B3166", color: "#fff", fontWeight: 700 }}>
                    <LogIn size={15} />دخول
                  </button>
                  <button type="button" className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ border: "1.5px solid var(--border-strong)", backgroundColor: "#f0f3f8", color: "var(--muted-foreground)" }}>
                    <Fingerprint size={18} />
                  </button>
                </div>
              </div>

              {/* Mobile footer */}
              <div className="flex items-center justify-between px-6 py-3 border-t" style={{ borderColor: "var(--border)", backgroundColor: "#fafbfd" }}>
                <button type="button" className="text-xs" style={{ color: "var(--primary)", fontWeight: 500 }}>ليس لديك حساب؟</button>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={11} style={{ color: "var(--muted-foreground)" }} />
                  <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>اتصال آمن</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
