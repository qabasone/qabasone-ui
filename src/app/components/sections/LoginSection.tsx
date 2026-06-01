import { useState } from "react";
import { Fingerprint, Smartphone, UserRound, Mail } from "lucide-react";
import { LoginAuth } from "@/ui/components/LoginAuth";
import { Button } from "@/ui/components/Button";
import { Text } from "@/ui/components/Typography";

export function LoginSection() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [allowBiometric, setAllowBiometric] = useState(true);
  const [lastEvent, setLastEvent] = useState("لا يوجد حدث بعد");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-foreground mb-1">صفحة تسجيل الدخول</h1>
        <p className="text-muted-foreground">
          تسجيل دخول متعدد الطرق: اسم المستخدم، البريد الإلكتروني، رقم هاتف مصري، البصمة، والتحقق بخطوتين.
        </p>
      </div>

      <section className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <Text as="h3" variant="title-lg">
          إعدادات التجربة
        </Text>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={twoFactorEnabled ? "primary" : "secondary"}
            onClick={() => setTwoFactorEnabled((v) => !v)}
          >
            {twoFactorEnabled ? "2FA مفعل" : "2FA غير مفعل"}
          </Button>
          <Button
            size="sm"
            variant={allowBiometric ? "primary" : "secondary"}
            onClick={() => setAllowBiometric((v) => !v)}
          >
            {allowBiometric ? "البصمة مفعلة" : "البصمة غير مفعلة"}
          </Button>
        </div>
        <Text as="p" variant="body-sm" tone="muted">
          آخر حدث: <span className="text-foreground">{lastEvent}</span>
        </Text>
      </section>

      <section className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="bg-card rounded-2xl border border-border p-6">
          <LoginAuth
            dir="rtl"
            twoFactorEnabled={twoFactorEnabled}
            allowBiometric={allowBiometric}
            branding={{
              appName: "قبس",
              panelTitle: "تسجيل الدخول إلى النظام",
              panelSubtitle: "استخدم الطريقة المناسبة لحسابك ثم أكمل التحقق الأمني",
            }}
            onCredentialsSubmit={(payload) => {
              const methodMap = {
                username: "اسم المستخدم",
                email: "البريد الإلكتروني",
                egypt_mobile: "الهاتف المصري",
              };
              setLastEvent(`تم إرسال بيانات الدخول عبر ${methodMap[payload.method]}`);
              return { requiresTwoFactor: twoFactorEnabled };
            }}
            onBiometricLogin={() => setLastEvent("تم طلب تسجيل الدخول عبر البصمة")}
            onTwoFactorSubmit={(payload) => {
              setLastEvent(
                payload.method === "otp"
                  ? "تم التحقق عبر رمز المصادقة"
                  : "تم التحقق عبر رمز الاسترداد"
              );
            }}
          />
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
          <Text as="h3" variant="title-lg">
            طرق الدخول المدعومة
          </Text>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
              <UserRound size={18} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <Text as="p" variant="body" className="font-semibold">
                  اسم المستخدم + كلمة المرور
                </Text>
                <Text as="p" variant="body-sm" tone="muted">
                  مناسب للمستخدمين الداخليين وفرق التشغيل.
                </Text>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
              <Mail size={18} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <Text as="p" variant="body" className="font-semibold">
                  البريد الإلكتروني + كلمة المرور
                </Text>
                <Text as="p" variant="body-sm" tone="muted">
                  مناسب للمستخدمين الإداريين والحسابات الرسمية.
                </Text>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
              <Smartphone size={18} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <Text as="p" variant="body" className="font-semibold">
                  رقم الهاتف المصري + كلمة المرور
                </Text>
                <Text as="p" variant="body-sm" tone="muted">
                  يدعم أرقام مصر بصيغة 11 رقم تبدأ بـ 010/011/012/015.
                </Text>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
              <Fingerprint size={18} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <Text as="p" variant="body" className="font-semibold">
                  تسجيل الدخول بالبصمة
                </Text>
                <Text as="p" variant="body-sm" tone="muted">
                  متاح للأجهزة المدعومة كخيار دخول سريع وآمن.
                </Text>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <Text as="p" variant="body-sm" tone="muted">
              عند تفعيل التحقق بخطوتين (2FA)، سيطلب النظام رمز مصادقة مكوّن من 6 أرقام أو رمز استرداد.
            </Text>
          </div>
        </div>
      </section>
    </div>
  );
}
