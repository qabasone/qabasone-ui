import type { CSSProperties, ReactNode } from "react";

type Direction = "rtl" | "ltr" | "auto";
type LoaderSize = "sm" | "md" | "lg";
type LoaderTone = "primary" | "success" | "warning" | "neutral";

export interface QabasLoaderProps {
  label?: ReactNode;
  description?: ReactNode;
  size?: LoaderSize;
  tone?: LoaderTone;
  showText?: boolean;
  centered?: boolean;
  dir?: Direction;
  className?: string;
  style?: CSSProperties;
}

export interface QabasPageLoaderStep {
  id: string;
  label: ReactNode;
  status?: "done" | "active" | "pending";
}

export interface QabasPageLoaderProps extends QabasLoaderProps {
  fullScreen?: boolean;
  brandName?: ReactNode;
  steps?: QabasPageLoaderStep[];
  footer?: ReactNode;
  panelClassName?: string;
}

export interface QabasInlineLoaderProps extends Omit<QabasLoaderProps, "showText" | "centered"> {
  label?: ReactNode;
  compact?: boolean;
}

export interface QabasLoadingOverlayProps {
  loading: boolean;
  children: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  tone?: LoaderTone;
  blur?: boolean;
  dir?: Direction;
  className?: string;
  overlayClassName?: string;
  style?: CSSProperties;
}

export interface QabasSkeletonProps {
  rows?: number;
  avatar?: boolean;
  actions?: boolean;
  dense?: boolean;
  className?: string;
  style?: CSSProperties;
}

const TONE_COLORS: Record<LoaderTone, { color: string; soft: string }> = {
  primary: { color: "var(--primary)", soft: "var(--primary-muted)" },
  success: { color: "var(--success)", soft: "var(--success-muted)" },
  warning: { color: "var(--warning)", soft: "var(--warning-muted)" },
  neutral: { color: "var(--foreground)", soft: "var(--muted)" },
};

const DEFAULT_STEPS: QabasPageLoaderStep[] = [
  { id: "identity", label: "تحميل هوية النظام", status: "done" },
  { id: "permissions", label: "مراجعة الصلاحيات", status: "active" },
  { id: "workspace", label: "تجهيز مساحة العمل", status: "pending" },
];

function cx(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

function withLoaderTone(tone: LoaderTone, style?: CSSProperties): CSSProperties {
  const colors = TONE_COLORS[tone];
  return {
    "--qbs-loader-color": colors.color,
    "--qbs-loader-soft": colors.soft,
    ...style,
  } as CSSProperties;
}

function StatusText({ label }: { label: ReactNode }) {
  return <span className="sr-only">{label}</span>;
}

function BrandMark({ size }: { size: LoaderSize }) {
  return (
    <span className="qbs-loader-mark" data-size={size} aria-hidden="true">
      <span className="qbs-loader-orbit qbs-loader-orbit-main" />
      <span className="qbs-loader-orbit qbs-loader-orbit-soft" />
      <span className="qbs-loader-mark-core">ق</span>
      <span className="qbs-loader-ledger">
        <span />
        <span />
        <span />
      </span>
    </span>
  );
}

export function QabasLoader({
  label = "جاري التحميل",
  description,
  size = "md",
  tone = "primary",
  showText = true,
  centered = false,
  dir = "rtl",
  className,
  style,
}: QabasLoaderProps) {
  return (
    <div
      dir={dir}
      role="status"
      aria-live="polite"
      className={cx(
        "inline-flex items-center gap-3",
        centered && "w-full justify-center",
        className
      )}
      style={withLoaderTone(tone, style)}
    >
      <BrandMark size={size} />
      {showText ? (
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-foreground">{label}</span>
          {description ? (
            <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
          ) : null}
        </span>
      ) : (
        <StatusText label={label} />
      )}
    </div>
  );
}

export function QabasInlineLoader({
  label = "جاري التنفيذ",
  description,
  size = "sm",
  tone = "primary",
  compact = false,
  dir = "rtl",
  className,
  style,
}: QabasInlineLoaderProps) {
  return (
    <QabasLoader
      dir={dir}
      size={size}
      tone={tone}
      label={label}
      description={compact ? undefined : description}
      className={cx("rounded-lg border border-border bg-card px-2.5 py-2 shadow-sm", className)}
      style={style}
      showText={!compact}
    />
  );
}

export function QabasPageLoader({
  label = "جاري تجهيز الصفحة",
  description = "نقوم بتحميل البيانات الأساسية وتجهيز واجهة العمل.",
  size = "lg",
  tone = "primary",
  showText = true,
  centered,
  dir = "rtl",
  fullScreen = false,
  brandName = "قابس",
  steps = DEFAULT_STEPS,
  footer,
  className,
  panelClassName,
  style,
}: QabasPageLoaderProps) {
  return (
    <section
      dir={dir}
      role="status"
      aria-live="polite"
      className={cx(
        "flex items-center justify-center bg-background p-6",
        fullScreen ? "fixed inset-0 z-[9999]" : "min-h-[360px] rounded-xl border border-border",
        centered && "text-center",
        className
      )}
      style={withLoaderTone(tone, style)}
    >
      <div className={cx("qbs-panel w-full max-w-[440px] overflow-hidden p-5", panelClassName)}>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">{brandName}</p>
            {showText ? (
              <>
                <p className="mt-1 text-base font-semibold text-foreground">{label}</p>
                {description ? (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                ) : null}
              </>
            ) : (
              <StatusText label={label} />
            )}
          </div>
          <BrandMark size={size} />
        </div>

        <div className="qbs-loading-rail mt-5" aria-hidden="true" />

        {steps.length ? (
          <ol className="mt-5 grid gap-2">
            {steps.map((step) => (
              <li
                key={step.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/25 px-3 py-2 text-sm"
              >
                <span
                  className={cx(
                    "h-2 w-2 shrink-0 rounded-full",
                    step.status === "done" && "bg-success",
                    step.status === "active" && "bg-primary",
                    (!step.status || step.status === "pending") && "bg-muted-foreground/35"
                  )}
                />
                <span className="min-w-0 flex-1 text-foreground">{step.label}</span>
                {step.status === "active" ? (
                  <span className="text-xs font-medium text-primary">قيد التحميل</span>
                ) : null}
              </li>
            ))}
          </ol>
        ) : null}

        {footer ? <div className="mt-4 text-xs text-muted-foreground">{footer}</div> : null}
      </div>
    </section>
  );
}

export function QabasLoadingOverlay({
  loading,
  children,
  label = "جاري تحديث البيانات",
  description,
  tone = "primary",
  blur = true,
  dir = "rtl",
  className,
  overlayClassName,
  style,
}: QabasLoadingOverlayProps) {
  return (
    <div className={cx("relative", className)} style={style}>
      {children}
      {loading ? (
        <div
          dir={dir}
          className={cx(
            "absolute inset-0 z-10 flex items-center justify-center rounded-xl border border-border bg-card/90 p-4",
            blur && "backdrop-blur-[2px]",
            overlayClassName
          )}
          style={withLoaderTone(tone)}
        >
          <QabasLoader label={label} description={description} tone={tone} size="md" />
        </div>
      ) : null}
    </div>
  );
}

export function QabasSkeleton({
  rows = 4,
  avatar = false,
  actions = false,
  dense = false,
  className,
  style,
}: QabasSkeletonProps) {
  const safeRows = Math.max(1, rows);

  return (
    <div
      className={cx("rounded-xl border border-border bg-card p-4", className)}
      style={withLoaderTone("primary", style)}
      aria-hidden="true"
    >
      <div className="flex items-start gap-3">
        {avatar ? <span className="qbs-skeleton-line h-10 w-10 shrink-0 rounded-full" /> : null}
        <div className="min-w-0 flex-1 space-y-2">
          {Array.from({ length: safeRows }).map((_, index) => (
            <span
              key={index}
              className={cx("qbs-skeleton-line block rounded-full", dense ? "h-2.5" : "h-3")}
              style={{
                width: `${index === safeRows - 1 ? 48 : index === 0 ? 78 : 64 + (index % 2) * 12}%`,
              }}
            />
          ))}
        </div>
      </div>
      {actions ? (
        <div className="mt-4 flex justify-end gap-2">
          <span className="qbs-skeleton-line h-8 w-20 rounded-lg" />
          <span className="qbs-skeleton-line h-8 w-24 rounded-lg" />
        </div>
      ) : null}
    </div>
  );
}
