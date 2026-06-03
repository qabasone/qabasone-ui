import type { ElementType, ReactNode } from "react";
import {
  ArrowLeft,
  Banknote,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  CircleAlert,
  CircleDashed,
  Package,
  PlayCircle,
  Repeat2,
  Ruler,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
  Warehouse,
} from "lucide-react";
import { Button } from "../atoms/Button";
import { StatusBadge } from "../atoms/StatusBadge";
import { Text } from "../atoms/Typography";

export type SetupReadinessStatus = "ready" | "missing" | "needs-review";

export type SetupReadinessItemId =
  | "fiscal-year"
  | "financial-period"
  | "chart-of-accounts"
  | "main-cashbox"
  | "products"
  | "units"
  | "unit-conversions"
  | "warehouses"
  | "basic-users"
  | "opening-balances"
  | "driver-warehouse"
  | "keeper-warehouse";

export interface SetupReadinessItem {
  id: SetupReadinessItemId | string;
  title: string;
  description: string;
  status: SetupReadinessStatus;
  actionLabel?: string;
  meta?: string;
  icon?: ElementType;
}

export interface SetupReadinessPageProps {
  title?: string;
  subtitle?: string;
  items: SetupReadinessItem[];
  primaryActionLabel?: string;
  onOpenItem?: (item: SetupReadinessItem) => void;
  onStartOperation?: () => void;
  updatedAtLabel?: string;
  children?: ReactNode;
}

const DEFAULT_ICONS: Record<string, ElementType> = {
  "fiscal-year": CalendarRange,
  "financial-period": CalendarRange,
  "chart-of-accounts": BookOpen,
  "main-cashbox": Wallet,
  products: Package,
  units: Ruler,
  "unit-conversions": Repeat2,
  warehouses: Warehouse,
  "basic-users": Users,
  "opening-balances": Banknote,
  "driver-warehouse": Truck,
  "keeper-warehouse": ShieldCheck,
};

const STATUS_META: Record<
  SetupReadinessStatus,
  {
    label: string;
    variant: "success" | "warning" | "critical";
    icon: ElementType;
    toneClass: string;
  }
> = {
  ready: {
    label: "جاهز",
    variant: "success",
    icon: CheckCircle2,
    toneClass: "text-success",
  },
  missing: {
    label: "ناقص",
    variant: "critical",
    icon: CircleAlert,
    toneClass: "text-destructive",
  },
  "needs-review": {
    label: "يحتاج مراجعة",
    variant: "warning",
    icon: CircleDashed,
    toneClass: "text-warning",
  },
};

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function percent(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function SetupReadinessPage({
  title = "جاهزية النظام للتشغيل الحقيقي",
  subtitle = "قائمة تحقق تساعد مدير النظام يعرف هل الإعداد الأساسي مكتمل قبل بدء التشغيل اليومي.",
  items,
  primaryActionLabel = "بدء التشغيل الحقيقي",
  onOpenItem,
  onStartOperation,
  updatedAtLabel,
  children,
}: SetupReadinessPageProps) {
  const readyCount = items.filter((item) => item.status === "ready").length;
  const missingItems = items.filter((item) => item.status !== "ready");
  const completion = percent(readyCount, items.length);
  const isReady = missingItems.length === 0;
  const nextItem = missingItems[0];

  return (
    <section dir="rtl" className="space-y-5">
      <div className="qbs-surface overflow-hidden">
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_280px] lg:p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                label={isReady ? "جاهز للتشغيل" : "إعدادات ناقصة"}
                variant={isReady ? "success" : "warning"}
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

            <div className="flex flex-wrap items-center gap-2">
              <Button
                action="approve"
                startIcon={<PlayCircle size={16} />}
                disabled={!isReady}
                onClick={onStartOperation}
              >
                {primaryActionLabel}
              </Button>
              {nextItem ? (
                <Button
                  variant="outline"
                  endIcon={<ArrowLeft size={15} />}
                  onClick={() => onOpenItem?.(nextItem)}
                >
                  إكمال: {nextItem.title}
                </Button>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-secondary p-4">
            <div className="flex items-center justify-between gap-3">
              <Text as="p" variant="caption" tone="muted">
                نسبة الاكتمال
              </Text>
              <Text as="p" variant="title-lg" className="amount">
                {completion}%
              </Text>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cx("h-full rounded-full", isReady ? "bg-success" : "bg-primary")}
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-card p-3">
                <Text as="p" variant="caption" tone="muted">
                  مكتمل
                </Text>
                <Text as="p" variant="title-lg" className="amount">
                  {readyCount}
                </Text>
              </div>
              <div className="rounded-lg bg-card p-3">
                <Text as="p" variant="caption" tone="muted">
                  ناقص
                </Text>
                <Text as="p" variant="title-lg" tone={isReady ? "success" : "warning"} className="amount">
                  {missingItems.length}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="qbs-surface overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <Text as="h2" variant="title-lg">
              قائمة التحقق الأساسية
            </Text>
            <Text as="p" variant="body-sm" tone="muted" className="mt-1">
              كل عنصر ناقص يفتح شاشة الإكمال المناسبة من نفس الصف.
            </Text>
          </div>

          <div className="divide-y divide-border">
            {items.map((item) => {
              const status = STATUS_META[item.status];
              const StatusIcon = status.icon;
              const ItemIcon = item.icon ?? DEFAULT_ICONS[item.id] ?? CircleDashed;
              const needsAction = item.status !== "ready";

              return (
                <div key={item.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="qbs-icon-well h-10 w-10 shrink-0 bg-primary/10 text-primary">
                      <ItemIcon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Text as="h3" variant="body-sm" className="font-semibold">
                          {item.title}
                        </Text>
                        <span className={cx("inline-flex items-center gap-1 text-xs font-medium", status.toneClass)}>
                          <StatusIcon size={13} />
                          {status.label}
                        </span>
                      </div>
                      <Text as="p" variant="body-sm" tone="muted" className="mt-1 leading-6">
                        {item.description}
                      </Text>
                      {item.meta ? (
                        <Text as="p" variant="caption" tone="muted" className="mt-1">
                          {item.meta}
                        </Text>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <StatusBadge label={status.label} variant={status.variant} size="sm" />
                    {needsAction ? (
                      <Button
                        size="sm"
                        variant={item.status === "missing" ? "primary" : "outline"}
                        endIcon={<ArrowLeft size={14} />}
                        onClick={() => onOpenItem?.(item)}
                      >
                        {item.actionLabel ?? "إكمال"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="qbs-surface p-4">
            <Text as="h3" variant="title-lg">
              أولويات الإكمال
            </Text>
            <div className="mt-4 space-y-3">
              {missingItems.length ? (
                missingItems.slice(0, 4).map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className="qbs-focus flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-right transition-colors hover:bg-muted"
                    onClick={() => onOpenItem?.(item)}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary amount">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{item.actionLabel ?? "فتح شاشة الإكمال"}</span>
                    </span>
                    <ArrowLeft size={14} className="shrink-0 text-muted-foreground" />
                  </button>
                ))
              ) : (
                <div className="rounded-lg border border-success/20 bg-success/10 p-4 text-success">
                  <CheckCircle2 size={20} />
                  <Text as="p" variant="body-sm" className="mt-2 font-semibold">
                    كل الإعدادات الأساسية مكتملة.
                  </Text>
                </div>
              )}
            </div>
          </div>

          <div className="qbs-surface p-4">
            <Text as="h3" variant="title-lg">
              قرار التشغيل
            </Text>
            <Text as="p" variant="body-sm" tone="muted" className="mt-2 leading-6">
              لا يبدأ التشغيل الحقيقي قبل اكتمال السنة والفترة المالية، الحسابات، الخزنة،
              المخزون، وربط الأدوار التشغيلية بالمخزن.
            </Text>
          </div>

          {children}
        </aside>
      </div>
    </section>
  );
}
