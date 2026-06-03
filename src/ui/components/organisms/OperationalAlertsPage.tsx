import type { ElementType, ReactNode } from "react";
import {
  ArrowLeft,
  Banknote,
  BookOpen,
  CalendarClock,
  CircleAlert,
  ClipboardList,
  Clock3,
  FileWarning,
  PackageX,
  Repeat2,
  Scale,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "../atoms/Button";
import { StatusBadge } from "../atoms/StatusBadge";
import { Text } from "../atoms/Typography";

export type OperationalAlertSeverity = "critical" | "warning" | "info";

export type OperationalAlertType =
  | "closed-financial-period"
  | "unposted-journal-entry"
  | "sale-failed-low-stock"
  | "product-without-unit-conversion"
  | "negative-cashbox-balance"
  | "old-open-custody"
  | "driver-journal-shortage"
  | "driver-journal-surplus"
  | "zero-stock-product";

export interface OperationalAlert {
  id: string;
  type: OperationalAlertType | string;
  title: string;
  description: string;
  severity: OperationalAlertSeverity;
  sourceLabel: string;
  ownerLabel?: string;
  ageLabel?: string;
  amountLabel?: string;
  actionLabel?: string;
  icon?: ElementType;
}

export interface OperationalAlertsPageProps {
  title?: string;
  subtitle?: string;
  alerts: OperationalAlert[];
  selectedAlertId?: string;
  updatedAtLabel?: string;
  onOpenAlert?: (alert: OperationalAlert) => void;
  children?: ReactNode;
}

const TYPE_ICONS: Record<string, ElementType> = {
  "closed-financial-period": CalendarClock,
  "unposted-journal-entry": BookOpen,
  "sale-failed-low-stock": PackageX,
  "product-without-unit-conversion": Repeat2,
  "negative-cashbox-balance": Wallet,
  "old-open-custody": Clock3,
  "driver-journal-shortage": TrendingDown,
  "driver-journal-surplus": TrendingUp,
  "zero-stock-product": PackageX,
};

const SEVERITY_META: Record<
  OperationalAlertSeverity,
  {
    label: string;
    badgeVariant: "critical" | "warning" | "info";
    icon: ElementType;
    className: string;
  }
> = {
  critical: {
    label: "عاجل",
    badgeVariant: "critical",
    icon: CircleAlert,
    className: "text-destructive",
  },
  warning: {
    label: "يحتاج انتباه",
    badgeVariant: "warning",
    icon: FileWarning,
    className: "text-warning",
  },
  info: {
    label: "معلومة",
    badgeVariant: "info",
    icon: ClipboardList,
    className: "text-info",
  },
};

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function countBySeverity(alerts: OperationalAlert[], severity: OperationalAlertSeverity) {
  return alerts.filter((alert) => alert.severity === severity).length;
}

export function OperationalAlertsPage({
  title = "مركز التنبيهات التشغيلية",
  subtitle = "شاشة واحدة تجمع المشاكل التي تحتاج تدخل المحاسب أو مدير النظام قبل أن تتراكم داخل اليوميات والفواتير والمخزون.",
  alerts,
  selectedAlertId,
  updatedAtLabel,
  onOpenAlert,
  children,
}: OperationalAlertsPageProps) {
  const selectedAlert = alerts.find((alert) => alert.id === selectedAlertId) ?? alerts[0];
  const criticalCount = countBySeverity(alerts, "critical");
  const warningCount = countBySeverity(alerts, "warning");
  const infoCount = countBySeverity(alerts, "info");

  return (
    <section dir="rtl" className="space-y-5">
      <div className="qbs-surface overflow-hidden">
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_320px] lg:p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                label={criticalCount > 0 ? `${criticalCount} تنبيهات عاجلة` : "لا توجد تنبيهات عاجلة"}
                variant={criticalCount > 0 ? "critical" : "success"}
              />
              {updatedAtLabel ? (
                <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {updatedAtLabel}
                </span>
              ) : null}
            </div>

            <div className="space-y-2">
              <Text as="h1" variant="display-2xl">
                {title}
              </Text>
              <Text as="p" variant="body-sm" tone="muted" className="max-w-3xl leading-7">
                {subtitle}
              </Text>
            </div>

            {selectedAlert ? (
              <Button
                action="view"
                endIcon={<ArrowLeft size={15} />}
                onClick={() => onOpenAlert?.(selectedAlert)}
              >
                فتح: {selectedAlert.title}
              </Button>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            {[
              { label: "عاجل", value: criticalCount, className: "text-destructive", icon: CircleAlert },
              { label: "انتباه", value: warningCount, className: "text-warning", icon: FileWarning },
              { label: "معلومات", value: infoCount, className: "text-info", icon: ClipboardList },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-border bg-secondary p-3">
                <div className="flex items-center justify-between gap-2">
                  <Text as="p" variant="caption" tone="muted">
                    {item.label}
                  </Text>
                  <item.icon size={15} className={item.className} />
                </div>
                <Text as="p" variant="title-lg" className="mt-1 amount">
                  {item.value}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="qbs-surface overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <Text as="h2" variant="title-lg">
              كل المشاكل المفتوحة
            </Text>
            <Text as="p" variant="body-sm" tone="muted" className="mt-1">
              اضغط على أي تنبيه لفتح الشاشة أو المستند المرتبط مباشرة.
            </Text>
          </div>

          <div className="divide-y divide-border">
            {alerts.map((alert) => {
              const severity = SEVERITY_META[alert.severity];
              const SeverityIcon = severity.icon;
              const AlertIcon = alert.icon ?? TYPE_ICONS[alert.type] ?? FileWarning;
              const selected = alert.id === selectedAlert?.id;

              return (
                <button
                  key={alert.id}
                  type="button"
                  className={cx(
                    "qbs-focus grid w-full gap-3 px-5 py-4 text-right transition-colors sm:grid-cols-[1fr_auto] sm:items-center",
                    selected ? "bg-primary/5" : "hover:bg-muted"
                  )}
                  onClick={() => onOpenAlert?.(alert)}
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <span className="qbs-icon-well h-10 w-10 shrink-0 bg-primary/10 text-primary">
                      <AlertIcon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{alert.title}</span>
                        <span className={cx("inline-flex items-center gap-1 text-xs font-medium", severity.className)}>
                          <SeverityIcon size={13} />
                          {severity.label}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                        {alert.description}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{alert.sourceLabel}</span>
                        {alert.ownerLabel ? <span>· {alert.ownerLabel}</span> : null}
                        {alert.ageLabel ? <span>· {alert.ageLabel}</span> : null}
                        {alert.amountLabel ? <span className="amount">· {alert.amountLabel}</span> : null}
                      </span>
                    </span>
                  </span>

                  <span className="flex items-center justify-end gap-2">
                    <StatusBadge label={severity.label} variant={severity.badgeVariant} size="sm" />
                    <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground">
                      {alert.actionLabel ?? "فتح التفاصيل"}
                      <ArrowLeft size={13} />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="qbs-surface p-4">
            <Text as="h3" variant="title-lg">
              التفاصيل السريعة
            </Text>
            {selectedAlert ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-border bg-secondary p-4">
                  <div className="flex items-start gap-3">
                    {(() => {
                      const AlertIcon = selectedAlert.icon ?? TYPE_ICONS[selectedAlert.type] ?? FileWarning;
                      return (
                        <div className="qbs-icon-well h-10 w-10 bg-primary/10 text-primary">
                          <AlertIcon size={18} />
                        </div>
                      );
                    })()}
                    <div className="min-w-0">
                      <Text as="p" variant="body-sm" className="font-semibold">
                        {selectedAlert.title}
                      </Text>
                      <Text as="p" variant="body-sm" tone="muted" className="mt-1 leading-6">
                        {selectedAlert.description}
                      </Text>
                    </div>
                  </div>
                </div>

                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">المصدر</dt>
                    <dd className="font-semibold text-foreground">{selectedAlert.sourceLabel}</dd>
                  </div>
                  {selectedAlert.ownerLabel ? (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">المسؤول</dt>
                      <dd className="font-semibold text-foreground">{selectedAlert.ownerLabel}</dd>
                    </div>
                  ) : null}
                  {selectedAlert.amountLabel ? (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">القيمة</dt>
                      <dd className="font-semibold text-foreground amount">{selectedAlert.amountLabel}</dd>
                    </div>
                  ) : null}
                </dl>

                <Button
                  fullWidth
                  action="view"
                  endIcon={<ArrowLeft size={15} />}
                  onClick={() => onOpenAlert?.(selectedAlert)}
                >
                  {selectedAlert.actionLabel ?? "فتح التفاصيل"}
                </Button>
              </div>
            ) : null}
          </div>

          <div className="qbs-surface p-4">
            <div className="flex items-start gap-3">
              <div className="qbs-icon-well h-10 w-10 bg-warning/10 text-warning">
                <Scale size={18} />
              </div>
              <div>
                <Text as="h3" variant="title-lg">
                  قاعدة التعامل
                </Text>
                <Text as="p" variant="body-sm" tone="muted" className="mt-2 leading-6">
                  التنبيه لا يشرح المشكلة فقط؛ لازم يفتح مصدرها مباشرة: اليومية، القيد،
                  الفاتورة، المنتج، الخزنة، أو العهدة.
                </Text>
              </div>
            </div>
          </div>

          {children}
        </aside>
      </div>
    </section>
  );
}
