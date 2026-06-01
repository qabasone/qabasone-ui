import { useState } from "react";
import {
  ArrowLeft,
  Headset,
  Home,
  RefreshCw,
  SearchX,
  ServerCrash,
  ShieldAlert,
  WifiOff,
} from "lucide-react";
import { ErrorPage } from "@/ui/components/ErrorPage";

export function ErrorPagesSection() {
  const [lastAction, setLastAction] = useState("لا يوجد إجراء بعد");

  const onAction = (label: string) => () => setLastAction(label);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-foreground mb-1">صفحات الأخطاء</h1>
        <p className="text-muted-foreground">
          حالات الخطأ بالعربية، متوافقة مع نظام التصميم، مع روابط رجوع مهنية وهادئة.
        </p>
      </div>

      <section className="bg-card rounded-2xl border border-border p-6">
        <p className="text-sm text-muted-foreground mb-5">
          آخر إجراء تجريبي: <span className="text-foreground">{lastAction}</span>
        </p>

        <ErrorPage
          code="404"
          icon={SearchX}
          title="الصفحة غير موجودة"
          description="عذرًا، لم نتمكن من العثور على الصفحة المطلوبة. ربما تم نقلها أو حذفها."
          hint="يمكنك العودة إلى لوحة التحكم أو الرجوع للصفحة السابقة ومتابعة عملك."
          primaryAction={{
            label: "العودة إلى لوحة التحكم",
            icon: Home,
            onClick: onAction("العودة إلى لوحة التحكم"),
          }}
          secondaryAction={{
            label: "الرجوع للصفحة السابقة",
            variant: "secondary",
            icon: ArrowLeft,
            onClick: onAction("الرجوع للصفحة السابقة"),
          }}
        />
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <ErrorPage
          compact
          code="500"
          icon={ServerCrash}
          title="حدث خطأ غير متوقع"
          description="حدث عطل داخلي أثناء معالجة الطلب. نعتذر عن الإزعاج ونعمل على إصلاحه."
          hint="يمكنك إعادة المحاولة الآن، وإذا تكرر الخطأ تواصل مع الدعم الفني."
          primaryAction={{
            label: "إعادة المحاولة",
            variant: "primary",
            icon: RefreshCw,
            onClick: onAction("إعادة المحاولة"),
          }}
          secondaryAction={{
            label: "التواصل مع الدعم",
            variant: "ghost",
            icon: Headset,
            onClick: onAction("التواصل مع الدعم"),
          }}
        />

        <ErrorPage
          compact
          code="503"
          icon={ShieldAlert}
          title="الخدمة غير متاحة مؤقتًا"
          description="نقوم حاليًا بعمليات صيانة مجدولة لتحسين الأداء والاستقرار."
          hint="يرجى المحاولة بعد دقائق. بياناتك محفوظة ولن تتأثر."
          primaryAction={{
            label: "تحديث الصفحة",
            variant: "primary",
            icon: RefreshCw,
            onClick: onAction("تحديث الصفحة"),
          }}
          secondaryAction={{
            label: "العودة للرئيسية",
            variant: "secondary",
            icon: Home,
            onClick: onAction("العودة للرئيسية"),
          }}
        />

        <ErrorPage
          compact
          code="NETWORK"
          icon={WifiOff}
          title="انقطع الاتصال بالخادم"
          description="لا يمكن الوصول إلى الخدمة الآن بسبب مشكلة اتصال بالشبكة."
          hint="تحقق من اتصال الإنترنت، ثم أعد المحاولة."
          primaryAction={{
            label: "إعادة الاتصال",
            variant: "primary",
            icon: RefreshCw,
            onClick: onAction("إعادة الاتصال"),
          }}
          secondaryAction={{
            label: "فتح لوحة التحكم",
            variant: "ghost",
            icon: Home,
            onClick: onAction("فتح لوحة التحكم"),
          }}
        />

        <ErrorPage
          compact
          code="SESSION"
          icon={ShieldAlert}
          title="انتهت الجلسة"
          description="لأسباب أمنية، انتهت صلاحية الجلسة الحالية ويجب تسجيل الدخول مرة أخرى."
          hint="هذا إجراء أمني لحماية بيانات الحساب."
          primaryAction={{
            label: "تسجيل الدخول مجددًا",
            variant: "primary",
            icon: ArrowLeft,
            onClick: onAction("تسجيل الدخول مجددًا"),
          }}
          secondaryAction={{
            label: "العودة للرئيسية",
            variant: "secondary",
            icon: Home,
            onClick: onAction("العودة للرئيسية"),
          }}
        />
      </section>
    </div>
  );
}
