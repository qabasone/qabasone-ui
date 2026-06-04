import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Typography";

export type LoginMethod = "username" | "email" | "egypt_mobile";

interface CredentialsPayload {
  method: LoginMethod;
  identifier: string;
  password: string;
}

interface TwoFactorPayload {
  method: "otp" | "backup_code";
  value: string;
}

interface SubmitResult {
  requiresTwoFactor?: boolean;
}

interface LoginAuthBranding {
  appName: string;
  panelTitle: string;
  panelSubtitle: string;
  // accept a React node (element, string, fragment) or a component type
  appIcon?: React.ReactNode | React.ElementType | null;
}

export interface LoginAuthProps {
  dir?: "rtl" | "ltr" | "auto";
  allowBiometric?: boolean;
  twoFactorEnabled?: boolean;
  initialMethod?: LoginMethod;
  branding?: LoginAuthBranding;
  onCredentialsSubmit?: (
    payload: CredentialsPayload
  ) => Promise<SubmitResult | void> | SubmitResult | void;
  onTwoFactorSubmit?: (
    payload: TwoFactorPayload
  ) => Promise<void> | void;
  onBiometricLogin?: () => Promise<void> | void;
}

const METHOD_META: Record<
  LoginMethod,
  { label: string; placeholder: string; icon: React.ElementType; type: "text" | "email" | "tel" }
> = {
  username: {
    label: "اسم المستخدم",
    placeholder: "أدخل اسم المستخدم",
    icon: UserRound,
    type: "text",
  },
  email: {
    label: "البريد الإلكتروني",
    placeholder: "ادخل الايميل",
    icon: Mail,
    type: "email",
  },
  egypt_mobile: {
    label: "رقم الهاتف ",
    placeholder: "01015888272",
    icon: Smartphone,
    type: "tel",
  },
};

function isValidEgyptianMobile(value: string) {
  return /^01[0125][0-9]{8}$/.test(value.trim());
}

export function LoginAuth({
  dir = "rtl",
  allowBiometric = true,
  twoFactorEnabled = true,
  initialMethod = "username",
  branding = {
    appName: "قبس",
    panelTitle: "تسجيل الدخول",
    panelSubtitle: "اختر طريقة الدخول المناسبة لحسابك",
    appIcon: null,
  },
  onCredentialsSubmit,
  onTwoFactorSubmit,
  onBiometricLogin,
}: LoginAuthProps) {
  const [method, setMethod] = useState<LoginMethod>(initialMethod);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"credentials" | "two_factor" | "done">("credentials");
  const [otpMode, setOtpMode] = useState<"otp" | "backup_code">("otp");
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = METHOD_META[method];

  const identifierError = useMemo(() => {
    if (!identifier.trim()) return "هذا الحقل مطلوب";
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
      return "صيغة البريد الإلكتروني غير صحيحة";
    }
    if (method === "username" && identifier.trim().length < 3) {
      return "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
    }
    if (method === "egypt_mobile" && !isValidEgyptianMobile(identifier)) {
      return "رقم الهاتف المصري غير صحيح";
    }
    return null;
  }, [identifier, method]);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (identifierError) {
      setError(identifierError);
      return;
    }
    if (!password.trim()) {
      setError("يرجى إدخال كلمة المرور");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await onCredentialsSubmit?.({ method, identifier, password });
      const requiresTwoFactor =
        (result && "requiresTwoFactor" in result ? result.requiresTwoFactor : undefined) ??
        twoFactorEnabled;
      if (requiresTwoFactor) setStep("two_factor");
      else setStep("done");
    } finally {
      setLoading(false);
    }
  }

  async function handleTwoFactorSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = otpValue.trim();
    const isOtpInvalid = otpMode === "otp" && !/^[0-9]{6}$/.test(normalized);
    if (!normalized || isOtpInvalid) {
      setError(
        otpMode === "otp"
          ? "أدخل رمز تحقق صحيح مكوّن من 6 أرقام"
          : "أدخل رمز الاسترداد"
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onTwoFactorSubmit?.({
        method: otpMode,
        value: normalized,
      });
      setStep("done");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir={dir} className="qbs-surface w-full max-w-md p-6 space-y-5">
      {branding.appIcon ? (
        <div className="mx-auto w-24 h-24 rounded-full bg-muted/10 flex items-center justify-center">
          {React.isValidElement(branding.appIcon) ? (
            branding.appIcon
          ) : typeof branding.appIcon === "function" ? (
            React.createElement(branding.appIcon as React.ElementType)
          ) : (
            branding.appIcon
          )}
        </div>
      ) : null}
      <div className="space-y-1">
        <Text as="p" variant="caption" tone="muted">
          نظام {branding.appName}
        </Text>
        <Text as="h2" variant="title-xl">
          {branding.panelTitle}
        </Text>
        <Text as="p" variant="body-sm" tone="muted">
          {branding.panelSubtitle}
        </Text>
      </div>

      {step === "credentials" && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {(["username", "email", "egypt_mobile"] as const).map((item) => {
              const active = method === item;
              return (
                <Button
                  key={item}
                  size="sm"
                  variant={active ? "primary" : "secondary"}
                  onClick={() => setMethod(item)}
                >
                  {METHOD_META[item].label}
                </Button>
              );
            })}
          </div>

          <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
            <div className="space-y-1.5">
              <Text as="label" variant="body-sm">
                {meta.label}
              </Text>
              <div className="relative">
                <input
                  dir="rtl"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  type={meta.type}
                  className="qbs-field qbs-focus w-full h-11 pe-10 ps-3 text-sm"
                  placeholder={meta.placeholder}
                />
                <meta.icon
                  size={16}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Text as="label" variant="body-sm">
                كلمة المرور
              </Text>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="qbs-field qbs-focus w-full h-11 pe-10 ps-10 text-sm"
                  placeholder="أدخل كلمة المرور"
                />
                <Lock
                  size={16}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="qbs-focus absolute start-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <Text as="p" variant="body-sm" tone="error">
                  {error}
                </Text>
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <Button type="submit" action="save" loading={loading} className="flex-1">
                دخول
              </Button>
              {allowBiometric ? (
                <Button
                  type="button"
                  variant="secondary"
                  iconOnly
                  aria-label="تسجيل الدخول بالبصمة"
                  startIcon={<Fingerprint size={18} />}
                  onClick={onBiometricLogin}
                />
              ) : null}
            </div>
          </form>
        </>
      )}

      {step === "two_factor" && (
        <form className="space-y-4" onSubmit={handleTwoFactorSubmit}>
          <div className="flex items-start gap-2 rounded-xl bg-info/10 border border-info/20 p-3">
            <ShieldCheck size={16} className="text-info shrink-0 mt-0.5" />
            <Text as="p" variant="body-sm" tone="muted">
              تم تفعيل التحقق بخطوتين على حسابك. أدخل رمز التطبيق أو استخدم رمز استرداد.
            </Text>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              size="sm"
              variant={otpMode === "otp" ? "primary" : "secondary"}
              onClick={() => {
                setOtpMode("otp");
                setOtpValue("");
                setError(null);
              }}
            >
              رمز التحقق
            </Button>
            <Button
              type="button"
              size="sm"
              variant={otpMode === "backup_code" ? "primary" : "secondary"}
              onClick={() => {
                setOtpMode("backup_code");
                setOtpValue("");
                setError(null);
              }}
            >
              رمز الاسترداد
            </Button>
          </div>

          <div className="space-y-1.5">
            <Text as="label" variant="body-sm">
              {otpMode === "otp" ? "رمز التحقق (6 أرقام)" : "رمز الاسترداد"}
            </Text>
            <div className="relative">
              <input
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="qbs-field qbs-focus w-full h-11 pe-10 ps-3 text-sm amount"
                inputMode={otpMode === "otp" ? "numeric" : "text"}
                placeholder={otpMode === "otp" ? "000000" : "أدخل رمز الاسترداد"}
              />
              <KeyRound
                size={16}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          {error ? (
            <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <Text as="p" variant="body-sm" tone="error">
                {error}
              </Text>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" loading={loading} action="approve" className="flex-1">
              تأكيد الدخول
            </Button>
            <Button type="button" variant="ghost" startIcon={<RefreshCw size={15} />}>
              إعادة إرسال الرمز
            </Button>
            <Button
              type="button"
              variant="secondary"
              startIcon={<ArrowLeft size={15} />}
              onClick={() => {
                setStep("credentials");
                setOtpValue("");
                setError(null);
              }}
            >
              رجوع
            </Button>
          </div>
        </form>
      )}

      {step === "done" && (
        <div className="space-y-4 text-center py-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-success/15 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-success" />
          </div>
          <div className="space-y-1">
            <Text as="h3" variant="title-lg">
              تم تسجيل الدخول بنجاح
            </Text>
            <Text as="p" variant="body-sm" tone="muted">
              أهلاً بك، سيتم تحويلك إلى لوحة التحكم خلال لحظات.
            </Text>
          </div>
          <Button action="back" variant="secondary" onClick={() => setStep("credentials")}>
            تسجيل دخول بحساب آخر
          </Button>
        </div>
      )}
    </div>
  );
}
