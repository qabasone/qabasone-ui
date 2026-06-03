import type { HTMLAttributes, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

const VARIANT_STYLES: Record<string, { className: string; title: string }> = {
    normal: { className: "qbs-badge", title: "معلومات" },
    muted: { className: "qbs-badge text-muted-foreground", title: "معلومات" },
    success: { className: "qbs-badge-success", title: "ناجح" },
    warning: { className: "qbs-badge-warning", title: "تنبيه" },
    critical: { className: "qbs-badge-danger", title: "خطأ" },
    info: { className: "qbs-badge-info", title: "معلومات" },
    draft: { className: "qbs-badge text-muted-foreground", title: "مسودة" },
    posted: { className: "qbs-badge-success", title: "مرحّل" },
    cancelled: { className: "qbs-badge text-muted-foreground", title: "ملغى" },
    failed: { className: "qbs-badge-danger", title: "فشل" },
};

function cx(...values: Array<string | undefined | null | false>) {
    return values.filter(Boolean).join(" ");
}

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    label: string;
    variant?: keyof typeof VARIANT_STYLES;
    icon?: ReactNode;
    size?: "sm" | "md";
    title?: string;
}

export function StatusBadge({
    label,
    variant = "normal",
    icon,
    size = "md",
    title,
    className,
    ...props
}: StatusBadgeProps) {
    const resolved = VARIANT_STYLES[variant] ?? VARIANT_STYLES.normal;
    const defaultIcon =
        variant === "success"
            ? <CheckCircle2 size={14} />
            : variant === "warning"
                ? <AlertTriangle size={14} />
                : variant === "critical"
                    ? <XCircle size={14} />
                    : <Info size={14} />;

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1 rounded-full px-2.5 font-medium",
                size === "sm" ? "h-7 text-xs" : "h-8 text-sm",
                resolved.className,
                className
            )}
            title={title ?? resolved.title}
            {...props}
        >
            <span className="shrink-0">{icon ?? defaultIcon}</span>
            <span>{label}</span>
        </span>
    );
}
